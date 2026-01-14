// src/components/Settings/ZoomWarning.jsx
import { AlertCircle, RotateCcw } from '#assets/icons';
import useWindowStore from '#store/window.js';
import { useState } from 'react';

const ZoomWarning = () => {
  const { resetWindows } = useWindowStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro? Esto restablecerá todas las ventanas a su posición inicial.')) {
      resetWindows();
      localStorage.removeItem('window-storage');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-3">
      {/* Advertencia sobre zoom */}
      <div className="p-2 overflow-hidden overflow-x-auto bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 ">
            <div className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed space-y-2">
              <p>
                Si cambias el zoom del navegador (Ctrl + Plus/Minus), las ventanas pueden quedar fuera de posición. 
                Te recomendamos <strong>reacomodar las ventanas manualmente</strong> después de ajustar el zoom.
              </p>
              <p>
                <strong>Si experimentas problemas</strong> (ventanas fuera de pantalla, parpadeos, o no puedes acceder a Settings):
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Presiona <kbd className="px-1 py-0.5 bg-amber-100 dark:bg-amber-950 rounded border border-amber-300 dark:border-amber-700 font-mono text-xs">F12</kbd> para abrir DevTools</li>
                <li>Ve a la pestaña <strong>Console</strong></li>
                <li>Escribe: <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 rounded font-mono text-xs">localStorage.removeItem('window-storage')</code></li>
                <li>Presiona <strong>Enter</strong> y recarga la página</li>
              </ol>
              <p className="mt-2">
                O usa el botón de abajo para resetear automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Atajos de teclado - Estilo macOS */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">⌘</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Atajos de teclado
            </p>
            <div className="space-y-1.5 text-xs text-blue-700 dark:text-blue-300">
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">+</kbd>
                <span className="text-blue-600 dark:text-blue-400">Aumentar zoom</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">-</kbd>
                <span className="text-blue-600 dark:text-blue-400">Disminuir zoom</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">0</kbd>
                <span className="text-blue-600 dark:text-blue-400">Restablecer zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de reset */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <RotateCcw className="w-4 h-4" />
          <span>Restablecer todas las ventanas</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
          Limpia el localStorage y reinicia las posiciones
        </div>
      </button>

      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300 text-center font-medium">
            ✓ Ventanas restablecidas correctamente
          </p>
        </div>
      )}
    </div>
  );
};

export default ZoomWarning;