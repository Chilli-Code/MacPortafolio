import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, AlertCircle, Clock, User } from '#assets/icons';

const TaskReviewModal = ({ task, user, onClose, onApprove, onReject }) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rejectionReasons = [
    "Falta funcionalidad requerida",
    "Código con errores/bugs",
    "Diseño no responsive",
    "No cumple criterios de aceptación",
    "Documentación incompleta",
    "Problemas de performance",
    "No sigue mejores prácticas",
    "Otro (especificar en comentarios)"
  ];

  const handleApprove = async () => {
    if (!reviewNotes.trim()) {
      alert('Por favor agrega comentarios de revisión');
      return;
    }

    setIsLoading(true);
    try {
      await onApprove(task.id, reviewNotes);
      onClose();
    } catch (error) {
      console.error('Error approving task:', error);
      alert('Error al aprobar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Selecciona una razón de rechazo');
      return;
    }
    if (!reviewNotes.trim()) {
      alert('Agrega comentarios explicando qué necesita corrección');
      return;
    }

    setIsLoading(true);
    try {
      await onReject(task.id, rejectionReason, reviewNotes);
      onClose();
    } catch (error) {
      console.error('Error rejecting task:', error);
      alert('Error al rechazar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Revisar Tarea</h2>
                <p className="text-sm text-gray-400">{task.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Estado actual */}
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-400">Usuario</p>
                <p className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.fullName || task.assignedTo}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Enviado</p>
                <p className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {task.submittedAt ? new Date(task.submittedAt).toLocaleString('es-ES') : 'N/A'}
                </p>
              </div>
              {task.revisionCount > 0 && (
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Reenvíos</p>
                  <p className="font-semibold text-yellow-400">
                    {task.revisionCount} vez{task.revisionCount !== 1 ? 'es' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Notas del usuario */}
          {task.submissionNotes && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notas del Usuario
              </h3>
              <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-700">
                <p className="whitespace-pre-line">{task.submissionNotes}</p>
              </div>
            </div>
          )}

          {/* Archivos adjuntos (si los hay) */}
          {task.submissionFiles && task.submissionFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-400">Archivos Adjuntos</h3>
              <div className="space-y-2">
                {task.submissionFiles.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">{file.size}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comentarios del revisor */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Tus Comentarios de Revisión
            </h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Escribe tus comentarios de revisión aquí. Sé específico sobre qué está bien y qué necesita mejora..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              required
            />
          </div>

          {/* Formulario de rechazo (si se selecciona) */}
          {showRejectForm && (
            <div className="bg-red-900/10 border border-red-800/30 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 text-red-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Razón de Rechazo
              </h3>
              
              <div className="space-y-3">
                {/* Razones predefinidas */}
                <div className="grid grid-cols-2 gap-2">
                  {rejectionReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => setRejectionReason(reason)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        rejectionReason === reason
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {/* Razón personalizada */}
                <div>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="O escribe tu propia razón..."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setShowRejectForm(!showRejectForm)}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                showRejectForm
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
              }`}
            >
              <XCircle className="w-4 h-4" />
              {showRejectForm ? 'Cancelar Rechazo' : 'Rechazar Tarea'}
            </button>

            <button
              onClick={handleApprove}
              disabled={isLoading || showRejectForm}
              className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Aprobar Tarea
                </>
              )}
            </button>

            {showRejectForm && (
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Confirmar Rechazo
              </button>
            )}
          </div>

          {/* Información */}
          <div className="text-sm text-gray-500 bg-gray-900/30 p-3 rounded-lg">
            <p><span className="font-semibold">✅ Aprobar:</span> La tarea se marcará como completada y el usuario recibirá XP/pago.</p>
            <p className="mt-1"><span className="font-semibold">❌ Rechazar:</span> La tarea volverá a "en progreso" para correcciones.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReviewModal;