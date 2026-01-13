// src/components/Settings/PerformanceMonitorToggle.jsx
import { usePerformanceMonitor } from '#hooks/usePerformanceMonitor'; // ✅ Importa del hook correcto

const PerformanceMonitorToggle = () => {
const { showMonitor, toggleMonitor } = usePerformanceMonitor();

  return (
    <label className="dark:bg-gray-800 bg-gray-50 text-black dark:text-white flex items-center justify-between flex-wrap gap-2 p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium block">Mostrar monitor de rendimiento</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Muestra el uso de RAM, FPS y GPU en tiempo real
        </span>
      </div>
      <div className="relative flex-shrink-0">
      <button
        onClick={() => toggleMonitor()}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showMonitor ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
        role="switch"
        aria-checked={showMonitor}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showMonitor ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      
      </div>
    </label>
  );
};

export default PerformanceMonitorToggle;