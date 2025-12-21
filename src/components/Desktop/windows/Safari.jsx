// src/windows/Safari.jsx
import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
import { useTasksStore } from "#store/tasksStore";
import { useState, useEffect } from "react";
import TaskDetailView from "#Desktop/components/Safari/TaskDetailView";
import TaskTabs from "#Desktop/components/Safari/TaskTabs";
import TaskCard from "#Desktop/components/Safari/TaskCard";
import EmptyState from "#Desktop/components/Safari/EmptyState";
import { useNotificationStore } from '#components/AchievementNotification';
import { ChevronLeft, ChevronRight, PanelLeft, Search, ShieldHalf, Share, Plus, Copy } from "#assets/icons";

const Safari = ({ isMaximized, setIsMaximized }) => {
  const { tasks, lastFetchedAt, userType, acceptTask, submitTask, fetchTasks, reopenTask } = useTasksStore();
  const { addNotification } = useNotificationStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  // ⭐ Refrescar tareas cuando cambia el tab
  useEffect(() => {
    if (lastFetchedAt) {
      fetchTasks();
    }
  }, [activeTab]);

  // ⭐ Vista de detalle de tarea
  if (selectedTask) {
    const handleAccept = async () => {
      const currentUser = JSON.parse(localStorage.getItem('userSession'));
      await acceptTask(selectedTask.id, currentUser.id);
      
      addNotification({
        type: 'task',
        category: 'Tarea Aceptada',
        title: selectedTask.title,
        description: `Recompensa: $${selectedTask.reward}`,
        xp: 25
      });
      
      await fetchTasks();
      setSelectedTask(null);
      setActiveTab('in_progress');
    };

    const handleComplete = async () => {
      await submitTask(selectedTask.id, {
        notes: 'Tarea completada desde Safari'
      });
      
      addNotification({
        type: 'task',
        category: 'Tarea Enviada',
        title: selectedTask.title,
        description: 'Tu tarea ha sido enviada para revisión',
        xp: 10
      });
      
      await fetchTasks();
      setSelectedTask(null);
    };

    // ⭐ Manejar reabrir tarea rechazada
// ⭐ Manejar reabrir tarea rechazada - ACTUALIZADA
const handleReopen = async () => {
  const success = await reopenTask(selectedTask.id);
  
  if (success) {
    addNotification({
      type: 'task',
      category: 'Tarea Reabierta',
      title: selectedTask.title,
      description: 'La tarea ha sido movida a "En Progreso"',
      xp: 0
    });
    
    await fetchTasks();
    setSelectedTask(null);
    setActiveTab('in_progress'); // ⭐ Cambiar al tab de En Progreso
  } else {
    addNotification({
      type: 'error',
      title: 'Error',
      description: 'No se pudo reabrir la tarea'
    });
  }
};

    return (
      <>
        <div id="window-header" className="bgt">
          <WindowControls target="safari" onMaximize={() => setIsMaximized(!isMaximized)} />
        </div>
        <TaskDetailView 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAccept={handleAccept}
          onComplete={handleComplete}
          onReopen={handleReopen} // ⭐ Nuevo prop
        />
      </>
    );
  }

  // ⭐ Filtrar tareas por status (INCLUIR RECHAZADAS)
const tasksByStatus = {
  available: tasks.filter(t => t.status === 'available'),
  in_progress: tasks.filter(t => 
    t.status === 'in_progress' && t.reviewStatus !== 'rejected' && t.status !== 'pending_review'// ⭐ EXCLUIR RECHAZADAS
  ),
  completed: tasks.filter(t => t.status === 'completed'),
  rejected: tasks.filter(t => 
    t.status === 'rejected' || t.reviewStatus === 'rejected' // ⭐ INCLUIR AMBOS CASOS
  ),
pending_review: tasks.filter(t => t.status === 'pending_review'),
};


  const counts = {
    available: tasksByStatus.available.length,
    inProgress: tasksByStatus.in_progress.length,
    pending_review: tasksByStatus.pending_review.length,
    completed: tasksByStatus.completed.length,
    rejected: tasksByStatus.rejected.length,
  };

  const currentTasks = tasksByStatus[activeTab] || [];

  return (
    <>
      <div id="window-header" className="bgt">
        <WindowControls target="safari" onMaximize={() => setIsMaximized(!isMaximized)} />
        <PanelLeft className="ml-10 icon" />
        <div className="flex items-center gap-1 ml-5">
          <ChevronLeft className="icon" />
          <ChevronRight className="icon" />
        </div>
        <div className="flex-1 flex-center gap-3">
          <ShieldHalf className="icon" />
          <div className="search">
            <Search className="w-5 h-5 text-gray-600" />
            <input type="text" placeholder="Buscar tareas..." className="flex-1" />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Share className="icon" />
          <Plus className="icon" />
          <Copy className="icon" />
        </div>
      </div>

      <div className="overflow-y-auto h-full bg-gray-50 dark:bg-gray-900">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 pt-4 overflow-x-auto">
          <TaskTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            counts={counts} 
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'available' && 'Tareas Disponibles'}
              {activeTab === 'in_progress' && 'Tareas En Progreso'}
              {activeTab === 'pending_review' && 'Tareas Pendientes'}
              {activeTab === 'completed' && 'Tareas Finalizadas'}
              {activeTab === 'rejected' && 'Tareas Rechazadas'}
            </h1>
            {lastFetchedAt ? (
              <p className="text-gray-600 dark:text-gray-400">
                Tipo: <span className="font-semibold text-blue-600">{userType}</span> · 
                Última actualización: {new Date(lastFetchedAt).toLocaleString('es-ES')}
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Ejecuta <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">tasks fetch</code> en la Terminal
              </p>
            )}
          </div>

          {/* Content */}
          {!lastFetchedAt ? (
            <EmptyState type="no-fetch" />
          ) : currentTasks.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <div className="grid grid-cols-1 gap-4 mb-20" 
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
              }}
            >
              {currentTasks.map((task) => (
                <TaskCard 
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WindowWrapper(Safari, 'safari');