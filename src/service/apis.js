// src/services/api.js
const API_URL = 'http://localhost:3001';

// ============ FUNCIONES AUXILIARES (¡DEBEN ESTAR DEFINIDAS!) ============

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
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      
      const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (user) {
        return { success: true, user };
      }
      
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  },

  // ==================== TAREAS ====================
  async getTasks(userType = null, status = 'available') {
    try {
      const currentUser = JSON.parse(localStorage.getItem('userSession') || '{}');
      const response = await fetch(`${API_URL}/tasks?status=${status}`);
      const allTasks = await response.json();
      
      if (!userType) return allTasks;
      
      // ⭐ Filtrar por tipo Y por usuario asignado
      return allTasks.filter(t => {
        // Si es available, solo mostrar por tipo
        if (status === 'available') {
          return t.type === userType || t.type === 'fullstack';
        }
        
        // Si es in_progress o completed, filtrar por usuario asignado
        return (t.type === userType || t.type === 'fullstack') && 
               (t.assignedTo === currentUser.id || !t.assignedTo);
      });
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      return [];
    }
  },

  async getTask(id) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo tarea:', error);
      return null;
    }
  },

  // Crear nueva tarea
  createTask: async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // ⭐ ACTUALIZAR TAREA - Versión mejorada
  updateTask: async (taskId, taskData) => {
    try {
      console.log('🔄 API: Updating task', taskId, typeof taskId, taskData);
      
      // Paso 1: Buscar la tarea para obtener su ID real
      const existingTask = await findTaskById(taskId);
      
      if (!existingTask) {
        console.error('🔄 API: Task not found with id:', taskId);
        return null;
      }
      
      console.log('🔄 API: Found task with real id:', existingTask.id, typeof existingTask.id);
      
      // Paso 2: Usar el ID REAL de la tarea encontrada
      const realTaskId = normalizeIdForJsonServer(existingTask.id);
      
      const response = await fetch(`${API_URL}/tasks/${realTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          // Mantener el ID original
          id: existingTask.id
        })
      });
      
      console.log('🔄 API: Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔄 API: Update failed:', response.status, errorText);
        
        // Intentar como PUT si PATCH falla
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

  // ⭐ ELIMINAR TAREA - Versión mejorada
  deleteTask: async (taskId) => {
    try {
      console.log('🗑️ API: Deleting task', taskId, typeof taskId);
      
      // Paso 1: Buscar la tarea
      const existingTask = await findTaskById(taskId);
      
      if (!existingTask) {
        console.error('🗑️ API: Task not found with id:', taskId);
        return false;
      }
      
      console.log('🗑️ API: Found task with real id:', existingTask.id, typeof existingTask.id);
      
      // Paso 2: Usar el ID REAL de la tarea encontrada
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
  // Agregar al final del objeto api en api.js:

// ⭐ OBTENER TODAS LAS TAREAS (SOLO ADMIN)
getAllTasksAdmin: async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const allTasks = await response.json();
    console.log('📋 Admin: Loaded all tasks:', allTasks.length);
    return allTasks;
  } catch (error) {
    console.error('Error getting all tasks for admin:', error);
    return [];
  }
},

  
};