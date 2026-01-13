// src/hooks/useAdminTasks.js
import { useState, useEffect } from 'react';
import { api } from '../service/apis'; // ⭐ Corregir ruta
import { useNotificationStore } from '../components/AchievementNotification';

export const useAdminTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  // ⭐ Cargar TODAS las tareas (sin filtros)
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/tasks');
      const tasks = await response.json();
      console.log('📋 Admin loaded tasks:', tasks.length);
      setAllTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear tarea
  const createTask = async (taskData) => {
    try {
      const newTask = await api.createTask({
        ...taskData,
        status: 'available',
        images: [],
        assignedTo: null,
        submittedAt: null,
        reviewedAt: null,
        reviewedBy: null,
        reviewNotes: null,
        submissionNotes: null,
        submissionFiles: []
      });

      if (newTask) {
        await loadTasks(); // Recargar todas las tareas

        // Notificación local para el admin
        addNotification({
          app: "SISTEMA",
          title: "✅ Tarea publicada",
          message: `La tarea "${newTask.title}" ha sido publicada exitosamente`,
          icon: "📋",
          color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          time: "Ahora"
        });

        // 📢 Crear notificación global para todos los usuarios conectados
        try {
          await api.createGlobalNotification({
            type: "new_task",
            title: "🚀 Nueva tarea disponible",
            message: `Se ha publicado: "${newTask.title}" - ${newTask.reward} XP`,
            icon: "📋",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            action: {
              type: "open_terminal",
              data: null
            },
            priority: "normal"
          });
          console.log('📢 Notificación global enviada para nueva tarea');
        } catch (error) {
          console.error('❌ Error creando notificación global:', error);
        }

        return newTask;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };


// Actualizar tarea - CORREGIDO
const updateTask = async (taskId, taskData) => {
  try {
    console.log('🔄 Updating task with ID:', taskId, typeof taskId);
    
    // ⭐ Si taskData contiene el ID completo, extraerlo
    const actualId = typeof taskId === 'object' ? taskId.id : taskId;
    
    const updated = await api.updateTask(actualId, taskData);
    
    if (updated) {
      await loadTasks(); // Recargar todas las tareas
      
      addNotification({
        app: "SISTEMA",
        title: "✏️ Tarea actualizada",
        message: "La tarea ha sido actualizada",
        icon: "📝",
        color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        time: "Ahora"
      });
      
      return updated;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

  // Eliminar tarea
  const deleteTask = async (taskId) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      const deleted = await api.deleteTask(taskId);
      
      if (deleted) {
        await loadTasks(); // Recargar todas las tareas
        
        addNotification({
          app: "SISTEMA",
          title: "🗑️ Tarea eliminada",
          message: `La tarea "${task?.title}" ha sido eliminada`,
          icon: "❌",
          color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          time: "Ahora"
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  // ⭐ APROBAR TAREA
  const approveTask = async (taskId, adminId) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      const updated = await api.updateTask(taskId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: adminId,
        reviewNotes: '✅ Tarea aprobada. Excelente trabajo!'
      });
      
      if (updated) {
        await loadTasks(); // Recargar todas las tareas
        
        addNotification({
          app: "ADMIN",
          title: "✅ Tarea Aprobada",
          message: `La tarea "${task?.title}" ha sido aprobada`,
          icon: "✅",
          color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          time: "Ahora"
        });
        
        return updated;
      }
    } catch (error) {
      console.error('Error approving task:', error);
      return null;
    }
  };

  // ⭐ RECHAZAR TAREA
// ⭐ RECHAZAR TAREA - ACTUALIZADA
const rejectTask = async (taskId, adminId, reason) => {
  try {
    const task = allTasks.find(t => t.id === taskId);
    const updated = await api.updateTask(taskId, {
      status: 'rejected', // ⭐ CAMBIAR aquí también
      reviewStatus: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminId,
      reviewNotes: reason || '❌ Tarea rechazada. Revisa los comentarios.'
    });
    
    if (updated) {
      await loadTasks(); // Recargar todas las tareas
      
      addNotification({
        app: "ADMIN",
        title: "❌ Tarea Rechazada",
        message: `La tarea "${task?.title}" ha sido rechazada`,
        icon: "❌",
        color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        time: "Ahora"
      });
      
      return updated;
    }
  } catch (error) {
    console.error('Error rejecting task:', error);
    return null;
  }
};

  // Auto-refresh cada 10 segundos
  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    allTasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    approveTask,  // ⭐ Nuevo
    rejectTask,   // ⭐ Nuevo
    refreshTasks: loadTasks
  };
};