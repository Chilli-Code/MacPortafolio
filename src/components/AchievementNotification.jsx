// src/components/AchievementNotification.jsx

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Trophy, Star, Zap, Target, Award, TrendingUp } from '#assets/icons';
import { create } from 'zustand';
import { useAppSettingsStore } from '#store/notificationStore';

// Store LOCAL para manejar solo las notificaciones (no el sonido)
export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));

// Iconos según tipo de logro
const achievementIcons = {
  level: Trophy,
  task: Target,
  streak: Zap,
  milestone: Award,
  skill: Star,
  earning: TrendingUp
};

// Colores según tipo
const achievementColors = {
  level: { from: 'from-yellow-400', to: 'to-orange-500', glow: 'shadow-yellow-500/50' },
  task: { from: 'from-green-400', to: 'to-emerald-500', glow: 'shadow-green-500/50' },
  streak: { from: 'from-orange-400', to: 'to-red-500', glow: 'shadow-orange-500/50' },
  milestone: { from: 'from-purple-400', to: 'to-pink-500', glow: 'shadow-purple-500/50' },
  skill: { from: 'from-blue-400', to: 'to-cyan-500', glow: 'shadow-blue-500/50' },
  earning: { from: 'from-green-400', to: 'to-teal-500', glow: 'shadow-green-500/50' }
};

// Mapeo de sonidos según tipo
const achievementSounds = {
  default: '/sounds/unlocked_achievement.mp3'
};

// Hook personalizado para manejar audio CON VOLUMEN GLOBAL
const useAchievementSound = (type, enabled, volume) => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false); // ⭐ AGREGAR ESTA LÍNEA

  useEffect(() => {
    // ⭐ EVITAR REPRODUCCIÓN MÚLTIPLE
    if (!enabled || hasPlayedRef.current) return;

    // Crear elemento de audio
    const soundPath = achievementSounds[type] || achievementSounds.default;
    audioRef.current = new Audio(soundPath);
    
    // ⭐ USAR EL VOLUMEN GLOBAL
    audioRef.current.volume = volume;

    // Reproducir sonido
    const playSound = async () => {
      try {
        await audioRef.current.play();
        hasPlayedRef.current = true; // ⭐ MARCAR COMO REPRODUCIDO
      } catch (error) {
        console.log('Error playing sound:', error);

      }
    };

    playSound();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [type, enabled, volume]);
};

const AchievementNotification = ({ notification, onClose }) => {
  const notificationRef = useRef(null);
  const iconRef = useRef(null);
  const particlesRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);
  
  // ⭐ OBTENER CONFIGURACIÓN GLOBAL
  const soundEnabled = useAppSettingsStore(state => state.soundEnabled);
  const soundVolume = useAppSettingsStore(state => state.soundVolume);
  const systemSoundEnabled = useAppSettingsStore(state => state.systemSoundEnabled);

  const Icon = achievementIcons[notification.type] || Trophy;
  const colors = achievementColors[notification.type] || achievementColors.level;

  // ⭐ REPRODUCIR SONIDO CON VOLUMEN GLOBAL
  useAchievementSound(
    notification.type, 
    soundEnabled && systemSoundEnabled, 
    soundVolume // Pasar el volumen global
  );

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animación de entrada
    tl.fromTo(notificationRef.current,
      { 
        y: -100, 
        opacity: 0,
        scale: 0.8,
        rotateY: -20
      },
      { 
        y: 0, 
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }
    );

    // Animación del icono
    tl.fromTo(iconRef.current,
      { 
        scale: 0,
        rotation: -180
      },
      { 
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      },
      '-=0.4'
    );

    // Animación de pulso del icono
    gsap.to(iconRef.current, {
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Crear partículas
    createParticles();

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      tl.kill();
    };
  }, []);

  const createParticles = () => {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 rounded-full';
      particle.style.background = `hsl(${Math.random() * 60 + 30}, 100%, 60%)`;
      particle.style.left = '50%';
      particle.style.top = '50%';
      
      notificationRef.current.appendChild(particle);
      particlesRef.current.push(particle);

      // Animación de partículas
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        opacity: 0,
        scale: 0,
        duration: 1.5 + Math.random(),
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  };

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onClose(notification.id);
      }
    });

    tl.to(notificationRef.current, {
      x: 400,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'back.in(1.7)'
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={notificationRef}
      className="relative w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden cursor-pointer"
      onClick={handleClose}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Borde animado con gradiente */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.from} ${colors.to} opacity-20 animate-pulse`} />
      
      {/* Efecto de brillo superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

      <div className="relative p-4 flex items-start gap-4">
        {/* Icono del logro */}
        <div
          ref={iconRef}
          className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center shadow-lg ${colors.glow}`}
        >
          <Icon className="w-8 h-8 text-white" />
          
          {/* Anillo de pulso */}
          <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-ping" />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Categoría */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${colors.from} ${colors.to} bg-clip-text text-transparent`}>
              {notification.category || '¡Logro Desbloqueado!'}
            </span>
            {notification.xp && (
              <span className="text-xs font-semibold text-yellow-500 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +{notification.xp} XP
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {notification.title}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {notification.description}
          </p>

          {/* Progreso (opcional) */}
          {notification.progress && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progreso</span>
                <span className="font-semibold">{notification.progress.current}/{notification.progress.total}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} transition-all duration-500`}
                  style={{ width: `${(notification.progress.current / notification.progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botón de cerrar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
        >
          <span className="text-gray-600 dark:text-gray-400 text-xs">✕</span>
        </button>
      </div>

      {/* Efecto de brillo inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
    </div>
  );
};

// Container para múltiples notificaciones
export const AchievementNotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-6 left-1/3 z-[99999] space-y-4 pointer-events-none">
      <div className="space-y-4 pointer-events-auto">
        {notifications.map((notification) => (
          <AchievementNotification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementNotification;