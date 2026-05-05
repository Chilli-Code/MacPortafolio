// src/windows/Safari.jsx
import { WindowControls } from "#components/Desktop";
import WindowWrapper from "#hoc/WindowWrapper";
import { useTasksStore } from "#store/tasksStore";
import { useState, useMemo, useCallback } from "react";
import TaskDetailView from "#Desktop/components/Safari/TaskDetailView";
import TaskTabs from "#Desktop/components/Safari/TaskTabs";
import TaskCard from "#Desktop/components/Safari/TaskCard";
import EmptyState from "#Desktop/components/Safari/EmptyState";
import { useNotificationStore } from '#components/AchievementNotification';
import { useSystemNotificationStore } from '#components/SystemNotification'; // ⭐ Sistema

import { ChevronLeft, ChevronRight, PanelLeft, Search, ShieldHalf, Share, Plus, Copy, Globe } from "#assets/icons";

const Safari = ({ isMaximized, setIsMaximized }) => {
  const { tasks, lastFetchedAt, userType, acceptTask, submitTask, fetchTasks, reopenTask } = useTasksStore();
  const { addNotification } = useNotificationStore();
  const { addSystemNotification } = useSystemNotificationStore(); // ⭐ Para sistema
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  // ✅ Inicialización de pestañas visibles y marcadores
  const defaultTabs = [
    { id: 'available', label: 'Tareas Disponibles' } // Solo esta aparece abierta
  ];

  const markerTabs = [
    { id: 'in_progress', label: 'Tareas En Progreso' },
    { id: 'pending_review', label: 'Tareas Pendientes' },
    { id: 'completed', label: 'Tareas Finalizadas' },
    { id: 'rejected', label: 'Tareas Rechazadas' }
  ];

  const [tabs, setTabs] = useState(defaultTabs);  // pestañas visibles

  // ⭐ Refrescar tareas solo si no hay datos o manualmente (no en cada tab)
  // NOTA: fetchTasks() ya se llama cuando el usuario ejecuta "tasks fetch" en terminal
  // y también después de aceptar/completar/reabrir tareas. No necesita llamarse en cada tab.

  // ⭐ Vista de detalle de tarea
  if (selectedTask) {
    const handleAccept = async () => {
      const currentUser = JSON.parse(localStorage.getItem('userSession'));
      await acceptTask(selectedTask.id, currentUser.id);
      
      addSystemNotification({
        type: 'task',
        app: 'Safari',
        title: 'Tarea aceptada',
        message: `"${selectedTask.title}" ha sido agregada a tus tareas en progreso`,
        showTime: true,
        duration: 3000
      });
      
      await fetchTasks();
      setSelectedTask(null);
      setActiveTab('in_progress');
    };

    const handleComplete = async () => {
      await submitTask(selectedTask.id, {
        notes: 'Tarea completada desde Safari'
      });

      addSystemNotification({
        type: 'success',
        app: 'Safari',
        title: 'Tarea enviada',
        message: `"${selectedTask.title}" está en revisión`,
        showTime: true
      });
      
      addNotification({
        type: 'task',
        category: '✅ Tarea Completada',
        title: selectedTask.title,
        description: 'Tu trabajo ha sido enviado para revisión',
        xp: selectedTask.xp
      });
      
      await fetchTasks();
      setSelectedTask(null);
    };

    const handleReopen = async () => {
      const success = await reopenTask(selectedTask.id);
      
      if (success) {
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
        addSystemNotification({
          type: 'error',
          app: 'Safari',
          title: 'Error al reabrir',
          message: 'No se pudo reabrir la tarea. Intenta de nuevo.',
          duration: 4000
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
          onReopen={handleReopen}
        />
      </>
    );
  }

  // ⭐ Memoizar filtrado de tareas por status
  const tasksByStatus = useMemo(() => ({
    available: tasks.filter(t => t.status === 'available'),
    in_progress: tasks.filter(t => 
      t.status === 'in_progress' && t.reviewStatus !== 'rejected' && t.status !== 'pending_review'
    ),
    completed: tasks.filter(t => t.status === 'completed'),
    rejected: tasks.filter(t => 
      t.status === 'rejected' || t.reviewStatus === 'rejected'
    ),
    pending_review: tasks.filter(t => t.status === 'pending_review'),
  }), [tasks]);

  // ⭐ Memoizar conteos
  const counts = useMemo(() => ({
    available: tasksByStatus.available.length,
    inProgress: tasksByStatus.in_progress.length,
    pending_review: tasksByStatus.pending_review.length,
    completed: tasksByStatus.completed.length,
    rejected: tasksByStatus.rejected.length,
  }), [tasksByStatus]);

  const currentTasks = tasksByStatus[activeTab] || [];

  // ⭐ Abrir marcador como pestaña dinámica
  const openMarkerTab = useCallback((marker) => {
    const exists = tabs.find(t => t.id === marker.id);
    if (exists) {
      setActiveTab(marker.id);
    } else {
      setTabs(prev => [...prev, marker]);
      setActiveTab(marker.id);
    }
  }, [tabs]);

  // ⭐ Agregar pestañas de comunidad
  const handleAddCommunityTab = useCallback((label = 'Proyectos Comunidad') => {
    const newTabId = `community-${Date.now()}`;
    const newTab = { id: newTabId, label };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTabId);
  }, []);

  // ⭐ Cerrar pestaña
  const handleCloseTab = useCallback((tabId) => {
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTab === tabId) setActiveTab(tabs[0]?.id || 'available');
  }, [activeTab, tabs]);

  return (
    <>
      {/* Header */}
      <div id="window-header" className="flex-shrink-0">
        <WindowControls target="safari" onMaximize={() => setIsMaximized(!isMaximized)} />
        <h2 className="flex items-center gap-2 justify-center w-full">
          <PanelLeft className="ml-10 icon" />
          Navegador
        </h2>
      </div>

      {/* Barra de navegación con búsqueda */}
      <div className="w-full flex flex-1 px-4 py-2 pb-0 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-1 mr-5">
          <ChevronLeft className="icon text-gray-700 dark:text-white" />
          <ChevronRight className="icon text-gray-700 dark:text-white" />
        </div>
        <div className="flex-1 flex-center gap-3 w-full ">
          <div className="search bg-gray-50 dark:bg-black/40 w-full rounded-full px-4 py-1.5 border-white/5 group-focus-within:border-blue-500/50 group-focus-within:ring-2 group-focus-within:ring-blue-500/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-3.5 h-3.5 text-green-600" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Buscar tareas o proyectos terminados.." 
              className="flex-1 bg-transparent text-gray-600 dark:text-white text-sm focus:outline-none placeholder-gray-400 dark:placeholder-white/30" 
            />
          </div>
        </div>
      </div>

{/* Marcadores */}
<div className="flex items-center gap-2 px-6 py-2  border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-x-auto">
  {markerTabs.map(marker => (
    <button
      key={marker.id}
      onClick={() => openMarkerTab(marker)}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-white/10  text-xs text-white/80 transition-colors whitespace-nowrap max-w-[150px]"
    >
  <Globe className="text-blue-400" size={15} />

      <span className="dark:text-gray-50 text-gray-900 font-semibold">{marker.label}</span>
    </button>
  ))}
</div>

      {/* Tabs */}
      <div className="bg-white barraS dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 pt-4 overflow-x-auto">
        <TaskTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          tabs={tabs} 
          onAddTab={() => handleAddCommunityTab()} 
          onCloseTab={handleCloseTab} 
          counts={counts}
        />
      </div>
<div className="overflow-y-auto h-full bg-gray-50 dark:bg-gray-900">

      {/* Contenido */}
      <div className="p-6 mb-44">
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
        {activeTab.startsWith('community') ? (
          <div className="p-6 rounded-lg bg-white/5 dark:bg-gray-800 text-white">
            <h2 className="text-xl font-semibold mb-2">
              Aquí encontrarás proyectos terminados de la comunidad
            </h2>
            <p className="text-gray-300 text-sm">
              Explora proyectos finalizados por otros usuarios.
            </p>
          </div>
        ) : !lastFetchedAt ? (
          <EmptyState type="no-fetch" />
        ) : currentTasks.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {currentTasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
            ))}
          </div>
        )}
      </div>
</div>

    </>
  );
};

export default WindowWrapper(Safari, 'safari');
