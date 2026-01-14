// src/store/window.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants/index.js";

const MAX_Z_INDEX = 9998;
const STORAGE_VERSION = 1;

// 🔧 Validar que la ventana esté dentro del viewport
const validateWindowPosition = (win) => {
  if (!win.position || typeof window === "undefined") return win;

  const { x, y } = win.position;
  const { width = 800, height = 600 } = win.size || {};
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Permitir que hasta 50% de la ventana quede fuera
  const minX = -width * 0.5;
  const minY = -height * 0.5;
  const maxX = viewportWidth - width * 0.5;
  const maxY = viewportHeight - height * 0.5;

  return {
    ...win,
    position: {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    },
  };
};


const useWindowStore = create(
    persist(
        immer((set, get) => ({
            windows: WINDOW_CONFIG,
            nextZIndex: INITIAL_Z_INDEX + 1,
            version: STORAGE_VERSION,

            openWindow: (windowKey, data = null) => set((state) => {
                const win = state.windows[windowKey];
                win.isOpen = true;
                win.isMinimized = false;
                win.zIndex = Math.min(state.nextZIndex, MAX_Z_INDEX);
                win.data = data ?? win.data;
                state.nextZIndex++;
            }),

            closeWindow: (windowKey) => set((state) => {
                const win = state.windows[windowKey];
                win.isOpen = false;
                win.isMinimized = false;
                win.zIndex = INITIAL_Z_INDEX;
                win.data = null;
            }),

            focusWindow: (windowKey) => set((state) => {
                const win = state.windows[windowKey];
                win.isMinimized = false;
                win.zIndex = Math.min(state.nextZIndex++, MAX_Z_INDEX);
            }),

            minimizeWindow: (windowKey) => set((state) => {
                const win = state.windows[windowKey];
                win.isMinimized = true;
            }),

            restoreWindow: (windowKey) => set((state) => {
                const win = state.windows[windowKey];
                win.isMinimized = false;
                win.zIndex = Math.min(state.nextZIndex++, MAX_Z_INDEX);
            }),

            toggleMinimize: (windowKey) => set((state) => {
                const win = state.windows[windowKey];
                win.isMinimized = !win.isMinimized;
                if (!win.isMinimized) {
                    win.zIndex = Math.min(state.nextZIndex++, MAX_Z_INDEX);
                }
            }),

            // 🆕 Guardar posición de ventana (llamar en onDragStop)
            saveWindowPosition: (windowKey, position) => set((state) => {
                const win = state.windows[windowKey];

                console.log(`💾 Intentando guardar posición de ${windowKey}:`, position);
                console.log(`📍 Posición actual:`, win.position);

                // ⚠️ OPTIMIZACIÓN: No actualizar si la posición es la misma
                if (win.position?.x === position.x && win.position?.y === position.y) {
                    console.log(`⏭️ Posición idéntica, saltando actualización`);
                    return; // No hacer nada, evita re-render
                }

                win.position = position;
                console.log(`✅ Posición guardada:`, win.position);
            }),

            // 🆕 Guardar tamaño de ventana (llamar en onResizeStop)
            saveWindowSize: (windowKey, size) => set((state) => {
                const win = state.windows[windowKey];

                // ⚠️ OPTIMIZACIÓN: No actualizar si el tamaño es el mismo
                if (win.size?.width === size.width && win.size?.height === size.height) {
                    return; // No hacer nada, evita re-render
                }

                win.size = size;
            }),

            // 🆕 Guardar estado de maximizado
            saveMaximizedState: (windowKey, isMaximized) => set((state) => {
                const win = state.windows[windowKey];
                win.isMaximized = isMaximized;
            }),

            // 🆕 Validar todas las ventanas (llamar al cargar la app)
            validateAllWindows: () => set((state) => {
                Object.keys(state.windows).forEach((key) => {
                    const win = state.windows[key];
                    if (win.position) {
                        state.windows[key] = validateWindowPosition(win);
                    }
                });
            }),

            // 🆕 Reset a valores por defecto (útil para debugging)
            resetWindows: () => set((state) => {
                state.windows = WINDOW_CONFIG;
                state.nextZIndex = INITIAL_Z_INDEX + 1;
            })
        })),
        {
            name: 'window-storage', // Nombre en localStorage
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => localStorage),

            // 📦 Particializar: solo guardar lo necesario
            partialize: (state) => ({
                windows: Object.fromEntries(
                    Object.entries(state.windows).map(([key, win]) => [
                        key,
                        {
                            isOpen: win.isOpen,
                            isMinimized: win.isMinimized,
                            isMaximized: win.isMaximized,
                            position: win.position,
                            size: win.size,
                            zIndex: win.zIndex,
                            // ⚠️ NO guardar 'data' para evitar problemas con datos sensibles
                        }
                    ])
                ),
                nextZIndex: state.nextZIndex,
                version: state.version
            }),

            // 🔄 Merge: cómo combinar estado guardado con estado inicial
            merge: (persistedState, currentState) => {
                console.log('🔄 Merging state:', { persistedState, currentState });

                // Si no hay estado guardado o la versión es diferente, usar estado actual
                if (!persistedState || persistedState.version !== STORAGE_VERSION) {
                    console.warn('⚠️ No persisted state or version mismatch');
                    return currentState;
                }

                // Combinar estado guardado con configuración por defecto
                const mergedWindows = { ...currentState.windows };

                Object.entries(persistedState.windows || {}).forEach(([key, savedWin]) => {
                    if (mergedWindows[key]) {
                        console.log(`📝 Merging ${key}:`, savedWin);
                        mergedWindows[key] = {
                            ...mergedWindows[key], // Mantener configuración por defecto
                            ...savedWin,           // Sobrescribir con estado guardado
                            data: null             // Siempre resetear data
                        };
                    }
                });

                const merged = {
                    ...currentState,
                    windows: mergedWindows,
                    nextZIndex: persistedState.nextZIndex || currentState.nextZIndex
                };

                console.log('✅ Merged state:', merged);
                return merged;
            },

            // ⚠️ Manejo de errores
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Error al restaurar ventanas:', error);
                    localStorage.removeItem('window-storage');
                    return;
                }

                if (state) {
                    // Validar ventanas después de cargar
                    console.log('✅ Ventanas restauradas desde localStorage');
                    setTimeout(() => {
                        state.validateAllWindows();
                    }, 100);
                }
            }
        }
    )
);

export default useWindowStore;