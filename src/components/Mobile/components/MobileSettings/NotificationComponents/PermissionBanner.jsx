// src/components/Mobile/components/MobileSettings/NotificationComponents/PermissionBanner.jsx
import { AlertCircle } from '#assets/icons';

const PermissionBanner = () => {
  const handleHelpClick = () => {
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isChrome) {
      alert('Chrome:\n1. Haz clic en el candado 🔒 en la barra de direcciones\n2. Busca "Notificaciones"\n3. Cambia a "Permitir"');
    } else if (isSafari) {
      alert('Safari:\n1. Ve a Preferencias del Sistema\n2. Selecciona Safari > Configuración para este sitio\n3. Permite las notificaciones');
    } else {
      alert('Ve a la configuración de tu navegador y permite las notificaciones para este sitio.');
    }
  };

  return (
    <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
            Permiso Denegado
          </p>
          <p className="text-xs text-red-700 dark:text-red-300 mb-3">
            Has rechazado las notificaciones. Para activarlas, ve a la configuración de tu navegador.
          </p>
          <button
            onClick={handleHelpClick}
            className="text-xs font-medium text-red-600 dark:text-red-400 underline"
          >
            ¿Cómo activar permisos?
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionBanner;