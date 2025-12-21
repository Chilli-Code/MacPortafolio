// src/components/DeviceBlocker/DeviceBlocker.jsx
import { memo } from 'react';

const DeviceBlocker = memo(() => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full text-center border border-gray-700 animate-fade-in">
        <div className="text-5xl mb-4 animate-bounce">📱</div>
        <h2 className="text-xl md:text-2xl font-bold mb-3">Experiencia móvil exclusiva</h2>
        <p className="text-gray-300 mb-6 text-sm md:text-base">
          Para acceder a la versión móvil, usa un dispositivo móvil real.
        </p>
        <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-xs md:text-sm text-gray-400">
          <p className="font-medium mb-1">💡 ¿Por qué?</p>
          <p>La app móvil usa características específicas de dispositivos táctiles.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium w-full"
        >
          Continuar en versión escritorio
        </button>
      </div>
    </div>
  );
});

DeviceBlocker.displayName = 'DeviceBlocker';
export default DeviceBlocker;