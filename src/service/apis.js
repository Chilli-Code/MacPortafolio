// src/services/api.js

// ⭐ USAR VARIABLE DE ENTORNO CON FALLBACK
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============ FUNCIONES AUXILIARES ============

// ⭐ Helper function para normalizar IDs
const normalizeIdForJsonServer = (id) => {
  if (id == null) return '';
  if (typeof id === 'string') return id;
  if (typeof id === 'number') return id.toString();
  return String(id);
};

// ⭐ Función para buscar tarea por ID
const findTaskById = async (id) => {
  try {
    const directResponse = await fetch(`${API_URL}/tasks/${normalizeIdForJsonServer(id)}`);
    
    if (directResponse.ok) {
      return await directResponse.json();
    }
    
    const allTasksResponse = await fetch(`${API_URL}/tasks`);
    const allTasks = await allTasksResponse.json();
    return allTasks.find(t => t.id == id) || null;
    
  } catch (error) {
    console.error('Error finding task:', error);
    return null;
  }
};

// ============ API PRINCIPAL ============

export const api = {
  // ==================== USUARIOS ====================
  
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const users = await response.json();
      
      const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (user) {
        return { success: true, user };
      }
      
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  // ⭐ NUEVO: Obtener usuario por ID
  async getUser(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${normalizeIdForJsonServer(userId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // ⭐ NUEVO: Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_URL}/users/${normalizeIdForJsonServer(userId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // ==================== TAREAS ====================
  
  async getTasks(userType = null, status = 'available') {
    try {
      const url = `${API_URL}/tasks?status=${status}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allTasks = await response.json();
      const currentUser = JSON.parse(localStorage.getItem('userSession') || '{}');
      
      if (!userType) {
        return allTasks;
      }
      
      const filtered = allTasks.filter(t => {
        if (status === 'available') {
          return t.type === userType || t.type === 'fullstack';
        }
        
        return (t.type === userType || t.type === 'fullstack') && 
               (t.assignedTo === currentUser.id || !t.assignedTo);
      });
      
      return filtered;
      
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  async getTask(id) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo tarea:', error);
      return null;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const existingTask = await findTaskById(taskId);
      
      if (!existingTask) {
        console.error('Task not found:', taskId);
        return null;
      }
      
      const realTaskId = normalizeIdForJsonServer(existingTask.id);
      
      const response = await fetch(`${API_URL}/tasks/${realTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          id: existingTask.id
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed:', response.status, errorText);
        return null;
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const existingTask = await findTaskById(taskId);
      
      if (!existingTask) {
        console.error('Task not found:', taskId);
        return false;
      }
      
      const realTaskId = normalizeIdForJsonServer(existingTask.id);
      const response = await fetch(`${API_URL}/tasks/${realTaskId}`, { method: 'DELETE' });
      
      if (!response.ok) {
        console.error('Delete failed:', response.status);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  getAllTasksAdmin: async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting all tasks for admin:', error);
      return [];
    }
  },

  // ==================== GAMIFICACIÓN (NUEVAS FUNCIONES) ====================

  // 🏆 Obtener logros
  async getAchievements() {
    try {
      const response = await fetch(`${API_URL}/achievements`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  // 🎖️ Obtener badges
  async getBadges() {
    try {
      const response = await fetch(`${API_URL}/badges`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  },

  // 📊 Obtener niveles
  async getLevels() {
    try {
      const response = await fetch(`${API_URL}/levels`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching levels:', error);
      return [];
    }
  },

  // 📜 Crear log de actividad
  async createActivityLog(logData) {
    try {
      const response = await fetch(`${API_URL}/activityLog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating activity log:', error);
      return null;
    }
  },

  // 🏅 Obtener leaderboard
  async getLeaderboard(type = 'xp', period = 'all_time') {
    try {
      const response = await fetch(`${API_URL}/leaderboards?type=${type}&period=${period}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const leaderboards = await response.json();
      return leaderboards[0] || null;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }
  },

  // ============ NOTIFICACIONES GLOBALES ============

  // 📢 Crear notificación global (visible para todos los usuarios)
  async createGlobalNotification(notificationData) {
    try {
      const response = await fetch(`${API_URL}/globalNotifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now().toString(),
          ...notificationData,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          dismissedBy: []
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating global notification: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating global notification:', error);
      throw error;
    }
  },

  // 📥 Obtener notificaciones globales activas
  async getGlobalNotifications() {
    try {
      const response = await fetch(`${API_URL}/globalNotifications`);
      if (!response.ok) {
        throw new Error(`Error fetching global notifications: ${response.status}`);
      }
      const notifications = await response.json();

      const currentUserId = localStorage.getItem('currentUserId') || 'anonymous';
      return notifications.filter(notification => {
        const isExpired = new Date(notification.expiresAt) < new Date();
        const isDismissed = notification.dismissedBy?.includes(currentUserId);
        return !isExpired && !isDismissed;
      });
    } catch (error) {
      console.error('Error fetching global notifications:', error);
      return [];
    }
  },

  // 🚫 Marcar notificación global como descartada por el usuario actual
  async dismissGlobalNotification(notificationId) {
    try {
      const notificationResponse = await fetch(`${API_URL}/globalNotifications/${notificationId}`);
      if (!notificationResponse.ok) {
        throw new Error(`Error fetching notification: ${notificationResponse.status}`);
      }

      const notification = await notificationResponse.json();
      const currentUserId = localStorage.getItem('currentUserId') || 'anonymous';

      // Agregar el usuario actual a dismissedBy
      const updatedDismissedBy = [...(notification.dismissedBy || []), currentUserId];

      // Actualizar la notificación
      const updateResponse = await fetch(`${API_URL}/globalNotifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dismissedBy: updatedDismissedBy
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Error updating notification: ${updateResponse.status}`);
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Error dismissing global notification:', error);
      throw error;
    }
  }
};

export default api;