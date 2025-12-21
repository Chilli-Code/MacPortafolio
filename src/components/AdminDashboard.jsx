// src/components/AdminDashboard.jsx
import { useState } from 'react';
import { Shield, Users, Database, Settings, Activity, Bell, LogOut, TrendingUp, AlertCircle, CheckCircle } from '#assets/icons';
import AdminTasksSection from '#components/Admin/AdminTasksSection';
import AdminTaskForm from '#components/Admin/AdminTaskForm'; // ⭐ AGREGAR ESTO
import TaskDetailModal from '#components/TaskDetailModal';
import { useAdminTasks } from '#hoc/useAdminTasks';
import CardHome from '#components/Admin/CardHome';
import TableUsers from '#components/Admin/TableUsers';

const AdminDashboard = ({ onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null); // ⭐ AGREGAR ESTO
  
  const { 
    allTasks, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    approveTask, 
    rejectTask, 
    refreshTasks 
  } = useAdminTasks();
  
  const stats = {
    totalUsers: 42,
    activeTasks: allTasks.filter(t => t.status === 'pending_review').length,
    completedTasks: allTasks.filter(t => t.status === 'completed').length,
    systemHealth: 95
  };

  // ⭐ AGREGAR ESTA FUNCIÓN
  const handleEditTask = (task) => {
    console.log('📝 Editando tarea:', task);
    setEditingTask(task);
    setShowNewTaskModal(true);
  };

  // ⭐ AGREGAR ESTA FUNCIÓN
  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask(taskData);
    }
    setShowNewTaskModal(false);
    setEditingTask(null);
  };

  const tabs = [
    { id: 'tasks', name: 'Tareas', icon: Activity, badge: allTasks.length },
    { id: 'users', name: 'Usuarios', icon: Users, badge: stats.totalUsers },
    { id: 'database', name: 'Base de Datos', icon: Database },
    { id: 'settings', name: 'Configuración', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
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
              {stats.activeTasks > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="font-bold">{currentUser?.fullName?.charAt(0) || 'A'}</span>
              </div>
              <div>
                <p className="font-medium text-sm">{currentUser?.fullName || 'Admin'}</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
            
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors border border-red-600/30">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-gray-900/50 p-6 space-y-2">
          {tabs.map(({ id, name, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
              {badge > 0 && <span className="ml-auto bg-blue-500 text-xs px-2 py-1 rounded-full">{badge}</span>}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'tasks' && (
            <div>
              <CardHome />
                <AdminTasksSection
                  allTasks={allTasks}
                  onSelectTask={setSelectedTask}
                  onNewTask={() => {
                    setEditingTask(null); // ⭐ CAMBIAR ESTO
                    setShowNewTaskModal(true);
                  }}
                  onRefresh={refreshTasks}
                  onEditTask={handleEditTask} // ⭐ CAMBIAR ESTO
                  onDeleteTask={deleteTask}
                  onApproveTask={(taskId) => approveTask(taskId, currentUser.id)}
                  onRejectTask={(taskId, reason) => rejectTask(taskId, currentUser.id, reason)}
                />

            </div>
          )}

            {/* ⭐ AGREGAR ESTO */}
  {activeTab === 'users' && (
    <div className="space-y-6">
      <div className=" rounded-xl  p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestión de Usuarios</h2>
            <p className="text-gray-400">Administra los usuarios registrados en la plataforma</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity">
            + Nuevo Usuario
          </button>
        </div>
        
        {/* Aquí va tu componente TableUsers */}
        <TableUsers />
        
      </div>
      

    </div>
  )}
        </main>
      </div>

      {/* ⭐ AGREGAR ESTE MODAL */}
      {showNewTaskModal && (
        <AdminTaskForm
          onClose={() => {
            setShowNewTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingTask}
          isEditing={!!editingTask}
        />
      )}

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => {
            setSelectedTask(null);
            refreshTasks();
          }} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;