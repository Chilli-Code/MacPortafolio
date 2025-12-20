// src/components/Settings/sections/SoundSection.jsx
import { Volume2, VolumeX, AlertCircle } from '#assets/icons';
import { useAppSettingsStore } from '#store/notificationStore';
import { useState } from 'react';
import NotificationsSection from "#components/Settings/sections/NotificationsSection";
const SoundSection = () => {
  const { 
    soundEnabled, 
    soundVolume, 
    systemSoundEnabled,
    toggleSound, 
    setSoundVolume,
    requestAudioPermission
  } = useAppSettingsStore();

  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  const handleToggleSound = async () => {
    if (!soundEnabled && !systemSoundEnabled) {
      setShowPermissionAlert(true);
      const granted = await requestAudioPermission();
      
      if (granted) {
        toggleSound();
        setShowPermissionAlert(false);
      }
    } else {
      toggleSound();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setSoundVolume(newVolume);
  };

  // ⭐ TEST DE SONIDO CON VOLUMEN GLOBAL
  const testSound = () => {
    const audio = new Audio('/sounds/unlocked_achievement.mp3');
    
    // ⭐ APLICAR EL VOLUMEN GLOBAL
    audio.volume = soundVolume;
    
    audio.play().catch(() => {
      // Fallback con Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 523.25;
      oscillator.type = 'sine';
      
      // ⭐ APLICAR VOLUMEN GLOBAL AL FALLBACK
      gainNode.gain.setValueAtTime(soundVolume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    });
  };

  return (
    <div className="space-y-6">
      <NotificationsSection />
      <div className='mt-12'>
        <h3 className="text-black dark:text-white text-lg font-medium mb-3 flex items-center gap-2">
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          Sonido
        </h3>

        {/* Alerta de permiso */}
        {showPermissionAlert && !systemSoundEnabled && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                Permiso de audio requerido
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Para reproducir sonidos, necesitas dar permiso al navegador. 
                Haz clic en "Permitir" cuando tu navegador lo solicite.
              </p>
            </div>
          </div>
        )}
        
        {/* Toggle de sonido */}
        <label className="dark:bg-gray-800 bg-gray-50 text-black dark:text-white flex items-center justify-between flex-wrap gap-2 p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium block">Activar sonidos de notificación</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Reproduce un sonido cuando recibas una notificación
            </span>
            {!systemSoundEnabled && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 block">
                ⚠️ Permiso del navegador no concedido
              </span>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={soundEnabled}
              onChange={handleToggleSound}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
          </div>
        </label>

        {/* Control de volumen */}
        {soundEnabled && systemSoundEnabled && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Volumen de alertas
              </label>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <VolumeX className="w-4 h-4 text-gray-400" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={soundVolume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
              />
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>

            {/* Indicador visual del volumen */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex-1 flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded transition-all ${
                      i < Math.round(soundVolume * 10)
                        ? 'bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{
                      height: `${(i + 1) * 10}%`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Botón de prueba */}
            <button
              onClick={testSound}
              className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              🔊 Probar sonido al {Math.round(soundVolume * 100)}%
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundSection;