// src/store/appSettingsStore.js - ACTUALIZADO con dockPosition
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppSettingsStore = create(
  persist(
    (set, get) => ({
      // ==================== SONIDO ====================
      soundEnabled: true,
      soundVolume: 0.6,
      systemSoundEnabled: false,
      
      // ==================== NOTIFICACIONES ====================
      notificationsEnabled: true,
      showOnLockScreen: false,
      browserNotificationsEnabled: false,
      
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
      fontSize: 1.0,
      dockPosition: 'bottom', // 👈 NUEVO: Posición del Dock ('bottom', 'left', 'right')
      dockHidden: false,
      // ==================== VOLÚMENES DE SONIDO ====================
      soundVolumes: {
        click: 0.3,
        hover: 0.2,
        windowOpen: 0.4,
        windowClose: 0.4,
        windowMinimize: 0.3,
        windowMaximize: 0.4
      },

      // ==================== ACTIONS - SONIDO ====================
      setSoundVolumeByType: (soundType, volume) => set((state) => ({
        soundVolumes: {
          ...state.soundVolumes,
          [soundType]: volume
        }
      })),

      migrateLegacyVolumes: () => {
        const legacyKeys = [
          'soundVolume_click',
          'soundVolume_hover', 
          'soundVolume_windowOpen',
          'soundVolume_windowClose',
          'soundVolume_windowMinimize',
          'soundVolume_windowMaximize'
        ];
        
        const currentVolumes = get().soundVolumes;
        const newVolumes = { ...currentVolumes };
        let migrated = false;
        
        legacyKeys.forEach(key => {
          const legacyValue = localStorage.getItem(key);
          if (legacyValue !== null && legacyValue !== undefined) {
            const soundType = key.replace('soundVolume_', '');
            newVolumes[soundType] = Number(legacyValue);
            
            localStorage.removeItem(key);
            console.log(`Migrated ${key} = ${legacyValue} to app-settings`);
            migrated = true;
          }
        });
        
        if (migrated) {
          set({ soundVolumes: newVolumes });
          
          const currentState = get();
          localStorage.setItem('app-settings', JSON.stringify({
            state: {
              ...currentState,
              soundVolumes: newVolumes
            },
            version: 0
          }));
        }
        
        return newVolumes;
      },

      toggleSound: () => set((state) => {
        const newValue = !state.soundEnabled;
        if (newValue && !state.systemSoundEnabled) {
          get().requestAudioPermission();
        }
        return { soundEnabled: newValue };
      }),
      
      setSoundVolume: (volume) => set({ soundVolume: volume }),
      setSystemSoundEnabled: (enabled) => set({ systemSoundEnabled: enabled }),

      requestAudioPermission: async () => {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          await audioContext.resume();
          set({ systemSoundEnabled: true });
          
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
        if (enabled && !state.browserNotificationsEnabled) {
          get().requestNotificationPermission();
        }
        return { notificationsEnabled: enabled };
      }),
      
      setShowOnLockScreen: (enabled) => set({ showOnLockScreen: enabled }),
      
      setBrowserNotificationsEnabled: (enabled) => {
        set({ browserNotificationsEnabled: enabled });
        if (enabled) {
          localStorage.setItem('notifications-permission-granted', 'true');
        } else {
          localStorage.removeItem('notifications-permission-granted');
        }
      },

      requestNotificationPermission: async () => {
        if (!('Notification' in window)) {
          console.warn('Este navegador no soporta notificaciones');
          return false;
        }

        try {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';
          
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
          console.error('Error al solicitar permiso:', error);
          set({ browserNotificationsEnabled: false });
          return false;
        }
      },

      checkNotificationPermission: () => {
        if ('Notification' in window) {
          const permission = Notification.permission;
          const granted = permission === 'granted';
          
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
      
      setFontSize: (size) => {
        set({ fontSize: size });
        document.documentElement.style.setProperty('--font-scale', size);
      },
      
      // 👇 NUEVO: Action para cambiar posición del Dock
      setDockPosition: (position) => {
        if (!['bottom', 'left', 'right'].includes(position)) {
          console.error('Invalid dock position:', position);
          return;
        }
        set({ dockPosition: position });
        console.log('✅ Dock position saved:', position);
      },

      toggleDockVisibility: () => set((state) => {
  const newValue = !state.dockHidden;
  console.log(`✅ Dock ${newValue ? 'ocultado' : 'mostrado'}`);
  return { dockHidden: newValue };
}),
setDockHidden: (hidden) => set({ dockHidden: hidden }),
      // ==================== INICIALIZACIÓN ====================
      initialize: () => {
        get().checkNotificationPermission();
        
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
          set({ systemSoundEnabled: true });
        }
        
        get().migrateLegacyVolumes();
        
        // Aplicar fontSize
        const { fontSize } = get();
        if (fontSize) {
          document.documentElement.style.setProperty('--font-scale', fontSize);
        }

        // 👇 NUEVO: Migrar dockPosition del localStorage viejo si existe
        const legacyDockPosition = localStorage.getItem('dock-position');
        if (legacyDockPosition) {
          try {
            const parsed = JSON.parse(legacyDockPosition);
            if (parsed.state?.position) {
              set({ dockPosition: parsed.state.position });
              localStorage.removeItem('dock-position');
              console.log('✅ Migrated dock position from localStorage');
            }
          } catch (e) {
            console.warn('Could not migrate dock position');
          }
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
        wallpaper: state.wallpaper,
        fontSize: state.fontSize,
        soundVolumes: state.soundVolumes,
        dockPosition: state.dockPosition, // 👈 NUEVO
        dockHidden: state.dockHidden,
      })
    }
  )
);