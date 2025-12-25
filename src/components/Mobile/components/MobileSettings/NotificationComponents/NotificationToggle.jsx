// src/components/Mobile/components/MobileSettings/NotificationComponents/NotificationToggle.jsx
import { AlertCircle } from '#assets/icons';

const NotificationToggle = ({ 
  notificationsEnabled, 
  browserNotificationsEnabled, 
  isRequesting, 
  onToggle 
}) => {
  return (
    <div className="mt-6">
      <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
        CONFIGURACIÓN GENERAL
      </h3>
      
      <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Permitir Notificaciones
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Recibe alertas y actualizaciones importantes
              </p>
              {!browserNotificationsEnabled && !isRequesting && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Permiso del navegador requerido
                </p>
              )}
              {isRequesting && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Esperando respuesta...
                </p>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={onToggle}
                disabled={isRequesting}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 shadow-inner peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToggle;