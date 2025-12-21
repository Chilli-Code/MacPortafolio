import { useRef } from 'react';
import { dockAppsMobile } from '#constants/index.js';

export const MobileDock = ({ onAppClick, currentScreen }) => {
  const gameWindowRef = useRef(null);

  const openGamePopup = () => {
    if (gameWindowRef.current && !gameWindowRef.current.closed) {
      gameWindowRef.current.close();
    }

    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    const features = [
      `width=${screenWidth}`,
      `height=${screenHeight}`,
      'left=0',
      'top=0',
      'menubar=no',
      'toolbar=no',
      'location=no',
      'status=no',
      'resizable=yes',
      'scrollbars=no'
    ].join(',');

    const baseUrl = window.location.origin;
    
    gameWindowRef.current = window.open(
      `${baseUrl}/game`,
      'DevWorldGame',
      features
    );

    if (gameWindowRef.current) {
      const checkClosed = setInterval(() => {
        if (gameWindowRef.current.closed) {
          clearInterval(checkClosed);
          gameWindowRef.current = null;
        }
      }, 1000);
    }
  };

  const handleDockClick = (app) => {
    // Si es el juego, abrir popup
    if (app.id === 'game') {
      openGamePopup();
      return;
    }

    // Para mobile, solo llamamos a onAppClick para cambiar de screen
    if (onAppClick) {
      onAppClick(app.id);
    }
  };

  // Mostrar solo las primeras 4 apps principales en el dock
  const mainApps = dockAppsMobile.filter(app => app.id !== 'game').slice(0, 4);

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-4 py-3 shadow-2xl border border-white/30">
        <div className="flex items-center gap-3">
          {mainApps.map((app) => {
            const isActive = currentScreen === app.id;

            return (
              <button
                key={app.id}
                onClick={() => handleDockClick(app)}
                disabled={!app.canOpen}
                className="group relative"
              >
                {/* App Icon */}
                <div 
                  className={`
                    w-14 h-14 rounded-2xl 
                    flex items-center justify-center
                    transition-all duration-200
                    active:scale-95
                    ${!app.canOpen ? 'opacity-60' : ''}
                    ${isActive ? 'ring-2 ring-white/50' : ''}
                  `}
                >
                  <img
                    src={`/images/${app.icon}`}
                    alt={app.name}
                    className="w-full h-full rounded-2xl object-cover"
                    draggable={false}
                  />
                </div>

                {/* App Name Tooltip */}
                <div className="
                  absolute -top-12 left-1/2 -translate-x-1/2
                  bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-lg
                  opacity-0 group-active:opacity-100
                  transition-opacity duration-200
                  whitespace-nowrap
                  pointer-events-none
                ">
                  {app.name}
                </div>

                {/* Dot Indicator - Solo si está activo */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};