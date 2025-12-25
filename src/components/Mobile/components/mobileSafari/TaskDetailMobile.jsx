import { Calendar, DollarSign, Zap, Clock, Tag, User, CheckCircle2, PlayCircle, XCircle, RefreshCw, FileText, AlertCircle, ChevronRight } from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';
import { getTechConfig } from '#assets/techIcons/techConfig.jsx';

const TaskDetailMobile = ({ task, onBack, onAccept, onComplete, onReopen }) => {
  const isRejected = task.status === 'rejected' || task.reviewStatus === 'rejected';
  
  const difficultyConfig = {
    easy: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Fácil', emoji: '🟢' },
    medium: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Medio', emoji: '🟡' },
    hard: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Difícil', emoji: '🔴' }
  };

  const statusConfig = {
    available: { color: 'bg-blue-100 text-blue-700', label: 'Disponible', emoji: '🆕' },
    in_progress: { color: 'bg-orange-100 text-orange-700', label: 'En Progreso', emoji: '⏳' },
    pending_review: { color: 'bg-purple-100 text-purple-700', label: 'En Revisión', emoji: '👀' },
    completed: { color: 'bg-green-100 text-green-700', label: 'Completada', emoji: '✅' },
    rejected: { color: 'bg-red-100 text-red-700', label: 'Rechazada', emoji: '❌' }
  };

  const difficulty = difficultyConfig[task.difficulty];
  const status = statusConfig[task.status];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <MobileNav 
        title="Detalles"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 px-6 py-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${status.color}`}>
                {status.emoji} {status.label}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {task.title}
              </h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficulty.color}`}>
              {difficulty.emoji} {difficulty.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Rejection Alert */}
        {isRejected && task.reviewNotes && (
          <div className="mx-4 my-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 dark:text-red-300 text-sm mb-1">
                  Tarea Rechazada
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400">
                  Revisa los comentarios y corrige
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-red-950/30 rounded-xl p-3 border border-red-200 dark:border-red-800 mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Comentarios del admin:
              </p>
              <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                {task.reviewNotes}
              </p>
            </div>

            {task.reviewedAt && (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 mb-3">
                <Clock className="w-3 h-3" />
                <span>{new Date(task.reviewedAt).toLocaleString('es-ES')}</span>
              </div>
            )}

            <button
              onClick={onReopen}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              Corregir y Reintentar
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {/* XP */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500 font-medium">XP</p>
                  <p className="text-xl font-bold text-yellow-900 dark:text-yellow-300">{task.xp}</p>
                </div>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-500">Puntos</p>
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-700 dark:text-green-500 font-medium">Pago</p>
                  <p className="text-xl font-bold text-green-900 dark:text-green-300">${task.reward}</p>
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500">USD</p>
            </div>

            {/* Deadline */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-purple-700 dark:text-purple-500 font-medium">Fecha Limite</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{task.deadline}</p>
                </div>
              </div>
            </div>

            {/* Type */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-500 font-medium">Tipo</p>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-300 capitalize">{task.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Tecnologías</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags?.map((tag, i) => {
                const config = getTechConfig(tag);
                return (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 ${config?.color || 'bg-gray-200 text-gray-800'}`}
                  >
                    {config?.icon}
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        {task.detailedDescription && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Descripción Detallada</h3>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {task.detailedDescription}
              </p>
            </div>
          </div>
        )}

        {/* Timeline Info */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Información</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Tiempo estimado:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {task.difficulty === 'easy' ? '2-4h' : task.difficulty === 'medium' ? '4-8h' : '8+ h'}
                </span>
              </div>
              {task.acceptedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Aceptada:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(task.acceptedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              {task.revisionCount > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Revisiones:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {task.revisionCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom spacing for button */}
        <div className="h-24"></div>
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 safe-area-bottom">
        {task.status === 'available' && (
          <button 
            onClick={onAccept}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          >
            <PlayCircle className="w-5 h-5" />
            Aceptar Tarea
          </button>
        )}

        {task.status === 'in_progress' && !isRejected && (
          <button 
            onClick={onComplete}
            className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            Marcar como Completada
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetailMobile;