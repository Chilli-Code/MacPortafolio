// src/components/SystemNotification.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, CheckCircle, AlertCircle, Info, Clock } from '#assets/icons';
import { create } from 'zustand';
import { useAppSettingsStore } from '#store/notificationStore';

// Store para notificaciones del sistema
export const useSystemNotificationStore = create((set) => ({
  notifications: [],
  
  addSystemNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { 
      ...notification, 
      id: Date.now() + Math.random() 
    }]
  })),
  
  removeSystemNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearAll: () => set({ notifications: [] })
}));

// Tipos de notificación con sus estilos
const notificationStyles = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    borderColor: 'border-green-500/20',
    bgGlow: 'bg-green-500/5'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    borderColor: 'border-red-500/20',
    bgGlow: 'bg-red-500/5'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-500/20',
    bgGlow: 'bg-blue-500/5'
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/20',
    bgGlow: 'bg-yellow-500/5'
  },
  task: {
    icon: Clock,
    iconColor: 'text-purple-500',
    borderColor: 'border-purple-500/20',
    bgGlow: 'bg-purple-500/5'
  }
};

// Sonidos del sistema
const systemSounds = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  default: '/sounds/notificationN.mp3',
};

// Hook para reproducir sonido del sistema
const useSystemSound = (type, enabled, volume) => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasPlayedRef.current) return;

    const soundPath = systemSounds[type] || systemSounds.default;
    audioRef.current = new Audio(soundPath);
    audioRef.current.volume = volume;

    const playSound = async () => {
      try {
        await audioRef.current.play();
        hasPlayedRef.current = true;
      } catch (error) {
        console.log('Error playing system sound:', error);
      }
    };

    playSound();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [type, enabled, volume]);
};

const SystemNotification = ({ notification, onClose }) => {
  const notificationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  
  // Obtener configuración de sonido
  const soundEnabled = useAppSettingsStore(state => state.soundEnabled);
  const soundVolume = useAppSettingsStore(state => state.soundVolume);
  const systemSoundEnabled = useAppSettingsStore(state => state.systemSoundEnabled);

  const style = notificationStyles[notification.type] || notificationStyles.info;
  const Icon = style.icon;

  // Reproducir sonido
  useSystemSound(
    notification.type,
    soundEnabled && systemSoundEnabled,
    soundVolume
  );

  useEffect(() => {
    // Animación de entrada tipo macOS
    gsap.fromTo(notificationRef.current,
      { 
        y: -100,
        opacity: 0,
        scale: 0.95
      },
      { 
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out'
      }
    );

    // Auto-cerrar después de 4 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, notification.duration || 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    gsap.to(notificationRef.current, {
      y: -100,
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsVisible(false);
        onClose(notification.id);
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={notificationRef}
      className={`
        relative w-96 
        bg-white/90 dark:bg-gray-800/90 
        backdrop-blur-2xl 
        rounded-xl 
        shadow-2xl 
        border ${style.borderColor}
        overflow-hidden
        cursor-pointer
        hover:bg-white/95 dark:hover:bg-gray-800/95
        transition-all
      `}
      onClick={handleClose}
    >
      {/* Barra de color sutil */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${style.bgGlow}`} />

      <div className="relative p-4 flex items-start gap-3">
        {/* Icono */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${style.bgGlow} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* App name (opcional) */}
          {notification.app && (
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {notification.app}
            </p>
          )}

          {/* Título */}
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {notification.title}
          </h4>

          {/* Mensaje */}
          {notification.message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {notification.message}
            </p>
          )}

          {/* Acciones opcionales */}
          {notification.actions && (
            <div className="flex items-center gap-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.();
                    handleClose();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex-shrink-0 w-5 h-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors group"
        >
          <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        </button>
      </div>

      {/* Timestamp (opcional) */}
      {notification.showTime && (
        <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500">
          {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

// Container para notificaciones del sistema
export const SystemNotificationContainer = () => {
  const { notifications, removeSystemNotification } = useSystemNotificationStore();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99998] space-y-3 pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {notifications.map((notification) => (
          <SystemNotification
            key={notification.id}
            notification={notification}
            onClose={removeSystemNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default SystemNotification;