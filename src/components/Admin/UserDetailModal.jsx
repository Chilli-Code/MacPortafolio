import { X, Mail, Shield, Calendar, Award, Zap, Clock, Activity, User, Edit } from '#assets/icons';

const UserDetailModal = ({ user, onClose, onEdit }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
              {user.fullName?.charAt(0) || user.username.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.fullName || user.username}</h2>
              <p className="text-gray-400">@{user.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit?.(user)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Role badge */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs">Nivel</span>
              </div>
              <p className="text-2xl font-bold">{user.level || 1}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs">XP Total</span>
              </div>
              <p className="text-2xl font-bold">{user.totalXP || 0}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs">Tareas</span>
              </div>
              <p className="text-2xl font-bold">{user.tasksCompleted || 0}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Horas</span>
              </div>
              <p className="text-2xl font-bold">{user.totalHoursWorked || 0}</p>
            </div>
          </div>

          {/* Info section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Miembro desde</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <Activity className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Rango</p>
                <p className="font-medium">{user.rank || 'Novato'} {user.rankIcon}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-400">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {(typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;