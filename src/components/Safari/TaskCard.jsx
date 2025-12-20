import { Zap, DollarSign, Calendar, Eye, Clipboard, CheckCircle, AlarmClock, CircleX } from "#assets/icons";

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const statusBadges = {
  available: { color: 'blue', icon: <Clipboard className="w-4 h-4 text-gray-800 dark:text-white"/>, text: 'Disponible' },
  in_progress: { color: 'orange', icon: <AlarmClock className="w-4 h-4 text-orange-500" /> , text: 'En Progreso' },
  pending_review: { color: 'purple', icon: <Eye className="w-4 h-4 text-purple-700"/>, text: 'En Revisión' },
  completed: { color: 'green', icon: <CheckCircle className="w-4 h-4"/>, text: 'Completada' },
  rejected: { color: 'red', icon: <CircleX className="w-4 h-4 text-red-400"/>, text: 'Rechazada' }
};

const TaskCard = ({ task, onClick }) => {
  const status = statusBadges[task.status];
  
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-[1.02]"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{task.title}</h3>
          <span className={`flex justify-center items-center gap-2  px-3 py-1 bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-400 text-xs font-semibold rounded-full`}>
            {status.icon} {status.text}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {task.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">XP</p>
              <p className="font-semibold text-gray-950 dark:text-white text-sm">{task.xp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pago</p>
              <p className="text-gray-950 dark:text-white font-semibold text-sm">${task.reward}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-gray-950 dark:text-white font-semibold text-xs">{task.deadline}</p>
            </div>
          </div>

          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[task.difficulty]}`}>
              {task.difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {task.status === 'in_progress' && task.acceptedAt && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              ⏰ Aceptada: {new Date(task.acceptedAt).toLocaleString('es-ES')}
            </p>
          </div>
        )}

        {task.status === 'completed' && task.completedAt && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-green-600 dark:text-green-400">
              ✅ Completada: {new Date(task.completedAt).toLocaleString('es-ES')}
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            👆 Click para ver detalles completos
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;