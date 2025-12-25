// src/components/Mobile/components/MobileSettings/NotificationComponents/PermissionModal.jsx
import { Bell } from '#assets/icons';

const PermissionModal = ({ onClose, onAllow }) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono */}
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-blue-500" />
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Permitir Notificaciones
        </h3>
        
        {/* Descripción */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          <strong>Necesitamos tu permiso para:</strong>
        </p>
        
        {/* Lista de beneficios */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4">
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
              <span>Alertas de tareas completadas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
              <span>Notificaciones de logros</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
              <span>Recordatorios importantes</span>
            </li>
          </ul>
        </div>

        {/* Nota */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
          Tu navegador mostrará una ventana de confirmación
        </p>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl active:scale-95 transition-all"
          >
            Permitir Notificaciones
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl active:scale-95 transition-all"
          >
            Ahora No
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;