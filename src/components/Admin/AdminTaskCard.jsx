// src/components/admin/AdminTaskCard.jsx
import { User, Eye, CheckCircle, XCircle, Edit, Trash2 } from '#assets/icons';

const statusConfigs = {
    available: { color: 'blue', text: 'Disponible', icon: '📋' },
    in_progress: { color: 'orange', text: 'En Progreso', icon: '⏳' },
    pending_review: { color: 'purple', text: 'En Revisión', icon: '👀' },
    completed: { color: 'green', text: 'Completada', icon: '✅' },
    rejected: { color: 'red', text: 'Rechazada', icon: '❌' }
};

const AdminTaskCard = ({ 
    task, 
    onSelect, 
    onEdit, 
    onDelete, 
    onApprove,
    onReject,
    isAdmin = true 
}) => {
    if (!task) {
        return (
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
            </div>
        );
    }

    const statusConfig = statusConfigs[task.status] || statusConfigs.available;

    const getStatusBadge = () => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 bg-${statusConfig.color}-500/20 text-${statusConfig.color}-400 text-xs font-semibold rounded-full`}>
            <span>{statusConfig.icon}</span>
            {statusConfig.text}
        </span>
    );

    const handleEdit = (e) => {
        e.stopPropagation();
        if (onEdit && task) {
            // ⭐ Pasar la tarea completa, no solo el ID
            onEdit(task);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete && task.id) {
            if (confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
                onDelete(task.id);
            }
        }
    };

    const handleApprove = (e) => {
        e.stopPropagation();
        if (onApprove && confirm('¿Aprobar esta tarea?')) {
            const currentUser = JSON.parse(localStorage.getItem('userSession'));
            onApprove(task.id, currentUser?.id || 'adm_001');
        }
    };

    const handleReject = (e) => {
        e.stopPropagation();
        const reason = prompt('¿Por qué rechazas esta tarea?');
        if (reason && onReject) {
            const currentUser = JSON.parse(localStorage.getItem('userSession'));
            onReject(task.id, currentUser?.id || 'adm_001', reason);
        }
    };

    return (
        <div
            onClick={() => onSelect && onSelect(task)}
            className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{task.title}</h3>
                        {getStatusBadge()}
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded capitalize">
                            {task.type}
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{task.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400">
                            💰 Pago: <span className="text-green-400 font-semibold">${task.rewards?.totalReward || task.rewards?.baseReward || task.baseReward || task.reward || 0}</span>
                        </span>
                        <span className="text-gray-400">
                            ⭐ XP: <span className="text-yellow-400 font-semibold">{task.xp}</span>
                        </span>
                        <span className="text-gray-400">
                            📅 Deadline: <span className="text-blue-400">{task.deadline}</span>
                        </span>

                        {task.assignedTo && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <User className="w-4 h-4" />
                                <span>Asignada a: <span className="text-purple-400">{task.assignedTo}</span></span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {/* Botones de Aprobación/Rechazo */}
                    {task.status === 'pending_review' && isAdmin && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleApprove}
                                className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm px-3 py-1 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Aprobar
                            </button>

                            <button
                                onClick={handleReject}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                Rechazar
                            </button>
                        </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                        {isAdmin && (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors"
                                    title="Editar tarea"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                    title="Eliminar tarea"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSelect) onSelect(task);
                            }}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Ver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskCard;