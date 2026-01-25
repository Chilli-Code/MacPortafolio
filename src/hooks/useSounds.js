// src/hooks/useSounds.js
import { Howl } from 'howler';

// 🌍 INSTANCIAS GLOBALES (fuera del hook para que sean compartidas)
let clickSound = null;
let windowOpenSound = null;
let windowCloseSound = null;
let windowMinimizeSound = null;
let windowMaximizeSound = null;
let hoverSound = null;
let introSound = null;
let loaderBiosSound = null;

// 🎛️ CONTROLES GLOBALES
let globalSoundsEnabled = true; // Para el switch principal
let clickSoundEnabled = true;   // Para deshabilitar click en zonas específicas

// 🎚️ Cargar volúmenes desde localStorage
// 🎚️ Cargar volúmenes desde localStorage
const getStoredVolume = (key, defaultValue) => {
  // PRIMERO intentar leer del store de Zustand
  try {
    // Importar dinámicamente para no romper la app
    const storeModule = require('#store/appSettingsStore');
    const store = storeModule.useAppSettingsStore?.getState?.();
    
    if (store?.soundVolumes?.[key] !== undefined) {
      return store.soundVolumes[key];
    }
  } catch (error) {
    // Si falla, continuar con localStorage
  }
  
  // Fallback: leer de localStorage
  const stored = localStorage.getItem(`soundVolume_${key}`);
  return stored ? parseFloat(stored) : defaultValue;
};

// 🎵 Inicializar sonidos globales
const initGlobalSounds = () => {
    if (!introSound) {
    introSound = new Howl({
      src: ['/sounds/intro.mp3'],
      volume: getStoredVolume('intro', 0.5),
      preload: true
    });
  }

  if (!loaderBiosSound) {
    loaderBiosSound = new Howl({
      src: ['/sounds/loaderBios.mp3'],
      volume: getStoredVolume('loaderBios', 0.4),
      preload: true
    });
  }

  if (!clickSound) {
    clickSound = new Howl({
      src: ['/sounds/click.wav'],
      volume: getStoredVolume('click', 0.3),
      preload: true
    });
  }

  if (!windowOpenSound) {
    windowOpenSound = new Howl({
      src: ['/sounds/window-open.wav'],
      volume: getStoredVolume('windowOpen', 0.4),
      preload: true
    });
  }

  if (!windowCloseSound) {
    windowCloseSound = new Howl({
      src: ['/sounds/close.wav'],
      volume: getStoredVolume('windowClose', 0.4),
      preload: true
    });
  }

  if (!windowMinimizeSound) {
    windowMinimizeSound = new Howl({
      src: ['/sounds/folder.wav'],
      volume: getStoredVolume('windowMinimize', 0.3),
      preload: true
    });
  }

  if (!windowMaximizeSound) {
    windowMaximizeSound = new Howl({
      src: ['/sounds/maximizar.wav'],
      volume: getStoredVolume('windowMaximize', 0.4),
      preload: true
    });
  }

  if (!hoverSound) {
    hoverSound = new Howl({
      src: ['/sounds/hover.wav'],
      volume: getStoredVolume('hover', 0.2),
      preload: true
    });
  }
};

// 🎚️ Función para actualizar volumen individual
// 🎚️ Función para actualizar volumen individual
const setVolume = (soundType, volume) => {
  const soundMap = {
    click: clickSound,
    windowOpen: windowOpenSound,
    windowClose: windowCloseSound,
    windowMinimize: windowMinimizeSound,
    windowMaximize: windowMaximizeSound,
    hover: hoverSound,
    intro: introSound,
  loaderBios: loaderBiosSound
  };

  const sound = soundMap[soundType];
  if (sound) {
    console.log(`🔊 Actualizando volumen de ${soundType}:`, volume);
    sound.volume(volume);
    
    // ✅ AÑADE ESTAS 3 LÍNEAS:
    try {
      const storeModule = require('#store/appSettingsStore');
      const store = storeModule.useAppSettingsStore?.getState?.();
      if (store?.setSoundVolumeByType) {
        store.setSoundVolumeByType(soundType, volume);
      }
    } catch (error) {
      console.log('Store no disponible, solo actualizando audio');
    }
    
    // Verificar que se aplicó
    const currentVol = sound.volume();
    console.log(`✅ Volumen actual de ${soundType}:`, currentVol);
    
  } else {
    console.warn(`⚠️ Sonido ${soundType} no inicializado`);
  }
};

// 🎚️ Función para obtener volumen actual
const getVolume = (soundType) => {
  const soundMap = {
    click: clickSound,
    windowOpen: windowOpenSound,
    windowClose: windowCloseSound,
    windowMinimize: windowMinimizeSound,
    windowMaximize: windowMaximizeSound,
    hover: hoverSound,
      intro: introSound,
  loaderBios: loaderBiosSound
  };

  const sound = soundMap[soundType];

  if (sound) {
    return sound.volume();
  }

  // 👇 fallback seguro
  return getStoredVolume(soundType, 0.3);
};

// Control de saturación para clicks
let lastClickTime = 0;
const playClick = (targetElement = null) => {
  // ⛔ No reproducir si los sonidos están deshabilitados globalmente
  if (!globalSoundsEnabled) {
    return;
  }
  
  // 🚫 Verificar si el elemento está dentro de una zona sin sonido
  if (targetElement) {
    let element = targetElement;
    while (element) {
      if (element.dataset?.noClickSound === "true") {
        console.log('🔇 Click en zona sin sonido');
        return;
      }
      element = element.parentElement;
    }
  }
  
  // 🔇 Si clickSoundEnabled está desactivado, no reproducir
  if (!clickSoundEnabled) {
    return;
  }
  
  const now = Date.now();
  if (now - lastClickTime > 50) {
    lastClickTime = now;
    if (clickSound) {
      console.log('🔊 Reproduciendo click con volumen:', clickSound.volume());
      clickSound.play();
    }
  }
};


const playIntro = () => {
  if (!globalSoundsEnabled) return;
  introSound?.play();
};

const playLoaderBios = (loop = true) => {
  if (!globalSoundsEnabled) return;

  if (loaderBiosSound) {
    loaderBiosSound.loop(loop);

    if (loop) {
      loaderBiosSound.play();
    } else {
      loaderBiosSound.stop();
    }
  }
};


const playWindowOpen = () => {
  if (!globalSoundsEnabled) return;
  windowOpenSound?.play();
};

const playWindowClose = () => {
  if (!globalSoundsEnabled) return;
  windowCloseSound?.play();
};

const playWindowMinimize = () => {
  if (!globalSoundsEnabled) return;
  windowMinimizeSound?.play();
};

const playWindowMaximize = () => {
  if (!globalSoundsEnabled) return;
  windowMaximizeSound?.play();
};

const playHover = () => {
  if (!globalSoundsEnabled) return;
  hoverSound?.play();
};

// 🎯 Hook que retorna las funciones (pero usa instancias globales)
const useSounds = () => {
  return {
    initSounds: initGlobalSounds,
    playClick,
    playWindowOpen,
    playWindowClose,
    playWindowMinimize,
    playWindowMaximize,
    playHover,
      playIntro,
  playLoaderBios,
    setVolume,
    getVolume,
    // 🆕 Funciones de control global
    setGlobalSoundsEnabled: (enabled) => {
      globalSoundsEnabled = enabled;
      console.log('🎛️ Sonidos globales:', enabled ? 'ACTIVADOS' : 'DESACTIVADOS');
    },
    setClickSoundEnabled: (enabled) => {
      clickSoundEnabled = enabled;
      console.log('🖱️ Sonido de click:', enabled ? 'ACTIVADO' : 'DESACTIVADO');
    }
  };
};

export default useSounds;