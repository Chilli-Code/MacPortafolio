import Marquee from 'react-fast-marquee';
import { Zap, DollarSign, Calendar, Eye, Clipboard, CheckCircle, AlarmClock, CircleX, MousePointerClick } from "#assets/icons";
import { getTechConfig } from '#assets/techIcons/techConfig.jsx';

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const statusBadges = {
  available: { 
    color: 'blue', 
    icon: <Clipboard className="w-4 h-4 text-blue-600 dark:text-blue-400"/>, 
    text: 'Disponible' 
  },
  in_progress: { 
    color: 'orange', 
    icon: <AlarmClock className="w-4 h-4 text-orange-600 dark:text-orange-400" />, 
    text: 'En Progreso' 
  },
  pending_review: { 
    color: 'purple', 
    icon: <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400"/>, 
    text: 'En Revisión' 
  },
  completed: { 
    color: 'green', 
    icon: <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400"/>, 
    text: 'Completada' 
  },
  rejected: { 
    color: 'red', 
    icon: <CircleX className="w-4 h-4 text-red-600 dark:text-red-400"/>, 
    text: 'Rechazada' 
  }
};

const statusColorClasses = {
  available: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  in_progress: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  pending_review: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
};

const TaskCard = ({ task, onClick }) => {
  const status = statusBadges[task.status];
  const shouldMarquee = task.tags && task.tags.length > 4;
  
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-[1.02] h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{task.title}</h3>
          <span className={`flex justify-center items-center gap-2 px-3 py-1 ${statusColorClasses[task.status]} text-xs font-semibold rounded-full`}>
            {status.icon} {status.text}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
      </div>

      {/* Content - Usa flex-col y flex-1 para crecimiento */}
      <div className="p-6 py-3 pb-5 flex-1 flex flex-col">
        {/* Tags Section */}
        {task.tags && task.tags.length > 0 && (
          <div className="mb-4">
            {shouldMarquee ? (
              // Con Marquee cuando hay más de 4 tags
              <Marquee 
                speed={30}
                gradient={false}
                pauseOnHover={true}
                className="flex items-center"
              >
                {task.tags.map((tag, i) => {
                  const config = getTechConfig(tag);
                  return (
                    <span 
                      key={i} 
                      className={`px-3 py-1.5 mx-1 text-xs font-medium rounded-full flex items-center gap-1.5 flex-shrink-0 ${config?.color || 'bg-gray-100 text-gray-800'}`}
                    >
                      {config?.icon || tag}
                      {tag}
                    </span>
                  );
                })}
              </Marquee>
            ) : (
              // Sin Marquee cuando hay 4 o menos tags
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, i) => {
                  const config = getTechConfig(tag);
                  return (
                    <span 
                      key={i} 
                      className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 flex-shrink-0 ${config?.color || 'bg-gray-100 text-gray-800'}`}
                    >
                      {config?.icon || tag}
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">XP</p>
              <p className="font-semibold text-gray-950 dark:text-white text-sm">{task.xp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pago</p>
              <p className="text-gray-950 dark:text-white font-semibold text-sm">${task.reward}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-gray-950 dark:text-white font-semibold text-xs">{task.deadline}</p>
            </div>
          </div>

          <div className="flex items-cente">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[task.difficulty] || difficultyColors.medium}`}>
              {task.difficulty?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>
        </div>

        {/* Status Info */}
        {task.status === 'in_progress' && task.acceptedAt && (
          <div className="flex justify-center items-center gap-2 pt-2 mb-4 border-t border-gray-200 dark:border-gray-700">
            <AlarmClock className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500">
              Aceptada: {new Date(task.acceptedAt).toLocaleString('es-ES')}
            </p>
          </div>
        )}

        {task.status === 'completed' && task.completedAt && (
          <div className="flex justify-center items-center gap-2 pt-2 mb-4 border-t border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-600 dark:text-green-400">
              Completada: {new Date(task.completedAt).toLocaleString('es-ES')}
            </p>
          </div>
        )}

        {/* Spacer - Para empujar el footer hacia abajo */}
        <div className="flex-1"></div>

        {/* Footer - Siempre al fondo */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center gap-2 text-center">
            <MousePointerClick className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500">
              Click para ver detalles completos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;