// src/store/tasksStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../service/apis';
import { useAuthStore } from './authStore';

// ⭐ Configuración de API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ⭐ Funciones auxiliares para cálculos
const calculateXPForNextLevel = (level) => {
  // Fórmula exponencial: nivel * 1000
  return level * 1000;
};

const calculateSkillXPForNextLevel = (level) => {
  // Fórmula: nivel * 500
  return level * 500;
};

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

          const allTasks = [...available, ...inProgress, ...completed, ...rejected, ...pending_review];

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

      // ⭐ ACCEPT TASK
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

            set(state => ({
              tasks: state.tasks.map(t =>
                t.id == taskId ? { ...t, ...updated } : t
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

            set(state => ({
              tasks: state.tasks.map(t =>
                t.id == taskId ? { ...t, ...updatedTask } : t
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

            set(state => ({
              tasks: state.tasks.filter(t => t.id != taskId)
            }));

            return true;
          }
        } catch (error) {
          console.error('🗑️ Store: Error deleting task:', error);
        }
        return false;
      },

      // ⭐ CREATE TASK (para admin - CREAR)
      createTask: async (taskData) => {
        try {
          console.log('➕ Store: Creating task', taskData);

          const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          const newTask = await api.createTask({
            ...taskData,
            id: taskId,
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

          set({ tasks });

          return tasks;
        } catch (error) {
          console.error('📋 Store: Error getting all tasks:', error);
          return [];
        }
      },

      // ⭐ SUBMIT TASK
      submitTask: async (taskId, submissionData) => {
        try {
          const updated = await api.updateTask(taskId, {
            status: 'pending_review',
            submittedAt: new Date().toISOString(),
            submissionNotes: submissionData.notes,
            submissionFiles: submissionData.files || []
          });

          if (updated) {
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

      // ⭐ APPROVE TASK - CON GAMIFICACIÓN COMPLETA
      approveTask: async (taskId, adminId) => {
        try {
          console.log('✅ Aprobando tarea:', taskId);
          
          // 1️⃣ Obtener la tarea
          const task = get().tasks.find(t => t.id === taskId);
          if (!task) {
            console.error('❌ Tarea no encontrada');
            return false;
          }

          // 2️⃣ Obtener el usuario asignado
          const userId = task.assignedTo;
          if (!userId) {
            console.error('❌ Tarea no tiene usuario asignado');
            return false;
          }

          console.log('👤 Usuario asignado:', userId);
          console.log('💰 Recompensas:', task.rewards || { xp: task.xp, reward: task.reward });

          // 3️⃣ Obtener datos del usuario
          const userResponse = await fetch(`${API_URL}/users/${userId}`);
          const user = await userResponse.json();
          
          if (!user) {
            console.error('❌ Usuario no encontrado');
            return false;
          }

          console.log('📊 Stats actuales del usuario:', user.gamification.stats);

          // 4️⃣ Calcular recompensas
          const xpGained = task.rewards?.xp || task.xp || 0;
          const moneyEarned = task.rewards?.totalReward || task.reward || 0;
          const actualHours = task.actualHours || task.estimatedHours || 8;

          console.log('🎮 XP a ganar:', xpGained);
          console.log('💵 Dinero a ganar:', moneyEarned);

          // 5️⃣ Calcular nuevo XP y verificar level up
          const newCurrentXP = user.gamification.currentXP + xpGained;
          const newTotalXP = user.gamification.totalXP + xpGained;
          let newLevel = user.gamification.level;
          let xpForNextLevel = user.gamification.xpToNextLevel;
          let finalCurrentXP = newCurrentXP;

          // Verificar si sube de nivel (puede subir múltiples niveles)
          while (finalCurrentXP >= xpForNextLevel) {
            newLevel += 1;
            finalCurrentXP = finalCurrentXP - xpForNextLevel;
            xpForNextLevel = calculateXPForNextLevel(newLevel);
            
            console.log('🎉 ¡LEVEL UP! Nuevo nivel:', newLevel);
          }

          // 6️⃣ Actualizar stats del usuario
          const newTasksCompleted = user.gamification.stats.tasksCompleted + 1;
          const newTotalEarnings = user.gamification.stats.totalEarnings + moneyEarned;
          const newTotalHoursWorked = user.gamification.stats.totalHoursWorked + actualHours;

          // 7️⃣ Actualizar XP de skills
          const updatedSkills = [...user.skills];
          if (task.gamification?.skillXP) {
            for (const [skillId, skillXP] of Object.entries(task.gamification.skillXP)) {
              const skillIndex = updatedSkills.findIndex(s => s.id === skillId);
              if (skillIndex !== -1) {
                const currentSkill = updatedSkills[skillIndex];
                const newSkillXP = currentSkill.xp + skillXP;
                let newSkillLevel = currentSkill.level;
                let skillXPForNext = currentSkill.xpToNextLevel;
                let finalSkillXP = newSkillXP;

                // Verificar level up de skill (puede subir múltiples niveles)
                while (finalSkillXP >= skillXPForNext) {
                  newSkillLevel += 1;
                  finalSkillXP = finalSkillXP - skillXPForNext;
                  skillXPForNext = calculateSkillXPForNextLevel(newSkillLevel);
                  console.log(`📚 Skill ${skillId} subió a nivel ${newSkillLevel}!`);
                }

                updatedSkills[skillIndex] = {
                  ...currentSkill,
                  level: newSkillLevel,
                  xp: finalSkillXP,
                  xpToNextLevel: skillXPForNext,
                  projectsCompleted: currentSkill.projectsCompleted + 1,
                  hoursWorked: currentSkill.hoursWorked + actualHours,
                  lastUsed: new Date().toISOString()
                };
                
                console.log(`📚 Skill ${skillId} +${skillXP} XP (Nivel ${newSkillLevel})`);
              }
            }
          }

          // 8️⃣ Actualizar racha
          const today = new Date().toISOString().split('T')[0];
          const lastActiveDate = user.gamification.stats.streaks.lastActiveDate;
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          let newStreak = user.gamification.stats.streaks.current;
          let newLongestStreak = user.gamification.stats.streaks.longest;

          if (lastActiveDate === yesterday) {
            // Continúa la racha
            newStreak += 1;
            if (newStreak > newLongestStreak) {
              newLongestStreak = newStreak;
            }
            console.log('🔥 Racha continúa:', newStreak, 'días');
          } else if (lastActiveDate !== today) {
            // Racha nueva o rota
            newStreak = 1;
            console.log('🔥 Nueva racha iniciada');
          }

          // 9️⃣ Preparar datos actualizados del usuario
          const updatedUserData = {
            ...user,
            skills: updatedSkills,
            gamification: {
              ...user.gamification,
              level: newLevel,
              currentXP: finalCurrentXP,
              xpToNextLevel: xpForNextLevel,
              totalXP: newTotalXP,
              stats: {
                ...user.gamification.stats,
                tasksCompleted: newTasksCompleted,
                totalEarnings: newTotalEarnings,
                totalHoursWorked: newTotalHoursWorked,
                streaks: {
                  current: newStreak,
                  longest: newLongestStreak,
                  totalActiveDays: user.gamification.stats.streaks.totalActiveDays + 1,
                  lastActiveDate: today
                }
              }
            },
            activity: {
              ...user.activity,
              lastTaskCompleted: new Date().toISOString(),
              calendar: [
                ...(user.activity.calendar || []),
                {
                  date: today,
                  tasksCompleted: 1,
                  hoursWorked: actualHours,
                  xpEarned: xpGained,
                  earningsDay: moneyEarned
                }
              ]
            }
          };

          // 🔟 Actualizar usuario en el backend
          const userUpdateResponse = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
          });

          if (!userUpdateResponse.ok) {
            console.error('❌ Error actualizando usuario');
            return false;
          }

          console.log('✅ Usuario actualizado correctamente');

          // 1️⃣1️⃣ Actualizar la tarea
          const updatedTask = await api.updateTask(taskId, {
            status: 'completed',
            reviewStatus: 'approved',
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId,
            completedAt: new Date().toISOString()
          });

          if (updatedTask) {
            console.log('✅ Tarea aprobada correctamente');
            
            // Actualizar store local de tareas
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id === taskId ? { ...t, ...updatedTask } : t
              )
            }));

            // 1️⃣2️⃣ Actualizar el usuario en el authStore si es el usuario actual
            const currentUser = useAuthStore.getState().currentUser;
            if (currentUser?.id === userId) {
              useAuthStore.getState().setCurrentUser(updatedUserData);
              console.log('🔄 AuthStore actualizado');
            }

            // 1️⃣3️⃣ Mostrar resumen
            console.log('🎊 RESUMEN DE GAMIFICACIÓN:');
            console.log(`   💎 XP ganado: +${xpGained}`);
            console.log(`   💰 Dinero ganado: $${moneyEarned}`);
            console.log(`   ⭐ Nivel: ${user.gamification.level} → ${newLevel}`);
            console.log(`   🔥 Racha: ${newStreak} días`);
            if (task.gamification?.skillXP) {
              console.log(`   📚 Skills actualizadas: ${Object.keys(task.gamification.skillXP).length}`);
            }

            return true;
          }

        } catch (error) {
          console.error('❌ Error aprobando tarea:', error);
        }
        return false;
      },

      // ⭐ REJECT TASK
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

      // ⭐ REOPEN TASK
      reopenTask: async (taskId) => {
        try {
          const currentUser = JSON.parse(localStorage.getItem('userSession'));
          const task = get().tasks.find(t => t.id === taskId);
          
          const updated = await api.updateTask(taskId, {
            status: 'in_progress',
            reviewStatus: null,
            reviewNotes: null,
            submittedAt: null,
            reviewedAt: null,
            reviewedBy: null,
            completedAt: null,
            revisionCount: (task?.revisionCount || 0) + 1,
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

      // ⭐ GET ALL USER TASKS
      getAllUserTasks: async (userId, status = null) => {
        try {
          const allTasks = await api.getTasks(null);

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

    }),
    {
      name: 'tasks-storage'
    }
  )
);
