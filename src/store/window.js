// src/store/window.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants/index.js";

const MAX_Z_INDEX = 9998; 

const useWindowStore = create(
    immer((set) => ({
        windows: WINDOW_CONFIG,
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey, data = null) => set((state) => {
            const win = state.windows[windowKey];
            win.isOpen = true;
            win.isMinimized = false; // ⭐ Asegurar que no esté minimizada
            win.zIndex = Math.min(state.nextZIndex, MAX_Z_INDEX);
            win.data = data ?? win.data;
            state.nextZIndex++;
        }),

        closeWindow: (windowKey) => set((state) => {
            const win = state.windows[windowKey];
            win.isOpen = false;
            win.isMinimized = false; // ⭐ Limpiar estado
            win.zIndex = INITIAL_Z_INDEX;
            win.data = null;
        }),

        focusWindow: (windowKey) => set((state) => {
            const win = state.windows[windowKey];
            win.isMinimized = false; // ⭐ Auto-restaurar al hacer focus
            win.zIndex = Math.min(state.nextZIndex++, MAX_Z_INDEX);
        }),

        // ⭐ NUEVA: Minimizar ventana
        minimizeWindow: (windowKey) => set((state) => {
            const win = state.windows[windowKey];
            win.isMinimized = true;
        }),

        // ⭐ NUEVA: Restaurar ventana
        restoreWindow: (windowKey) => set((state) => {
            const win = state.windows[windowKey];
            win.isMinimized = false;
            win.zIndex = Math.min(state.nextZIndex++, MAX_Z_INDEX);
        }),

        // ⭐ NUEVA: Toggle minimizar
        toggleMinimize: (windowKey) => set((state) => {
            const win = state.windows[windowKey];
            win.isMinimized = !win.isMinimized;
            if (!win.isMinimized) {
                win.zIndex = Math.min(state.nextZIndex++, MAX_Z_INDEX);
            }
        }),
    })),
);

export default useWindowStore;