import { useState, useEffect } from 'react';
import { api } from '../service/apis';
import { useNotificationStore } from '../components/AchievementNotification';

const API = '/api';

export const useAdminTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/tasks`);
      const tasks = await response.json();
      setAllTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          bonusReward: 0,
          status: 'available',
          createdBy: 'adm_001'
        })
      });

      const data = await response.json();
      const newTask = data.task || data;

      if (newTask && newTask.id) {
        await loadTasks();

        addNotification({
          app: "SISTEMA",
          title: "✅ Tarea publicada",
          message: `La tarea "${newTask.title}" ha sido publicada exitosamente`,
          icon: "📋",
          color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          time: "Ahora"
        });

        try {
          await api.createGlobalNotification({
            type: "new_task",
            title: "🚀 Nueva tarea disponible",
            message: `Se ha publicado: "${newTask.title}" - ${newTask.xp} XP`,
            icon: "📋",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            action: { type: "open_terminal", data: null },
            priority: "normal"
          });
        } catch (error) {
          console.error('Error creando notificación global:', error);
        }

        return newTask;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const actualId = typeof taskId === 'object' ? taskId.id : taskId;
      const response = await fetch(`${API}/tasks/${actualId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const updated = await response.json();

      if (updated && (updated.id || updated.success)) {
        await loadTasks();
        addNotification({
          app: "SISTEMA",
          title: "✏️ Tarea actualizada",
          message: "La tarea ha sido actualizada",
          icon: "📝",
          color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          time: "Ahora"
        });
        return updated.task || updated;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      const response = await fetch(`${API}/tasks/${taskId}`, { method: 'DELETE' });
      const deleted = await response.json();

      if (deleted) {
        await loadTasks();
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

  const approveTask = async (taskId, adminId) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      const response = await fetch(`${API}/tasks/${taskId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId: adminId })
      });
      const updated = await response.json();

      if (updated) {
        await loadTasks();
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

  const rejectTask = async (taskId, adminId, reason) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      const response = await fetch(`${API}/tasks/${taskId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerId: adminId,
          reviewNotes: reason || 'Tarea rechazada'
        })
      });
      const updated = await response.json();

      if (updated) {
        await loadTasks();
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
    approveTask,
    rejectTask,
    refreshTasks: loadTasks
  };
};