// src/components/Mobile/components/MobileSettings/NotificationComponents/StatusBanner.jsx
import { Check } from '#assets/icons';

const StatusBanner = () => {
  return (
    <div className="m-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-900 dark:text-green-200">
            Notificaciones Activas
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            Recibirás alertas de logros y actualizaciones
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;