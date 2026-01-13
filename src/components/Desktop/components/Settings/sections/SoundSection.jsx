// src/components/Settings/sections/SoundSection.jsx
import { Volume2, VolumeX, AlertCircle } from '#assets/icons';
import { useAppSettingsStore } from '#store/appSettingsStore';
import { useState, useEffect } from 'react';
import NotificationsSection from "#components/Desktop/components/Settings/sections/NotificationsSection";
import useSounds from '#hooks/useSounds';

const SoundSection = () => {
  const { 
    soundEnabled, 
    soundVolume, 
    soundVolumes,
    systemSoundEnabled,
    toggleSound, 
    setSoundVolume,
    setSoundVolumeByType, // ✅ Ahora esta función existe
    requestAudioPermission
  } = useAppSettingsStore(); // ✅ Viene del store correcto

  const sounds = useSounds();
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);


  // 👇 Inicializar sonidos al montar
  useEffect(() => {
    sounds.initSounds();
    
    // Aplicar volúmenes del store a los sonidos
    Object.entries(soundVolumes).forEach(([key, vol]) => {
      sounds.setVolume(key, vol);
    });
  }, [soundVolumes]); // 👈 Depende de soundVolumes



  // 🎛️ Sincronizar el switch con los sonidos globales
  useEffect(() => {
    sounds.setGlobalSoundsEnabled(soundEnabled && systemSoundEnabled);
  }, [soundEnabled, systemSoundEnabled]);

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

  // 👇 Manejar cambio de volumen individual
   const handleIndividualVolumeChange = (soundType, e) => {
    const newVolume = parseFloat(e.target.value);
    
 setSoundVolumeByType(soundType, newVolume);
    
sounds.setVolume(soundType, newVolume);
  };

  const testSound = () => {
    const audio = new Audio('/sounds/unlocked_achievement.mp3');
    audio.volume = soundVolume;
    
    audio.play().catch(() => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 523.25;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(soundVolume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    });
  };

  return (
    <div className="space-y-6">
      <NotificationsSection />
      <div className='mt-12' data-no-click-sound="true">
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

        {/* Control de volumen de alertas */}
        {soundEnabled && systemSoundEnabled && (
          <div className="mt-4 mb-10 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
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

            

        {/* 👇 CONTROLES INDIVIDUALES */}
        {soundEnabled && systemSoundEnabled && (
          <div className="mt-6 mb-10 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Efectos del sistema
            </h4>
            
            <div className="space-y-4">
              {/* Click */}
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    🖱️ Click
                  </label>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {Math.round(soundVolumes.click * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Slider personalizado */}
                  <div className="relative flex-1 h-4 group" data-no-click-sound="true">
                    <style>{`
                      .slider-click::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.15s ease;
                      }
                      .slider-click::-webkit-slider-thumb:hover {
                        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15);
                        transform: scale(1.1);
                      }
                      .slider-click::-webkit-slider-thumb:active {
                        box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
                      }
                      .dark .slider-click::-webkit-slider-thumb {
                        background: #f3f4f6;
                        border-color: #60a5fa;
                      }
                      .slider-click::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      }
                    `}</style>
                    
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                        style={{ width: `${soundVolumes.click * 100}%` }}
                      />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={soundVolumes.click}
                      onChange={(e) => handleIndividualVolumeChange('click', e)}
                      className="slider-click absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <button
                    data-no-click-sound="true" onClick={sounds.playClick}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow flex-shrink-0"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Abrir ventana */}
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    📂 Abrir ventana
                  </label>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {Math.round(soundVolumes.windowOpen * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 h-4 group" data-no-click-sound="true">
                    <style>{`
                      .slider-windowOpen::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.15s ease;
                      }
                      .slider-windowOpen::-webkit-slider-thumb:hover {
                        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15);
                        transform: scale(1.1);
                      }
                      .slider-windowOpen::-webkit-slider-thumb:active {
                        box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
                      }
                      .dark .slider-windowOpen::-webkit-slider-thumb {
                        background: #f3f4f6;
                        border-color: #60a5fa;
                      }
                    `}</style>
                    
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                        style={{ width: `${soundVolumes.windowOpen * 100}%` }}
                      />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={soundVolumes.windowOpen}
                      onChange={(e) => handleIndividualVolumeChange('windowOpen', e)}
                      className="slider-windowOpen absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <button
                    data-no-click-sound="true" onClick={sounds.playWindowOpen}
              
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow flex-shrink-0"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Cerrar ventana */}
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    ❌ Cerrar ventana
                  </label>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {Math.round(soundVolumes.windowClose * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 h-4 group" data-no-click-sound="true">
                    <style>{`
                      .slider-windowClose::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.15s ease;
                      }
                      .slider-windowClose::-webkit-slider-thumb:hover {
                        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15);
                        transform: scale(1.1);
                      }
                      .slider-windowClose::-webkit-slider-thumb:active {
                        box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
                      }
                      .dark .slider-windowClose::-webkit-slider-thumb {
                        background: #f3f4f6;
                        border-color: #60a5fa;
                      }
                    `}</style>
                    
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                        style={{ width: `${soundVolumes.windowClose * 100}%` }}
                      />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={soundVolumes.windowClose}
                      onChange={(e) => handleIndividualVolumeChange('windowClose', e)}
                      className="slider-windowClose absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <button
                    data-no-click-sound="true" onClick={sounds.playWindowClose}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow flex-shrink-0"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Minimizar */}
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    ➖ Minimizar
                  </label>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {Math.round(soundVolumes.windowMinimize * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 h-4 group" data-no-click-sound="true">
                    <style>{`
                      .slider-windowMinimize::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.15s ease;
                      }
                      .slider-windowMinimize::-webkit-slider-thumb:hover {
                        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15);
                        transform: scale(1.1);
                      }
                      .slider-windowMinimize::-webkit-slider-thumb:active {
                        box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
                      }
                      .dark .slider-windowMinimize::-webkit-slider-thumb {
                        background: #f3f4f6;
                        border-color: #60a5fa;
                      }
                    `}</style>
                    
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                        style={{ width: `${soundVolumes.windowMinimize * 100}%` }}
                      />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={soundVolumes.windowMinimize}
                      onChange={(e) => handleIndividualVolumeChange('windowMinimize', e)}
                      className="slider-windowMinimize absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <button
                    data-no-click-sound="true" onClick={sounds.playWindowMinimize}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow flex-shrink-0"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Maximizar */}
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    ⬜ Maximizar
                  </label>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {Math.round(soundVolumes.windowMaximize * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 h-4 group" data-no-click-sound="true">
                    <style>{`
                      .slider-windowMaximize::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.15s ease;
                      }
                      .slider-windowMaximize::-webkit-slider-thumb:hover {
                        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15);
                        transform: scale(1.1);
                      }
                      .slider-windowMaximize::-webkit-slider-thumb:active {
                        box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
                      }
                      .dark .slider-windowMaximize::-webkit-slider-thumb {
                        background: #f3f4f6;
                        border-color: #60a5fa;
                      }
                    `}</style>
                    
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                        style={{ width: `${soundVolumes.windowMaximize * 100}%` }}
                      />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={soundVolumes.windowMaximize}
                      onChange={(e) => handleIndividualVolumeChange('windowMaximize', e)}
                      className="slider-windowMaximize absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <button
                    data-no-click-sound="true" onClick={sounds.playWindowMaximize}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow flex-shrink-0"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Hover */}
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    👆 Hover
                  </label>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {Math.round(soundVolumes.hover * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 h-4 group" data-no-click-sound="true">
                    <style>{`
                      .slider-hover::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 1.5px solid #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.15s ease;
                      }
                      .slider-hover::-webkit-slider-thumb:hover {
                        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15);
                        transform: scale(1.1);
                      }
                      .slider-hover::-webkit-slider-thumb:active {
                        box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
                      }
                      .dark .slider-hover::-webkit-slider-thumb {
                        background: #f3f4f6;
                        border-color: #60a5fa;
                      }
                    `}</style>
                    
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                        style={{ width: `${soundVolumes.hover * 100}%` }}
                      />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={soundVolumes.hover}
                      onChange={(e) => handleIndividualVolumeChange('hover', e)}
                      className="slider-hover absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <button
                    data-no-click-sound="true" onClick={sounds.playHover}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow flex-shrink-0"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundSection;
