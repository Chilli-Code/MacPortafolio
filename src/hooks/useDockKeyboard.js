import { useEffect } from 'react';
import { useAppSettingsStore } from '#store/appSettingsStore';

export const useDockKeyboard = () => {
  const { toggleDockVisibility, dockHidden } = useAppSettingsStore();

  const setDockPosition = useAppSettingsStore(
    state => state.setDockPosition
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // ⛔ Evitar inputs / textareas
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
            // ✅ Atajo seguro y consistente
      const isToggleDock =
        event.altKey &&
        event.shiftKey &&
        event.key.toLowerCase() === 'd';

      if (isToggleDock) {
        event.preventDefault();
        toggleDockVisibility();

        console.log(
          `🎯 Dock ${!dockHidden ? 'ocultado' : 'mostrado'} (Alt + Shift + D)`
        );
      }

      // 🎹 Requiere ALT + SHIFT
      if (!e.altKey || !e.shiftKey) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setDockPosition('bottom');
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setDockPosition('left');
          break;

        case 'ArrowRight':
          e.preventDefault();
          setDockPosition('right');
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setDockPosition,toggleDockVisibility,dockHidden]);
};
