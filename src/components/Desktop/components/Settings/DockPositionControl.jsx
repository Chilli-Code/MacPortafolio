import { Check, Move, ArrowDown, ArrowLeft, ArrowRight } from '#assets/icons';

import { useAppSettingsStore } from '#store/appSettingsStore';

const DockPositionControl = () => {
  const { dockPosition, setDockPosition } = useAppSettingsStore();

  const positions = [
    { 
      value: 'bottom', 
      label: 'Abajo',
      icon: ArrowDown,
      preview: (
        <div className="w-full h-full flex flex-col">
          {/* Ventana macOS */}
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg p-2">
            {/* Botones de semáforo */}
            <div className="flex items-center gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            {/* Contenido de ventana */}
            <div className="bg-white/40 dark:bg-gray-700/40 rounded h-12"></div>
          </div>
          {/* Dock en la parte inferior */}
          <div className="flex justify-center py-1.5">
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-500"></div>
              <div className="w-2 h-2 rounded bg-purple-500"></div>
              <div className="w-2 h-2 rounded bg-pink-500"></div>
              <div className="w-2 h-2 rounded bg-orange-500"></div>
            </div>
          </div>
        </div>
      )
    },
    { 
      value: 'left', 
      label: 'Izquierda',
      icon: ArrowLeft,
      preview: (
        <div className="w-full h-full flex">
          {/* Dock en la izquierda */}
          <div className="flex items-center px-1.5">
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl py-3 px-1.5 shadow-lg flex flex-col gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-500"></div>
              <div className="w-2 h-2 rounded bg-purple-500"></div>
              <div className="w-2 h-2 rounded bg-pink-500"></div>
              <div className="w-2 h-2 rounded bg-orange-500"></div>
            </div>
          </div>
          {/* Ventana macOS */}
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-r-lg p-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white/40 dark:bg-gray-700/40 rounded h-12"></div>
          </div>
        </div>
      )
    },
    { 
      value: 'right', 
      label: 'Derecha',
      icon: ArrowRight,
      preview: (
        <div className="w-full h-full flex">
          {/* Ventana macOS */}
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-l-lg p-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white/40 dark:bg-gray-700/40 rounded h-12"></div>
          </div>
          {/* Dock en la derecha */}
          <div className="flex items-center px-1.5">
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl py-3 px-1.5 shadow-lg flex flex-col gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-500"></div>
              <div className="w-2 h-2 rounded bg-purple-500"></div>
              <div className="w-2 h-2 rounded bg-pink-500"></div>
              <div className="w-2 h-2 rounded bg-orange-500"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-black dark:text-white text-lg font-medium mb-3 flex items-center gap-2">
          <Move />
          Posición del Dock
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Elige dónde quieres que aparezca el Dock en la pantalla
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {positions.map((pos) => {
          const isSelected = dockPosition === pos.value;
          const Icon = pos.icon;
          return (
            <button
              key={pos.value}
              onClick={() => setDockPosition(pos.value)}
              className={`
                relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden
                ${isSelected 
                  ? 'border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Vista previa del sistema */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-3">
                {pos.preview}
              </div>

              {/* Footer con label y check */}
              <div className={`
                p-3 border-t transition-colors
                ${isSelected 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
<Icon className={`
  w-4 h-4 transition-colors
  ${isSelected 
    ? 'text-blue-500 dark:text-blue-400' 
    : 'text-gray-500 dark:text-gray-400'
  }
`} />
                    <span className={`
                      text-sm font-medium transition-colors
                      ${isSelected 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}>
                      {pos.label}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>

              {/* Hover overlay effect */}
              <div className={`
                absolute inset-0 transition-opacity pointer-events-none
                ${isSelected 
                  ? 'bg-blue-500/5 opacity-100' 
                  : 'bg-gray-500/5 opacity-0 group-hover:opacity-100'
                }
              `} />
            </button>
          );
        })}
      </div>

      {/* Nota informativa */}
      <div className="p-3 mb-10 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <span className="font-medium">Nota:</span> El cambio se aplicará inmediatamente. 
          El Dock se adaptará automáticamente a la nueva posición.
        </p>
      </div>
    </div>
  );
};

export default DockPositionControl;