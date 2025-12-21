// src/store/tasksStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../service/apis'; // ⚠️ Asegúrate que la ruta es correcta

export const useTasksStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      userType: 'frontend',
      availableTypes: ['frontend', 'backend', 'fullstack', 'designer', 'devops'],
      lastFetchedAt: null,
      hasNewTasks: false,
      isLoading: false,

      // ⭐ FETCH TASKS
      fetchTasks: async () => {
        set({ isLoading: true });
        const userType = get().userType;

        try {
          const [available, inProgress, completed, rejected, pending_review] = await Promise.all([
            api.getTasks(userType, 'available'),
            api.getTasks(userType, 'in_progress'),
            api.getTasks(userType, 'completed'),
            api.getTasks(userType, 'rejected'),
            api.getTasks(userType, 'pending_review'),
          ]);

          const allTasks = [...available, ...inProgress, ...completed, ...rejected,...pending_review];

          set({
            tasks: allTasks,
            lastFetchedAt: new Date().toISOString(),
            hasNewTasks: false,
            isLoading: false
          });

          return allTasks;
        } catch (error) {
          console.error('Error fetching tasks:', error);
          set({ isLoading: false });
          return [];
        }
      },

      setUserType: (type) => set({ userType: type }),
      notifyNewTasks: () => set({ hasNewTasks: true }),

      // ⭐ ACCEPT TASK - Usar la API actualizada
      acceptTask: async (taskId, userId) => {
        try {
          console.log('✅ Store: Accepting task', taskId, 'for user', userId);

          const updated = await api.updateTask(taskId, {
            status: 'in_progress',
            assignedTo: userId,
            acceptedAt: new Date().toISOString()
          });

          if (updated) {
            console.log('✅ Store: Task accepted successfully', updated);

            // Actualizar en el store local
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id == taskId ? { ...t, ...updated } : t  // Usar == para comparación flexible
              )
            }));

            return true;
          } else {
            console.error('✅ Store: Task accept returned null');
          }
        } catch (error) {
          console.error('✅ Store: Error accepting task:', error);
        }
        return false;
      },

      // ⭐ UPDATE TASK (para admin - EDITAR)
      updateTask: async (taskId, taskData) => {
        try {
          console.log('🔄 Store: Updating task', taskId, taskData);

          const updatedTask = await api.updateTask(taskId, taskData);

          if (updatedTask) {
            console.log('🔄 Store: Task updated successfully', updatedTask);

            // Actualizar en el store local
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id == taskId ? { ...t, ...updatedTask } : t  // Usar ==
              )
            }));

            return updatedTask;
          }
        } catch (error) {
          console.error('🔄 Store: Error updating task:', error);
        }
        return null;
      },

      // ⭐ DELETE TASK (para admin - ELIMINAR)
      deleteTask: async (taskId) => {
        try {
          console.log('🗑️ Store: Deleting task', taskId);

          const success = await api.deleteTask(taskId);

          if (success) {
            console.log('🗑️ Store: Task deleted successfully');

            // Eliminar del store local
            set(state => ({
              tasks: state.tasks.filter(t => t.id != taskId)  // Usar !=
            }));

            return true;
          }
        } catch (error) {
          console.error('🗑️ Store: Error deleting task:', error);
        }
        return false;
      },

      // ⭐ CREATE TASK (para admin - CREAR) - Usar IDs string
      createTask: async (taskData) => {
        try {
          console.log('➕ Store: Creating task', taskData);

          // Generar ID como string
          const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          const newTask = await api.createTask({
            ...taskData,
            id: taskId, // ✅ ID como string
            status: 'available',
            createdAt: new Date().toISOString(),
            assignedTo: null,
            acceptedAt: null,
            submittedAt: null,
            completedAt: null,
            reviewedAt: null,
            reviewedBy: null,
            reviewNotes: null,
            submissionNotes: null,
            submissionFiles: [],
            images: []
          });

          if (newTask) {
            console.log('➕ Store: Task created successfully', newTask);

            // Agregar al store local
            set(state => ({
              tasks: [newTask, ...state.tasks],
              hasNewTasks: true
            }));

            return newTask;
          }
        } catch (error) {
          console.error('➕ Store: Error creating task:', error);
        }
        return null;
      },

      // ⭐ GET ALL TASKS (para admin)
      getAllTasks: async () => {
        try {
          console.log('📋 Store: Getting all tasks (admin)');

          const tasks = await api.getTasks(null);

          console.log('📋 Store: Retrieved', tasks.length, 'tasks');

          // Actualizar el store también
          set({ tasks });

          return tasks;
        } catch (error) {
          console.error('📋 Store: Error getting all tasks:', error);
          return [];
        }
      },

      // ⭐ ... resto de tus funciones existentes ...
      submitTask: async (taskId, submissionData) => {
        try {
          const updated = await api.updateTask(taskId, {
            status: 'pending_review',
            submittedAt: new Date().toISOString(),
            submissionNotes: submissionData.notes,
            submissionFiles: submissionData.files || []
          });

          if (updated) {
            // Actualizar store local
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id == taskId ? { ...t, ...updated } : t
              )
            }));
            return true;
          }
        } catch (error) {
          console.error('Error submitting task:', error);
        }
        return false;
      },

      // ⭐ Función auxiliar para obtener tareas por status
      fetchTasksByStatus: async (status) => {
        try {
          const tasks = await api.getTasks(null, status);
          return tasks;
        } catch (error) {
          console.error('Error fetching tasks by status:', error);
          return [];
        }
      },

      getAllUserTasks: async (userId, status = null) => {
        try {
          const allTasks = await api.getTasks(null);

          // Filtrar por usuario y status
          return allTasks.filter(task => {
            const matchesUser = task.assignedTo === userId ||
              (status === 'available' && !task.assignedTo);
            const matchesStatus = !status || task.status === status;
            return matchesUser && matchesStatus;
          });
        } catch (error) {
          console.error('Error getting user tasks:', error);
          return [];
        }
      },
      // En tu tasksStore.js
      approveTask: async (taskId, adminId) => {
        try {
          const updated = await api.updateTask(taskId, {
            status: 'completed',
            reviewStatus: 'approved',
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId,
            completedAt: new Date().toISOString()
          });

          if (updated) {
            // Actualizar localmente
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id === taskId ? { ...t, ...updated } : t
              )
            }));
            return true;
          }
        } catch (error) {
          console.error('Error approving task:', error);
        }
        return false;
      },

      rejectTask: async (taskId, adminId, reason) => {
        try {
          const task = get().tasks.find(t => t.id === taskId);
          const updated = await api.updateTask(taskId, {
            status: 'rejected',
            reviewStatus: 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId,
            reviewNotes: `Rechazado: ${reason}`,
            rejectionReasons: [...(task?.rejectionReasons || []), reason],
            revisionCount: (task?.revisionCount || 0) + 1
          });

          if (updated) {
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id === taskId ? { ...t, ...updated } : t
              )
            }));
            return true;
          }
        } catch (error) {
          console.error('Error rejecting task:', error);
        }
        return false;
      },

      reopenTask: async (taskId) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('userSession'));
    const task = get().tasks.find(t => t.id === taskId);
    
    const updated = await api.updateTask(taskId, {
      status: 'in_progress', // ⭐ Cambiar a 'in_progress'
      reviewStatus: null,     // ⭐ Limpiar estado de revisión
      reviewNotes: null,      // ⭐ Limpiar comentarios anteriores
      submittedAt: null,      // ⭐ Limpiar fecha de envío
      reviewedAt: null,       // ⭐ Limpiar fecha de revisión
      reviewedBy: null,       // ⭐ Limpiar revisor
      completedAt: null,      // ⭐ Limpiar fecha de completado
      revisionCount: (task?.revisionCount || 0) + 1,
      // Mantener la asignación al mismo usuario
      assignedTo: task?.assignedTo || currentUser?.id
    });

    if (updated) {
      set(state => ({
        tasks: state.tasks.map(t => 
          t.id === taskId ? { ...t, ...updated } : t
        )
      }));
      return true;
    }
  } catch (error) {
    console.error('Error reopening task:', error);
  }
  return false;
},

    }),
    {
      name: 'tasks-storage'
    }
  )
);