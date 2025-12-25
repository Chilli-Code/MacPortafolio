// src/components/DeviceBlocker/DeviceBlocker.jsx
import { memo, useEffect, useState } from 'react';

const DeviceBlocker = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in suave al montar
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Blur overlay sutil */}
      <div className="absolute inset-0 backdrop-blur-3xl" />

      {/* Contenido principal */}
      <div 
        className={`relative z-10 max-w-md mx-4 transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Card principal */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          
          {/* Icono central */}
          <div className="pt-12 pb-8 flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
              
              {/* Icono */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="px-8 pb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
              Experiencia móvil exclusiva
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Esta experiencia está diseñada específicamente para dispositivos móviles con pantalla táctil.
            </p>

            {/* Info card */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-start gap-3 text-left">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mt-0.5">
                  <svg 
                    className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    ¿Por qué?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    La versión móvil utiliza gestos táctiles y características específicas de dispositivos móviles para ofrecer la mejor experiencia posible.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <button
              onClick={handleContinue}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Continuar en escritorio
            </button>

            {/* Texto secundario */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              Accede desde tu iPhone, iPad o dispositivo Android
            </p>
          </div>
        </div>

        {/* Indicador de dispositivos compatibles */}
        <div className="mt-6 flex justify-center items-center gap-4 opacity-60">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.25 5.25v3.5a.75.75 0 001.5 0v-3.5a2 2 0 00-2-2h-3.5a.75.75 0 000 1.5h3.5a.5.5 0 01.5.5zm-15 0a.5.5 0 01.5-.5h3.5a.75.75 0 000-1.5h-3.5a2 2 0 00-2 2v3.5a.75.75 0 001.5 0v-3.5zm0 13.5a.5.5 0 01-.5-.5v-3.5a.75.75 0 00-1.5 0v3.5a2 2 0 002 2h3.5a.75.75 0 000-1.5h-3.5zm15 0a.5.5 0 01-.5.5h-3.5a.75.75 0 000 1.5h3.5a2 2 0 002-2v-3.5a.75.75 0 00-1.5 0v3.5z"/>
            </svg>
            <span className="text-xs text-gray-400 dark:text-gray-600">iOS</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.523 7.39l-2.708-2.708a.75.75 0 00-1.06 0l-2.708 2.708a.75.75 0 001.06 1.06l1.428-1.427v5.894a.75.75 0 001.5 0V7.024l1.428 1.427a.75.75 0 101.06-1.061zM7.477 16.61l2.708 2.708a.75.75 0 001.06 0l2.708-2.708a.75.75 0 00-1.06-1.06l-1.428 1.427V10.083a.75.75 0 00-1.5 0v6.894l-1.428-1.427a.75.75 0 00-1.06 1.061z"/>
            </svg>
            <span className="text-xs text-gray-400 dark:text-gray-600">Android</span>
          </div>
        </div>
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
});

DeviceBlocker.displayName = 'DeviceBlocker';
export default DeviceBlocker;