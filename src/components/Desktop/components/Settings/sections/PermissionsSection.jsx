// src/components/Settings/sections/PermissionsSection.jsx
import { Shield, Bell, Mic, Camera, MapPin, Check, X, AlertCircle } from '#assets/icons';
import { useAppSettingsStore } from '#store/appSettingsStore';
import { useState } from 'react';

const PermissionsSection = () => {
  const { permissions, setPermission } = useAppSettingsStore();
  const [requestingPermission, setRequestingPermission] = useState(null);

  const permissionsList = [
    {
      id: 'notifications',
      name: 'Notificaciones',
      description: 'Muestra notificaciones de logros y actualizaciones',
      icon: Bell,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      requestable: true
    },
    {
      id: 'microphone',
      name: 'Micrófono',
      description: 'Necesario para chat de voz en el juego multiplayer',
      icon: Mic,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      requestable: true
    },
    {
      id: 'camera',
      name: 'Cámara',
      description: 'Para videollamadas y captura de pantalla',
      icon: Camera,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      requestable: true
    },
    {
      id: 'location',
      name: 'Ubicación',
      description: 'Personaliza la experiencia según tu región',
      icon: MapPin,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      requestable: false
    }
  ];

  const requestPermission = async (permissionId) => {
    setRequestingPermission(permissionId);

    try {
      switch (permissionId) {
        case 'notifications':
          if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission('notifications', result === 'granted');
          }
          break;

        case 'microphone':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setPermission('microphone', true);
          } catch (err) {
            setPermission('microphone', false);
          }
          break;

        case 'camera':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setPermission('camera', true);
          } catch (err) {
            setPermission('camera', false);
          }
          break;

        case 'location':
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              () => setPermission('location', true),
              () => setPermission('location', false)
            );
          }
          break;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setRequestingPermission(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-black dark:text-white text-lg font-medium mb-1 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Permisos de la Aplicación
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Administra los permisos que necesita la aplicación para funcionar correctamente
        </p>

        <div className="space-y-3">
          {permissionsList.map((perm) => {
            const Icon = perm.icon;
            const isGranted = permissions[perm.id];
            const isRequesting = requestingPermission === perm.id;

            return (
              <div
                key={perm.id}
                className="bg-white overflow-hidden overflow-x-scroll dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Icono */}
                  <div className={`w-12 h-12 ${perm.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${perm.color}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex-wrap">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {perm.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {perm.description}
                    </p>

                    {/* Estado */}
                    <div className="flex items-center gap-2 mt-2">
                      {isGranted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                          <Check className="w-3 h-3" />
                          Permitido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">
                          <X className="w-3 h-3" />
                          No permitido
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón de acción */}
                  {perm.requestable && (
                    <button
                      onClick={() => requestPermission(perm.id)}
                      disabled={isRequesting || isGranted}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isGranted
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isRequesting ? 'Solicitando...' : isGranted ? 'Concedido' : 'Permitir'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Advertencia */}
        <div className="mt-4 mb-20 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3 flex-wrap">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Nota sobre permisos</p>
            <p className="text-xs">
              Si rechazas un permiso, algunas funcionalidades pueden no estar disponibles. 
              Puedes cambiar estos permisos en cualquier momento desde la configuración de tu navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsSection;