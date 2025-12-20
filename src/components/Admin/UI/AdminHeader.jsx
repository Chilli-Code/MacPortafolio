import { Shield, Bell, LogOut } from '#assets/icons';

const AdminHeader = ({ currentUser, activeTasksCount, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Panel Admin</h1>
            <p className="text-sm text-gray-400">Sistema de Gestión de Tareas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {activeTasksCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="font-bold">A</span>
            </div>
            <div>
              <p className="font-medium text-sm">{currentUser?.fullName || 'Admin'}</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors border border-red-600/30"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;