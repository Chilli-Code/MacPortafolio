// src/components/Safari/TaskDetailView.jsx
import {
  CircleArrowLeft, CalendarIcon, DollarSign, Zap, Clock, Tag, User,
  CheckCircle2, PlayCircle, XCircle, ChevronRight,
  FileText, AlertCircle, RefreshCw, Clipboard, Eye, CheckCircle, AlarmClock
} from '#assets/icons';
import { getTechConfig } from '#assets/techIcons/techConfig.jsx';

const TaskDetailView = ({ task, onClose, onAccept, onComplete, onReopen }) => {
  const isRejected = task.status === 'rejected' || task.reviewStatus === 'rejected';
  
  // ⭐ SOPORTAR AMBAS ESTRUCTURAS (vieja y nueva)
  const taskXP = task.rewards?.xp || task.xp || 0;
  const taskReward = task.rewards?.totalReward || task.rewards?.baseReward || task.reward || 0;
  
  const difficultyConfig = {
    easy: {
      color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      label: 'Fácil',
      icon: '🟢'
    },
    medium: {
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      label: 'Medio',
      icon: '🟡'
    },
    hard: {
      color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      label: 'Difícil',
      icon: '🔴'
    }
  };

  const statusConfig = {
    available: {
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      label: 'Disponible',
      icon: <Clipboard className="w-4 h-4 text-blue-500" />
    },
    in_progress: {
      color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      label: 'En Progreso',
      icon: <AlarmClock className="w-4 h-4 text-orange-400" />
    },
    pending_review: {
      color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      label: 'En Revisión',
      icon: <Eye className="w-4 h-4  text-purple-700" />
    },
    completed: {
      color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      label: 'Completada',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />
    },
    rejected: {
      color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      label: 'Rechazada',
      icon: <XCircle className="w-4 h-4 text-red-600" />
    }
  };

  const difficulty = difficultyConfig[task.difficulty] || difficultyConfig.medium;
  const status = statusConfig[task.status] || statusConfig.available;

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <CircleArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detalles de Tarea</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{task.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status === 'available' && (
            <button onClick={onAccept} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Aceptar Tarea
            </button>
          )}

          {task.status === 'in_progress' && !isRejected && (
            <button onClick={onComplete} className="cursor-pointer px-2 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Marcar como Completada
            </button>
          )}

          {isRejected && (
            <button
              onClick={onReopen}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Corregir y Volver a Intentar
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Title & Status */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
                {task.title}
              </h1>
              <span className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${status.color} flex items-center gap-2`}>
                <span>{status.icon}</span>
                {status.label}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* ⭐ ALERTA DE RECHAZO */}
          {isRejected && task.reviewNotes && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 dark:text-red-300 text-lg mb-1">
                    Tarea Rechazada por el Administrador
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Por favor revisa los comentarios y realiza las correcciones necesarias
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-red-950/30 rounded-lg p-4 border-2 border-red-200 dark:border-red-800 mb-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Comentarios del administrador:</p>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {task.reviewNotes}
                </p>
              </div>

              {task.reviewedAt && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <Clock className="w-4 h-4" />
                  <span>Revisado el: {new Date(task.reviewedAt).toLocaleString('es-ES')}</span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                <button
                  onClick={onReopen}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Corregir y Volver a Intentar
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
            }}
          >
            {/* XP */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500 font-medium">Experiencia</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{taskXP}</p>
                </div>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-500">XP Points</p>
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-green-700 dark:text-green-500 font-medium">Recompensa</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">${taskReward}</p>
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500">USD</p>
            </div>

            {/* Deadline */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-purple-700 dark:text-purple-500 font-medium">Fecha Limite</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{task.deadline}</p>
                </div>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-500">Fecha límite</p>
            </div>

            {/* Difficulty */}
            <div className={`bg-gradient-to-br border-2 rounded-xl p-4 ${difficulty.color}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/50 dark:bg-black/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium opacity-80">Dificultad</p>
                  <p className="text-lg font-bold">{difficulty.label}</p>
                </div>
              </div>
              <p className="text-xs opacity-80">{difficulty.icon} Nivel de complejidad</p>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Tecnologías</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, i) => {
                  const config = getTechConfig(tag);
                  return (
                    <span key={i} className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 ${config?.color || 'bg-gray-100 text-gray-800'}`}>
                      {config?.icon}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Role & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">Rol Requerido</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-300 capitalize">{task.type}</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium mb-1">Categoría</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-300 capitalize">{task.category || 'General'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements / Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Descripción Detallada
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                {task.detailedDescription || 'No hay descripción detallada disponible.'}
              </pre>
            </div>
          </div>

          {/* Timeline or Notes */}
          <div className="mb-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Información Adicional</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Tiempo estimado:</span> {task.difficulty === 'easy' ? '2-4 horas' : task.difficulty === 'medium' ? '4-8 horas' : '8+ horas'}
              </p>
              {task.assignedTo && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Asignada a:</span> {task.assignedTo}
                </p>
              )}
              {task.acceptedAt && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Aceptada:</span> {new Date(task.acceptedAt).toLocaleString('es-ES')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;