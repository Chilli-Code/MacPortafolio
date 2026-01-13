// src/services/api.js

// ⭐ USAR VARIABLE DE ENTORNO CON FALLBACK
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ⭐ Log para debug
console.log('🌐 API URL configurada:', API_URL);

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
    console.log('🔍 findTaskById: Searching for task with id:', id, typeof id);
    
    // Intento 1: Buscar directamente
    const directResponse = await fetch(`${API_URL}/tasks/${normalizeIdForJsonServer(id)}`);
    console.log('🔍 findTaskById: Direct search status:', directResponse.status);
    
    if (directResponse.ok) {
      const task = await directResponse.json();
      console.log('🔍 findTaskById: Found directly:', task.id, typeof task.id);
      return task;
    }
    
    // Intento 2: Buscar en todas las tareas
    console.log('🔍 findTaskById: Direct search failed, searching in all tasks...');
    const allTasksResponse = await fetch(`${API_URL}/tasks`);
    const allTasks = await allTasksResponse.json();
    
    // Usar comparación flexible (==) porque json-server puede cambiar el tipo
    const foundTask = allTasks.find(t => t.id == id);
    
    if (foundTask) {
      console.log('🔍 findTaskById: Found in all tasks:', foundTask.id, typeof foundTask.id);
    } else {
      console.log('🔍 findTaskById: Task not found in all tasks');
    }
    
    return foundTask || null;
    
  } catch (error) {
    console.error('🔍 findTaskById: Error:', error);
    return null;
  }
};

// ============ API PRINCIPAL ============

export const api = {
  // ==================== USUARIOS ====================
  
  async login(username, password) {
    try {
      console.log('🔐 Attempting login to:', `${API_URL}/users`);
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const users = await response.json();
      console.log('👥 Users fetched:', users.length);
      
      const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (user) {
        console.log('✅ Login successful:', user.username);
        return { success: true, user };
      }
      
      console.log('❌ Invalid credentials');
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  // ⭐ NUEVO: Obtener usuario por ID
  async getUser(userId) {
    try {
      console.log('👤 Fetching user:', userId);
      const response = await fetch(`${API_URL}/users/${normalizeIdForJsonServer(userId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const user = await response.json();
      console.log('✅ User fetched:', user.username);
      return user;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      return null;
    }
  },

  // ⭐ NUEVO: Actualizar usuario
  async updateUser(userId, userData) {
    try {
      console.log('✏️ Updating user:', userId);
      const response = await fetch(`${API_URL}/users/${normalizeIdForJsonServer(userId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedUser = await response.json();
      console.log('✅ User updated:', updatedUser.username);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating user:', error);
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
      console.error('❌ Error obteniendo tareas:', error);
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
      console.log('➕ Creating task:', taskData.title);
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const created = await response.json();
      console.log('✅ Task created:', created.id);
      return created;
    } catch (error) {
      console.error('❌ Error creating task:', error);
      return null;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      console.log('🔄 API: Updating task', taskId, typeof taskId, taskData);
      
      const existingTask = await findTaskById(taskId);
      
      if (!existingTask) {
        console.error('🔄 API: Task not found with id:', taskId);
        return null;
      }
      
      console.log('🔄 API: Found task with real id:', existingTask.id, typeof existingTask.id);
      
      const realTaskId = normalizeIdForJsonServer(existingTask.id);
      
      const response = await fetch(`${API_URL}/tasks/${realTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          id: existingTask.id
        })
      });
      
      console.log('🔄 API: Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔄 API: Update failed:', response.status, errorText);
        
        if (response.status === 404) {
          console.log('🔄 API: Trying PUT instead...');
          const putResponse = await fetch(`${API_URL}/tasks/${realTaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...existingTask,
              ...taskData
            })
          });
          
          if (putResponse.ok) {
            return await putResponse.json();
          }
        }
        
        return null;
      }
      
      const updatedTask = await response.json();
      console.log('🔄 API: Task updated successfully:', updatedTask);
      return updatedTask;
      
    } catch (error) {
      console.error('🔄 API: Error updating task:', error);
      return null;
    }
  },

  deleteTask: async (taskId) => {
    try {
      console.log('🗑️ API: Deleting task', taskId, typeof taskId);
      
      const existingTask = await findTaskById(taskId);
      
      if (!existingTask) {
        console.error('🗑️ API: Task not found with id:', taskId);
        return false;
      }
      
      console.log('🗑️ API: Found task with real id:', existingTask.id, typeof existingTask.id);
      
      const realTaskId = normalizeIdForJsonServer(existingTask.id);
      
      const response = await fetch(`${API_URL}/tasks/${realTaskId}`, {
        method: 'DELETE'
      });
      
      console.log('🗑️ API: DELETE response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🗑️ API: Delete failed:', response.status, errorText);
        return false;
      }
      
      console.log('🗑️ API: Task deleted successfully');
      return true;
      
    } catch (error) {
      console.error('🗑️ API: Error deleting task:', error);
      return false;
    }
  },

  getAllTasksAdmin: async () => {
    try {
      console.log('📋 Admin: Fetching all tasks');
      const response = await fetch(`${API_URL}/tasks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allTasks = await response.json();
      console.log('📋 Admin: Loaded all tasks:', allTasks.length);
      return allTasks;
    } catch (error) {
      console.error('❌ Error getting all tasks for admin:', error);
      return [];
    }
  },

  // ==================== GAMIFICACIÓN (NUEVAS FUNCIONES) ====================

  // 🏆 Obtener logros
  async getAchievements() {
    try {
      console.log('🏆 Fetching achievements');
      const response = await fetch(`${API_URL}/achievements`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const achievements = await response.json();
      console.log('✅ Achievements fetched:', achievements.length);
      return achievements;
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      return [];
    }
  },

  // 🎖️ Obtener badges
  async getBadges() {
    try {
      console.log('🎖️ Fetching badges');
      const response = await fetch(`${API_URL}/badges`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const badges = await response.json();
      console.log('✅ Badges fetched:', badges.length);
      return badges;
    } catch (error) {
      console.error('❌ Error fetching badges:', error);
      return [];
    }
  },

  // 📊 Obtener niveles
  async getLevels() {
    try {
      console.log('📊 Fetching levels');
      const response = await fetch(`${API_URL}/levels`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const levels = await response.json();
      console.log('✅ Levels fetched:', levels.length);
      return levels;
    } catch (error) {
      console.error('❌ Error fetching levels:', error);
      return [];
    }
  },

  // 📜 Crear log de actividad
  async createActivityLog(logData) {
    try {
      console.log('📜 Creating activity log:', logData.type);
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
      
      const log = await response.json();
      console.log('✅ Activity log created:', log.id);
      return log;
    } catch (error) {
      console.error('❌ Error creating activity log:', error);
      return null;
    }
  },

  // 🏅 Obtener leaderboard
  async getLeaderboard(type = 'xp', period = 'all_time') {
    try {
      console.log('🏅 Fetching leaderboard:', type, period);
      const response = await fetch(`${API_URL}/leaderboards?type=${type}&period=${period}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const leaderboards = await response.json();
      console.log('✅ Leaderboard fetched:', leaderboards.length);
      return leaderboards[0] || null;
    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      return null;
    }
  },

  // ============ NOTIFICACIONES GLOBALES ============

  // 📢 Crear notificación global (visible para todos los usuarios)
  async createGlobalNotification(notificationData) {
    try {
      console.log('📢 Creating global notification:', notificationData.title);
      const response = await fetch(`${API_URL}/globalNotifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          ...notificationData,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
          dismissedBy: []
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating global notification: ${response.status}`);
      }

      const notification = await response.json();
      console.log('✅ Global notification created:', notification);
      return notification;
    } catch (error) {
      console.error('❌ Error creating global notification:', error);
      throw error;
    }
  },

  // 📥 Obtener notificaciones globales activas
  async getGlobalNotifications() {
    try {
      console.log('📥 Fetching global notifications');
      const response = await fetch(`${API_URL}/globalNotifications`);
      if (!response.ok) {
        throw new Error(`Error fetching global notifications: ${response.status}`);
      }
      const notifications = await response.json();

      // Filtrar notificaciones expiradas y no descartadas por el usuario actual
      const currentUserId = localStorage.getItem('currentUserId') || 'anonymous';
      const activeNotifications = notifications.filter(notification => {
        const isExpired = new Date(notification.expiresAt) < new Date();
        const isDismissed = notification.dismissedBy?.includes(currentUserId);
        return !isExpired && !isDismissed;
      });

      console.log('✅ Active global notifications:', activeNotifications.length);
      return activeNotifications;
    } catch (error) {
      console.error('❌ Error fetching global notifications:', error);
      return [];
    }
  },

  // 🚫 Marcar notificación global como descartada por el usuario actual
  async dismissGlobalNotification(notificationId) {
    try {
      console.log('🚫 Dismissing global notification:', notificationId);

      // Obtener la notificación actual
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

      const updated = await updateResponse.json();
      console.log('✅ Global notification dismissed');
      return updated;
    } catch (error) {
      console.error('❌ Error dismissing global notification:', error);
      throw error;
    }
  }
};

export default api;