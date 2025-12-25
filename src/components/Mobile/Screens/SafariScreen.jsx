import { useState, useEffect } from 'react';
import { Search } from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';
import { useTasksStore } from '#store/tasksStore';
import TasksList from '#components/Mobile/components/mobileSafari/TasksList';
import TaskDetailMobile from '#components/Mobile/components/mobileSafari/TaskDetailMobile';
import { useSystemNotificationStore } from '#components/SystemNotification';
import { useNotificationStore } from '#components/AchievementNotification'; // Si tienes esto

const SafariScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Obtén todas las funciones que necesitas del store
  const { 
    tasks, 
    acceptTask, 
    submitTask, 
    reopenTask, 
    fetchTasks,
    lastFetchedAt,
    userType 
  } = useTasksStore();
  
  const { addSystemNotification } = useSystemNotificationStore();
  const { addNotification } = useNotificationStore(); // Si lo necesitas

  // Agrupar tareas por estado (igual que en desktop)
  const tasksByStatus = {
    available: tasks.filter(t => t.status === 'available'),
    in_progress: tasks.filter(t => 
      t.status === 'in_progress' && t.reviewStatus !== 'rejected' && t.status !== 'pending_review'
    ),
    completed: tasks.filter(t => t.status === 'completed'),
    rejected: tasks.filter(t => 
      t.status === 'rejected' || t.reviewStatus === 'rejected'
    ),
    pending_review: tasks.filter(t => t.status === 'pending_review'),
  };

  // Refrescar tareas cuando cambia el tab
  useEffect(() => {
    if (lastFetchedAt) {
      fetchTasks();
    }
  }, [activeTab, lastFetchedAt]);

  // Handler para ver detalles de tarea
  const handleTaskDetail = (task) => {
    setSelectedTask(task);
  };

  // Handler para volver a la lista
  const handleBackFromDetail = () => {
    setSelectedTask(null);
  };


  // Handler para aceptar tarea (IGUAL QUE EN DESKTOP)
const handleAcceptTask = async () => {
  if (!selectedTask) return;
  
  const currentUser = JSON.parse(localStorage.getItem('userSession'));
  
  // 1. Primero la notificación (para que suene inmediatamente)
  addSystemNotification({
    type: 'info',
    app: 'Safari',
    title: 'Tarea aceptada',
    message: `"${selectedTask.title}" ha sido agregada a tus tareas en progreso`,
    showTime: true,
    duration: 3000
  });
  
  // 2. Luego aceptar la tarea
  await acceptTask(selectedTask.id, currentUser?.id);
  
  // Pequeño delay para que el sonido se reproduzca
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 3. Refrescar tareas
  await fetchTasks();
  
  // 4. Cerrar detalles y cambiar tab
  setSelectedTask(null);
  setActiveTab('in_progress');
};

  // Handler para completar tarea (IGUAL QUE EN DESKTOP)
  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    
    await submitTask(selectedTask.id, {
      notes: 'Tarea completada desde móvil'
    });
    
    // Notificación del sistema
    addSystemNotification({
      type: 'success',
      app: 'Safari',
      title: 'Tarea enviada',
      message: `"${selectedTask.title}" está en revisión`,
      showTime: true
    });
    
    
    await fetchTasks();
    setSelectedTask(null);
  };

  // Handler para reabrir tarea rechazada (IGUAL QUE EN DESKTOP)
  const handleReopenTask = async () => {
    if (!selectedTask) return;
    
    const success = await reopenTask(selectedTask.id);
    
    if (success) {
      // Notificación del sistema
      addSystemNotification({
        type: 'info',
        app: 'Safari',
        title: 'Tarea reabierta',
        message: `"${selectedTask.title}" ha sido movida a "En Progreso"`,
        showTime: true
      });
      
      await fetchTasks();
      setSelectedTask(null);
      setActiveTab('in_progress');
    } else {
      // Error del sistema
      addSystemNotification({
        type: 'error',
        app: 'Safari',
        title: 'Error al reabrir',
        message: 'No se pudo reabrir la tarea. Intenta de nuevo.',
        duration: 4000
      });
    }
  };

  // Mapa de colores para tabs
  const tabColors = {
    available: 'bg-blue-500 text-white',
    in_progress: 'bg-orange-500 text-white',
    pending_review: 'bg-purple-500 text-white',
    completed: 'bg-green-500 text-white',
    rejected: 'bg-red-500 text-white',
  };

  const tabs = [
    { id: 'available', label: 'Disponible', count: tasksByStatus.available.length, color: 'blue' },
    { id: 'in_progress', label: 'En Progreso', count: tasksByStatus.in_progress.length, color: 'orange' },
    { id: 'pending_review', label: 'Pendientes', count: tasksByStatus.pending_review.length, color: 'purple' },
    { id: 'completed', label: 'Completadas', count: tasksByStatus.completed.length, color: 'green' },
    { id: 'rejected', label: 'Rechazadas', count: tasksByStatus.rejected.length, color: 'red' },
  ];

  // Si hay una tarea seleccionada, mostrar el detalle
  if (selectedTask) {
    return (
      <TaskDetailMobile
        task={selectedTask}
        onBack={handleBackFromDetail}
        onAccept={handleAcceptTask}
        onComplete={handleCompleteTask}
        onReopen={handleReopenTask}
      />
    );
  }

  // Mostrar lista de tareas (pantalla principal)
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <MobileNav 
        title="Tareas"
        onBack={onBack}
        showCancel={false}
      />

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs - Ahora incluye "Pendientes" */}
      <div className="px-4 py-3 overflow-x-auto border-b border-gray-200 dark:border-gray-700 barraS">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? tabColors[tab.id] || 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {tab.label}
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${activeTab === tab.id
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List - Pasa la función para ver detalles */}
      <TasksList 
        activeTab={activeTab}
        searchQuery={searchQuery}
        tasksByStatus={tasksByStatus}
        onTaskDetail={handleTaskDetail}
      />
    </div>
  );
};

export default SafariScreen;