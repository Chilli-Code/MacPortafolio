// src/components/Settings/sections/FontSizeSection.jsx
import { Type, Maximize2 } from '#assets/icons';
import { useAppSettingsStore } from '#store/appSettingsStore';

const FontSizeSection = () => {
  const { fontSize, setFontSize } = useAppSettingsStore();
  
  // Escalas de tamaño: 80%, 90%, 100% (default), 110%, 120%, 130%
  const fontSizes = [
    { value: 0.8, label: 'Muy pequeño', description: '80%' },
    { value: 0.9, label: 'Pequeño', description: '90%' },
    { value: 1.0, label: 'Normal', description: '100%' },
    { value: 1.1, label: 'Grande', description: '110%' },
    { value: 1.2, label: 'Muy grande', description: '120%' },
    { value: 1.3, label: 'Extra grande', description: '130%' }
  ];

  const handleSizeChange = (scale) => {
    setFontSize(scale);
  };

  return (
    <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <Maximize2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Zoom
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ajusta el nivel de zoom de la interfaz
          </p>
        </div>
      </div>
      <div>
              {/* Atajos de teclado - Estilo macOS */}
      <div className="p-4 mb-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden overflow-x-auto">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">⌘</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Atajos de teclado
            </p>
            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">+</kbd>
                <span className="text-blue-600 dark:text-blue-400">Aumentar zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">-</kbd>
                <span className="text-blue-600 dark:text-blue-400">Disminuir zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">0</kbd>
                <span className="text-blue-600 dark:text-blue-400">Restablecer zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        <h3 className="text-black dark:text-white text-lg font-medium mb-3 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Tamaño de fuente
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ajusta el tamaño del texto en toda la aplicación
        </p>

        {/* Vista previa */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="space-y-2" style={{ fontSize: `${fontSize}rem` }}>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Vista previa del texto
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Este es un ejemplo de cómo se verá el texto en la aplicación con el tamaño seleccionado.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Los botones, menús y todos los elementos se ajustarán proporcionalmente.
            </p>
          </div>
        </div>

        {/* Opciones de tamaño */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => handleSizeChange(size.value)}
              className={`p-4 rounded-lg border-2 overflow-hidden transition-all ${
                fontSize === size.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="text-center">
                <div 
                  className={`font-semibold mb-1 ${
                    fontSize === size.value 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                  style={{ fontSize: `${size.value * 0.875}rem` }}
                >
                  {size.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {size.description}
                </div>
                {fontSize === size.value && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      Activo
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Slider fino para ajuste preciso */}
{/* Slider fino para ajuste preciso */}
<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
  <div className="flex items-center justify-between mb-3">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Ajuste fino
    </label>
    <span className="text-sm font-semibold text-gray-900 dark:text-white">
      {Math.round(fontSize * 100)}%
    </span>
  </div>

  {/* SLIDER */}
  <div className="relative h-4 mt-2">
    {/* Track gris */}
    <div className="absolute inset-0 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden pointer-events-none">
      {/* Fill azul */}
      <div
        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-150"
        style={{
          width: `${((fontSize - 0.7) / (1.5 - 0.7)) * 100}%`
        }}
      />
    </div>

    {/* Input real */}
    <input
      type="range"
      min="0.7"
      max="1.5"
      step="0.05"
      value={fontSize}
      onChange={(e) => handleSizeChange(parseFloat(e.target.value))}
      className="ui-range absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer"
    />
  </div>

  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
    <span>70%</span>
    <span>100%</span>
    <span>150%</span>
  </div>
</div>


        {/* Botón de resetear */}
        <button
          onClick={() => handleSizeChange(1.0)}
          className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          Restablecer a tamaño normal (100%)
        </button>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Este ajuste afecta todo el texto de la aplicación, 
            incluyendo ventanas, menús, botones y contenido. Los cambios se guardan automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSizeSection;