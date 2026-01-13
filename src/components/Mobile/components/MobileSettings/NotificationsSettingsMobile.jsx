// src/components/Mobile/components/MobileSettings/NotificationsSettingsMobile.jsx
import { useState, useEffect } from 'react';
import MobileNav from '#Mobile/MobileNav';
import { useAppSettingsStore } from '#store/appSettingsStore';

// ⭐ Importar todos los componentes
import {
  PermissionBanner,
  StatusBanner,
  NotificationToggle,
  VolumeControl,
  NotificationTypesList,
  TestButtons,
  PermissionModal
} from './NotificationComponents/index';

const NotificationsSettingsMobile = ({ onBack }) => {
  const { 
    notificationsEnabled,
    soundEnabled,
    soundVolume,
    showOnLockScreen,
    browserNotificationsEnabled,
    setNotificationsEnabled,
    setSoundEnabled,
    setSoundVolume,
    setShowOnLockScreen,
    requestNotificationPermission,
    checkNotificationPermission
  } = useAppSettingsStore();

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
    
    if ('Notification' in window) {
      setPermissionDenied(Notification.permission === 'denied');
      console.log('📊 Notification permission status:', Notification.permission);
    }
  }, [checkNotificationPermission]);

  const handleToggleNotifications = async () => {
    console.log('🔔 Toggle notifications clicked');
    
    if (!browserNotificationsEnabled && !notificationsEnabled) {
      setShowPermissionModal(true);
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const handleRequestPermission = async () => {
    console.log('🚀 Requesting notification permission...');
    setIsRequesting(true);
    setShowPermissionModal(false);
    
    try {
      const granted = await requestNotificationPermission();
      console.log('   Permission result:', granted);
      
      if (!granted) {
        setPermissionDenied(true);
        alert('Permiso denegado. Para recibir notificaciones, debes permitirlo en la configuración de tu navegador.');
      } else {
        console.log('✅ Permission granted!');
        setPermissionDenied(false);
      }
    } catch (error) {
      console.error('❌ Error requesting permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
      <MobileNav 
        title="Notificaciones"
        onBack={onBack}
        showCancel={false}
      />

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Debug Info (solo desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="m-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs">
            <p className="font-mono">🐛 Debug:</p>
            <p className="font-mono">Browser: {browserNotificationsEnabled ? '✅' : '❌'}</p>
            <p className="font-mono">App: {notificationsEnabled ? '✅' : '❌'}</p>
            <p className="font-mono">Permission: {typeof Notification !== 'undefined' ? Notification.permission : 'N/A'}</p>
          </div>
        )}

        {/* Banners */}
        {permissionDenied && <PermissionBanner />}
        {browserNotificationsEnabled && notificationsEnabled && <StatusBanner />}

        {/* Toggle Principal */}
        <NotificationToggle
          notificationsEnabled={notificationsEnabled}
          browserNotificationsEnabled={browserNotificationsEnabled}
          isRequesting={isRequesting}
          onToggle={handleToggleNotifications}
        />

        {/* Opciones Adicionales */}
        {notificationsEnabled && browserNotificationsEnabled && (
          <>
            {/* Sonido y Pantalla de Bloqueo */}
            <div className="mt-6">
              <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
                OPCIONES ADICIONALES
              </h3>
              
              <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
                {/* Sonido */}
                <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Sonido de Notificaciones
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Reproduce sonido al recibir notificaciones
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>

                {/* Pantalla de Bloqueo */}
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Pantalla de Bloqueo
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Mostrar en pantalla bloqueada
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showOnLockScreen}
                        onChange={(e) => setShowOnLockScreen(e.target.checked)}
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Control de Volumen */}
            {soundEnabled && (
              <VolumeControl 
                soundVolume={soundVolume}
                onVolumeChange={setSoundVolume}
              />
            )}

            {/* Tipos de Notificaciones */}
            <NotificationTypesList />

            {/* Botones de Prueba */}
            <TestButtons />
          </>
        )}

        {/* Info adicional */}
        <div className="m-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong className="text-gray-900 dark:text-white">Nota:</strong> Las notificaciones te ayudan a estar al tanto de tus logros y actualizaciones importantes. Puedes personalizar qué tipo de notificaciones deseas recibir.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showPermissionModal && (
        <PermissionModal
          onClose={() => setShowPermissionModal(false)}
          onAllow={handleRequestPermission}
        />
      )}
    </div>
  );
};

export default NotificationsSettingsMobile;
