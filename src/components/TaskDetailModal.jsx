// src/components/TaskDetailModal.jsx
import { X, Calendar, DollarSign, Zap, AlertCircle, CheckCircle, XCircle, Send, User } from '#assets/icons';
import { useState } from 'react';
import { useTasksStore } from '#store/tasksStore';
import { useNotificationStore } from './AchievementNotification';

const TaskDetailModal = ({ task, onClose }) => {
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [adminReviewNotes, setAdminReviewNotes] = useState('');
  const { submitTask, approveTask, rejectTask, reopenTask, acceptTask } = useTasksStore();
  const { addNotification } = useNotificationStore();
  
  // Obtener usuario actual
  const currentUser = JSON.parse(localStorage.getItem('userSession') || '{}');
  const isAdmin = currentUser.role === 'admin';

  const handleAccept = async () => {
    try {
      await acceptTask(task.id, currentUser.id);
      addNotification({
        type: 'task',
        category: 'Tarea Aceptada',
        title: task.title,
        description: `Recompensa: $${task.reward}`,
        xp: 25
      });
      onClose();
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  };

  const handleSubmit = async () => {
    if (!submissionNotes.trim()) {
      alert('Debes escribir qué hiciste en esta tarea');
      return;
    }
    
    try {
      await submitTask(task.id, { notes: submissionNotes });
      addNotification({
        type: 'task',
        category: 'Tarea Enviada',
        title: task.title,
        description: 'Tu tarea ha sido enviada para revisión',
        xp: 10
      });
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await approveTask(task.id, currentUser.id, task.xp);
      addNotification({
        type: 'milestone',
        category: '✅ Tarea Aprobada',
        title: task.title,
        description: `El usuario ganó $${task.reward} y ${task.xp} XP`,
        xp: task.xp
      });
      onClose();
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  const handleReject = async () => {
    if (!adminReviewNotes.trim()) {
      alert('Debes explicar por qué rechazas la tarea');
      return;
    }
    
    try {
      await rejectTask(task.id, currentUser.id, adminReviewNotes);
      addNotification({
        type: 'task',
        category: '❌ Tarea Rechazada',
        title: task.title,
        description: 'Revisa los comentarios del administrador',
        xp: 0
      });
      onClose();
    } catch (error) {
      console.error('Error rejecting task:', error);
    }
  };

  const handleReopen = async () => {
    try {
      await reopenTask(task.id);
      onClose();
    } catch (error) {
      console.error('Error reopening task:', error);
    }
  };

  const statusConfig = {
    available: { color: 'blue', icon: '📋', text: 'Disponible' },
    in_progress: { color: 'orange', icon: '⏳', text: 'En Progreso' },
    pending_review: { color: 'purple', icon: '👀', text: 'En Revisión' },
    completed: { color: 'green', icon: '✅', text: 'Completada' },
    rejected: { color: 'red', icon: '❌', text: 'Rechazada' }
  };

  const status = statusConfig[task.status];

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-gray-800 dark:bg-gray-800/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-start justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
              <span className={`px-3 py-1 bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-400 text-sm font-semibold rounded-full`}>
                {status.icon} {status.text}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
          </div>
          <button onClick={onClose} className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Zap, label: 'XP', value: task.xp, color: 'yellow' },
              { icon: DollarSign, label: 'Pago', value: `$${task.reward}`, color: 'green' },
              { icon: Calendar, label: 'Deadline', value: task.deadline, color: 'blue' },
              { icon: AlertCircle, label: 'Dificultad', value: task.difficulty, color: 'purple' }
            ].map(({ icon: Icon, label, value, color }, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Assigned User (Admin view) */}
          {isAdmin && task.assignedTo && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900 dark:text-purple-300">
                  Asignada a: {task.assignedTo}
                </span>
              </div>
              {task.acceptedAt && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Aceptada: {new Date(task.acceptedAt).toLocaleString('es-ES')}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📋 Descripción Detallada:</h3>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-800 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                {task.detailedDescription}
              </pre>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">🏷️ Tecnologías:</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submission Notes */}
          {task.status === 'pending_review' && task.submissionNotes && (
            <div className="bg-blue-200 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Lo que hizo el usuario:
              </h3>
              <p className="text-sm text-gray-900">{task.submissionNotes}</p>
            </div>
          )}

          {/* Review Notes */}
          {(task.status === 'completed' || task.status === 'rejected') && task.reviewNotes && (
            <div className={`p-4 rounded-lg border ${
              task.status === 'completed'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {task.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                Comentarios del Admin:
              </h3>
              <p className="text-sm">{task.reviewNotes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {/* User Actions */}
            {!isAdmin && (
              <>
                {task.status === 'available' && (
                  <button onClick={handleAccept} className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                    🎯 Aceptar esta tarea
                  </button>
                )}

                {task.status === 'in_progress' && (
                  <div className="space-y-3">
                    <textarea
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      placeholder="Explica qué hiciste... (ej: 'Creé el componente Login con validación de formularios y diseño responsive')"
                      className="bg-blue-300 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 resize-none"
                      rows={4}
                    />
                    <button onClick={handleSubmit} className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                      📤 Enviar para Revisión
                    </button>
                  </div>
                )}

                {task.status === 'rejected' && (
                  <button onClick={handleReopen} className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
                    🔄 Corregir y Volver a Intentar
                  </button>
                )}
              </>
            )}

            {/* Admin Actions */}
            {isAdmin && task.status === 'pending_review' && (
              <div className="space-y-3">
                <textarea
                  value={adminReviewNotes}
                  onChange={(e) => setAdminReviewNotes(e.target.value)}
                  placeholder="Si rechazas, explica por qué... (ej: 'Falta la validación en tiempo real')"
                  className="w-full bg-blue-300 p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900  dark:bg-gray-900 resize-none"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button onClick={handleApprove} className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                    ✅ Aprobar
                  </button>
                  <button onClick={handleReject} className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors">
                    ❌ Rechazar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;