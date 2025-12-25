// src/store/appSettingsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppSettingsStore = create(
  persist(
    (set, get) => ({
      // ==================== SONIDO ====================
      soundEnabled: true,
      soundVolume: 0.6,
      systemSoundEnabled: false, // Permiso del navegador
      
      // ==================== NOTIFICACIONES ====================
      notificationsEnabled: true,
      showOnLockScreen: false,
      browserNotificationsEnabled: false, // Permiso del navegador
      
      // ==================== PERMISOS ====================
      permissions: {
        notifications: false,
        microphone: false,
        camera: false,
        location: false
      },

      // ==================== IDIOMA ====================
      language: 'es',
      region: 'CO',

      // ==================== APARIENCIA ====================
      theme: 'light',
      wallpaper: '/images/wallpapers/wallpaper.webp',

      // ==================== ACTIONS - SONIDO ====================
      toggleSound: () => set((state) => {
        const newValue = !state.soundEnabled;
        
        // Si está activando el sonido, verificar permiso del navegador
        if (newValue && !state.systemSoundEnabled) {
          // Mostrar alerta para activar sonido
          get().requestAudioPermission();
        }
        
        return { soundEnabled: newValue };
      }),
      
      setSoundVolume: (volume) => set({ soundVolume: volume }),
      
      setSystemSoundEnabled: (enabled) => set({ systemSoundEnabled: enabled }),

      requestAudioPermission: async () => {
        // Crear un audio context para solicitar permiso
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          await audioContext.resume();
          set({ systemSoundEnabled: true });
          
          // Reproducir sonido de prueba silencioso
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.01;
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          
          return true;
        } catch (error) {
          console.error('Error requesting audio permission:', error);
          set({ systemSoundEnabled: false });
          return false;
        }
      },

      // ==================== ACTIONS - NOTIFICACIONES ====================
      setNotificationsEnabled: (enabled) => set((state) => {
        // Si está activando notificaciones, verificar permiso del navegador
        if (enabled && !state.browserNotificationsEnabled) {
          get().requestNotificationPermission();
        }
        return { notificationsEnabled: enabled };
      }),
      
      setShowOnLockScreen: (enabled) => set({ showOnLockScreen: enabled }),
      
    setBrowserNotificationsEnabled: (enabled) => {
  set({ browserNotificationsEnabled: enabled });
  
  // Guardar en localStorage
  if (enabled) {
    localStorage.setItem('notifications-permission-granted', 'true');
  } else {
    localStorage.removeItem('notifications-permission-granted');
  }
},

// En appSettingsStore.js, modifica requestNotificationPermission:
requestNotificationPermission: async () => {
  // ⭐⭐ IMPORTANTE: Esta función debe ser llamada DESDE UN CLICK del usuario
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }

  try {
    console.log('🔔 Solicitando permiso de notificaciones...');
    
    // Esta es la llamada que mostrará la ventana nativa del navegador
    const permission = await Notification.requestPermission();
    console.log('🔔 Resultado del permiso:', permission);
    
    const granted = permission === 'granted';
    
    // Guardar en localStorage para recordar la decisión
    if (granted) {
      localStorage.setItem('notifications-permission-granted', 'true');
      localStorage.setItem('notifications-permission-timestamp', Date.now().toString());
    }
    
    set({ 
      browserNotificationsEnabled: granted,
      notificationsEnabled: granted 
    });
    
    return granted;
  } catch (error) {
    console.error('❌ Error al solicitar permiso:', error);
    set({ browserNotificationsEnabled: false });
    return false;
  }
},

// Añade esta función para verificar automáticamente
checkNotificationPermission: () => {
  if ('Notification' in window) {
    const permission = Notification.permission;
    const granted = permission === 'granted';
    
    console.log('🔔 Verificando permiso:', permission);
    
    set({ 
      browserNotificationsEnabled: granted,
      notificationsEnabled: granted 
    });
    
    return granted;
  }
  return false;
},

      // ==================== ACTIONS - PERMISOS ====================
      setPermission: (permission, value) => set((state) => ({
        permissions: { ...state.permissions, [permission]: value }
      })),

      // ==================== ACTIONS - IDIOMA ====================
      setLanguage: (language) => set({ language }),
      setRegion: (region) => set({ region }),

      // ==================== ACTIONS - APARIENCIA ====================
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),

      // ==================== INICIALIZACIÓN ====================
      initialize: () => {
        // Verificar permisos al iniciar
        get().checkNotificationPermission();
        
        // Verificar audio context
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
          set({ systemSoundEnabled: true });
        }
      }
    }),
    {
      name: 'app-settings',
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        soundVolume: state.soundVolume,
        notificationsEnabled: state.notificationsEnabled,
        showOnLockScreen: state.showOnLockScreen,
        permissions: state.permissions,
        language: state.language,
        region: state.region,
        theme: state.theme,
        wallpaper: state.wallpaper
      })
    }
  )
);