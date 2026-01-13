// src/components/Settings/sections/NotificationsSection.jsx
import { Bell, AlertCircle } from '#assets/icons';
import { useAppSettingsStore } from '#store/appSettingsStore';
import { useState } from 'react';

const NotificationsSection = () => {
  const { 
    notificationsEnabled, 
    showOnLockScreen,
    browserNotificationsEnabled,
    setNotificationsEnabled,
    setShowOnLockScreen,
    requestNotificationPermission
  } = useAppSettingsStore();

  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled && !browserNotificationsEnabled) {
      setShowPermissionAlert(true);
      const granted = await requestNotificationPermission();
      
      if (!granted) {
        alert('Para recibir notificaciones, debes permitirlo en tu navegador.\n\nVe a: Configuración del navegador > Privacidad y seguridad > Permisos del sitio > Notificaciones');
      } else {
        setShowPermissionAlert(false);
      }
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const testNotification = () => {
    if (browserNotificationsEnabled) {
      new Notification('🎉 Notificación de prueba', {
        body: 'Esta es una notificación de ejemplo del sistema',
        icon: '/icons/logo.png',
        badge: '/icons/badge.png'
      });
    } else {
      alert('Primero debes activar las notificaciones');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-black dark:text-white text-lg font-medium mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones
        </h3>

        {/* Alerta de permiso */}
        {showPermissionAlert && !browserNotificationsEnabled && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                Permiso de notificaciones requerido
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                Para recibir notificaciones del sistema, necesitas dar permiso al navegador.
              </p>
              <button
                onClick={requestNotificationPermission}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Solicitar permiso ahora
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Toggle principal */}
          <label className="dark:bg-gray-800 bg-gray-50 text-black dark:text-white flex items-center justify-between flex-wrap gap-2 p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <div>
              <span className="text-sm font-medium block">Permitir notificaciones</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Recibe notificaciones de logros y actualizaciones
              </span>
              {!browserNotificationsEnabled && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 block">
                  ⚠️ Permiso del navegador no concedido
                </span>
              )}
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
            </div>
          </label>

          {/* Opciones secundarias */}
          {notificationsEnabled && browserNotificationsEnabled && (
            <>
              <label className="dark:bg-gray-800 bg-gray-50 text-black dark:text-white flex items-center justify-between p-3 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <span className="text-sm font-medium">Mostrar en pantalla de bloqueo</span>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-500 rounded" 
                  checked={showOnLockScreen}
                  onChange={(e) => setShowOnLockScreen(e.target.checked)}
                />
              </label>

              {/* Botón de prueba */}
              <button
                onClick={testNotification}
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Enviar notificación de prueba del sistema
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;