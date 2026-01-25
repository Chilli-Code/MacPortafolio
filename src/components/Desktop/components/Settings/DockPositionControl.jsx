// src/components/Settings/DockPositionControl.jsx - CON ATAJO DE TECLADO

import { Check, Move, ArrowDown, ArrowLeft, ArrowRight, Keyboard, Command } from '#assets/icons';
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
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg p-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white/40 dark:bg-gray-700/40 rounded h-12"></div>
          </div>
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
          <div className="flex items-center px-1.5">
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl py-3 px-1.5 shadow-lg flex flex-col gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-500"></div>
              <div className="w-2 h-2 rounded bg-purple-500"></div>
              <div className="w-2 h-2 rounded bg-pink-500"></div>
              <div className="w-2 h-2 rounded bg-orange-500"></div>
            </div>
          </div>
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
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-l-lg p-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white/40 dark:bg-gray-700/40 rounded h-12"></div>
          </div>
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
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-3">
                {pos.preview}
              </div>

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


<div className="p-4 mb-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <div className="flex items-start gap-3">
    
    {/* Icono */}
    <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs font-bold">⌘</span>
    </div>

    <div className="flex-1">
      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
        Atajos de teclado
      </p>

      {/* Grid OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-blue-700 dark:text-blue-300">

        {/* WINDOWS / LINUX */}
        <div>
          <p className="mb-2 font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
            (Windows/Linux)
          </p>

          <div className="space-y-3">
            {/* Abajo */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">ALT</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">SHIFT</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">↓</kbd>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mover Dock abajo
              </p>
            </div>

            {/* Izquierda */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">ALT</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">SHIFT</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">←</kbd>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mover Dock a la izquierda
              </p>
            </div>

            {/* Derecha */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">ALT</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">SHIFT</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">→</kbd>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mover Dock a la derecha
              </p>
            </div>
          </div>
        </div>

        {/* MAC */}
        <div>
          <p className="mb-2 font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
            MAC
          </p>

          <div className="space-y-3">
            {/* Abajo */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⇧</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">↓</kbd>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mover Dock abajo
              </p>
            </div>

            {/* Izquierda */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⇧</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">←</kbd>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mover Dock a la izquierda
              </p>
            </div>

            {/* Derecha */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⇧</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">→</kbd>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mover Dock a la derecha
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>


      {/* Notas informativas */}
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <span className="font-medium">Nota:</span> El cambio se aplicará inmediatamente. 
            El Dock se adaptará automáticamente a la nueva posición.
          </p>
        </div>

        {/* 👇 NUEVO: Información del atajo de teclado */}
<div>
  <h2 className="text-black dark:text-white text-lg font-medium mb-3 flex items-center gap-2">
    <Command />
    Visibilidad del Dock
  </h2>
  <p className="text-xs text-gray-500 dark:text-gray-400">
Decide si el Dock se muestra u oculta para mantener tu escritorio limpio y enfocado.
  </p>
</div>

        <div className="p-4 mb-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">⌘</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Atajo de teclado
              </p>
              <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2 flex-wrap">
                  <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">⌥</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">D</kbd>
                  <span className="text-blue-600 dark:text-blue-400">(Mac)</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">ALT</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">SHIFT</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-blue-950 rounded border border-blue-300 dark:border-blue-700 font-mono">D</kbd>
                  <span className="text-blue-600 dark:text-blue-400">(Windows/Linux)</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Ocultar/Mostrar el Dock
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockPositionControl;