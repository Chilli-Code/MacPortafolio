// src/hooks/useNotificationSync.js
import { useEffect } from 'react';
import { useTasksStore } from '#store/tasksStore';

export const useNotificationSync = (addNotification, openWindow, closeWindow) => {
  const { hasNewTasks, notifyNewTasks } = useTasksStore();

  useEffect(() => {
    // Verificar nuevas tareas cada 3 segundos
    const checkNewTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks?status=available');
        const tasks = await response.json();
        
        // Obtener timestamp de última verificación
        const lastCheck = localStorage.getItem('lastTaskCheck');
        const currentTime = new Date().getTime();
        
        if (tasks.length > 0) {
          // Verificar si hay tareas nuevas desde la última vez
          const newTasks = tasks.filter(task => {
            const taskCreated = new Date(task.id).getTime(); // Asumiendo que id es timestamp
            return !lastCheck || taskCreated > parseInt(lastCheck);
          });

          if (newTasks.length > 0 && lastCheck) {
            // Hay tareas nuevas, notificar
            addNotification({
              app: "SISTEMA",
              title: "🚀 Nuevas tareas disponibles",
              message: `${newTasks.length} nueva(s) tarea(s). Abre la Terminal y ejecuta 'tasks fetch'`,
              icon: "📋",
              color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              time: "Ahora",
              action: () => {
                closeWindow("modalMode");
                openWindow("terminal");
              }
            });
          }
        }
        
        // Actualizar timestamp
        localStorage.setItem('lastTaskCheck', currentTime.toString());
      } catch (error) {
        console.error('Error checking new tasks:', error);
      }
    };

    // Verificar al iniciar sesión
    checkNewTasks();
    
    // Polling cada 3 segundos
    const interval = setInterval(checkNewTasks, 3000);

    return () => clearInterval(interval);
  }, [addNotification, openWindow, closeWindow]);
};