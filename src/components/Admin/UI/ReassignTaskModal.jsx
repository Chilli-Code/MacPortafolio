import { useState, useEffect } from 'react';
import { Users, RefreshCw, X, AlertCircle } from '#assets/icons';

const ReassignTaskModal = ({ task, users, onClose, onReassign }) => {
  const [selectedUserId, setSelectedUserId] = useState(task.assignedTo || '');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar usuarios disponibles (excluyendo al actual)
  const availableUsers = users.filter(user => 
    user.id !== task.assignedTo && user.role !== 'admin'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId || selectedUserId === task.assignedTo) {
      alert('Selecciona un usuario diferente');
      return;
    }

    if (!reason.trim()) {
      alert('Ingresa una razón para la reasignación');
      return;
    }

    setIsLoading(true);
    
    try {
      await onReassign(task.id, selectedUserId, reason);
      onClose();
    } catch (error) {
      console.error('Error reassigning task:', error);
      alert('Error al reasignar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Reasignar Tarea</h2>
              <p className="text-sm text-gray-400">{task.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Usuario Actual */}
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Usuario Actual</p>
            <p className="font-semibold">
              {task.assignedTo 
                ? users.find(u => u.id === task.assignedTo)?.fullName || task.assignedTo
                : 'Sin asignar'}
            </p>
            {task.assignedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Asignado: {new Date(task.assignedAt).toLocaleString('es-ES')}
              </p>
            )}
          </div>

          {/* Selector de Nuevo Usuario */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Nuevo Usuario
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              required
            >
              <option value="">Seleccionar usuario...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.type || 'Sin tipo'})
                </option>
              ))}
              <option value="unassigned">🔓 Desasignar (dejar disponible)</option>
            </select>
          </div>

          {/* Razón de Reasignación */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Razón de la Reasignación
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Usuario sobrecargado de trabajo, necesita ayuda urgente, cambio de prioridades..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          {/* Información Adicional */}
          <div className="text-sm text-gray-400 bg-gray-900/30 p-3 rounded-lg">
            <p className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold">Nota:</span>
            </p>
            <p className="mt-1">
              Al reasignar esta tarea:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Se guardará en el historial de asignaciones</li>
              <li>El tiempo trabajado se mantendrá registrado</li>
              <li>El usuario anterior será notificado</li>
              <li>El nuevo usuario recibirá una notificación</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Reasignando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reasignar Tarea
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReassignTaskModal;