// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ⭐ USAR /api EN LUGAR DE localhost:3001
const API_BASE = '/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ==================== ESTADO EXISTENTE ====================
      currentUser: null,
      isAuthenticated: false,

      // ==================== LOGIN (MODIFICADO PARA TRAER TODO) ====================
      login: async (username, password) => {
        try {
          console.log('🌐 Intentando login en:', `${API_BASE}/users`);
          
          const response = await fetch(
            `${API_BASE}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const users = await response.json();
          console.log('📦 Usuarios encontrados:', users.length);

          if (users.length > 0) {
            const user = users[0];
            
            // ⭐ CREAR SESIÓN CON TODOS LOS DATOS
            const userSession = {
              ...user, // <- Incluye TODA la gamificación, skills, etc.
              isLoggedIn: true,
              loginTime: new Date().toISOString()
            };

            set({ currentUser: userSession, isAuthenticated: true });
            localStorage.setItem('userSession', JSON.stringify(userSession));
            
            // ⭐ LOG DE DATOS CARGADOS
            console.log('✅ Login exitoso:', user.username);
            console.log('📊 Datos de gamificación cargados:', {
              level: user.gamification?.level,
              xp: user.gamification?.currentXP,
              achievements: user.gamification?.achievements?.unlocked?.length || 0,
              skills: user.skills?.length || 0,
              streak: user.gamification?.stats?.streaks?.current || 0
            });
            
            return { success: true, user: userSession };
          }

          return { success: false, error: 'Usuario o contraseña incorrectos' };
        } catch (error) {
          console.error('❌ Error en login:', error);
          
          let errorMessage = 'Error de autenticación';
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'No se puede conectar al servidor. Verifica que json-server esté corriendo.';
          } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Error de red. Verifica tu conexión.';
          }
          
          return { success: false, error: errorMessage };
        }
      },

      // ==================== LOGOUT (SIN CAMBIOS) ====================
      logout: () => {
        console.log('🔒 Cerrando sesión...');
        set({ currentUser: null, isAuthenticated: false });
        
        const keysToRemove = ['userSession', 'auth-storage'];
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          console.log(`  ✓ Removido: ${key}`);
        });
        
        console.log('✅ Sesión cerrada completamente');
      },

      // ==================== RESTORE SESSION (SIN CAMBIOS) ====================
      restoreSession: () => {
        const session = localStorage.getItem('userSession');
        if (session) {
          try {
            const userData = JSON.parse(session);
            if (userData.isLoggedIn) {
              set({ currentUser: userData, isAuthenticated: true });
              console.log('✅ Sesión restaurada:', userData.username);
              return userData;
            }
          } catch (error) {
            console.error('❌ Error al restaurar sesión:', error);
          }
        }
        return null;
      },

      // ==================== GET CURRENT USER (SIN CAMBIOS) ====================
      getCurrentUser: () => get().currentUser,

      // ==================== NUEVAS FUNCIONES DE GAMIFICACIÓN ====================

      // 🔄 ACTUALIZAR USUARIO EN EL BACKEND Y LOCALMENTE
      updateUser: async (userId, userData) => {
        try {
          console.log('🔄 Actualizando usuario:', userId);
          
          const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const updatedUser = await response.json();
          
          // ⭐ Actualizar en el store Y en localStorage
          const userSession = {
            ...updatedUser,
            isLoggedIn: true,
            loginTime: get().currentUser.loginTime
          };

          set({ currentUser: userSession });
          localStorage.setItem('userSession', JSON.stringify(userSession));
          
          console.log('✅ Usuario actualizado');
          return updatedUser;
          
        } catch (error) {
          console.error('❌ Error actualizando usuario:', error);
          return null;
        }
      },

      // ⚡ AGREGAR XP
      addXP: async (xpAmount, source = 'task') => {
        const currentUser = get().currentUser;
        if (!currentUser) return { success: false };

        const currentXP = currentUser.gamification.currentXP + xpAmount;
        const totalXP = currentUser.gamification.totalXP + xpAmount;
        
        // Verificar si sube de nivel
        let newLevel = currentUser.gamification.level;
        let xpForNextLevel = currentUser.gamification.xpToNextLevel;
        let leveledUp = false;

        if (currentXP >= xpForNextLevel) {
          newLevel++;
          leveledUp = true;
          xpForNextLevel = Math.floor(xpForNextLevel * 1.5); // Progresión
        }

        const updatedGamification = {
          ...currentUser.gamification,
          currentXP: leveledUp ? currentXP - currentUser.gamification.xpToNextLevel : currentXP,
          totalXP: totalXP,
          level: newLevel,
          xpToNextLevel: xpForNextLevel
        };

        const result = await get().updateUser(currentUser.id, {
          gamification: updatedGamification
        });
        
        if (result && leveledUp) {
          console.log('🎉 ¡SUBISTE DE NIVEL!', newLevel);
          return { 
            success: true, 
            leveledUp: true, 
            newLevel,
            user: result 
          };
        }

        return { success: !!result, leveledUp: false, user: result };
      },

      // 📚 AGREGAR XP A UNA SKILL
      addSkillXP: async (skillId, xpAmount) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { success: false };

        const updatedSkills = currentUser.skills.map(skill => {
          if (skill.id === skillId) {
            const newXP = skill.xp + xpAmount;
            const newLevel = Math.floor(newXP / skill.xpToNextLevel) + 1;
            
            return {
              ...skill,
              xp: newXP,
              level: newLevel > skill.level ? newLevel : skill.level,
              lastUsed: new Date().toISOString()
            };
          }
          return skill;
        });

        const result = await get().updateUser(currentUser.id, {
          skills: updatedSkills
        });

        return { success: !!result, user: result };
      },

      // 🏆 DESBLOQUEAR LOGRO
      unlockAchievement: async (achievementId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { success: false };

        // Verificar si ya lo tiene
        const alreadyUnlocked = currentUser.gamification.achievements.unlocked
          .find(a => a.achievementId === achievementId);

        if (alreadyUnlocked) {
          console.log('⚠️ Logro ya desbloqueado:', achievementId);
          return { success: false, alreadyUnlocked: true };
        }

        const newAchievement = {
          achievementId,
          unlockedAt: new Date().toISOString(),
          progress: 1,
          maxProgress: 1
        };

        const updatedAchievements = {
          ...currentUser.gamification.achievements,
          unlocked: [
            ...currentUser.gamification.achievements.unlocked,
            newAchievement
          ]
        };

        const result = await get().updateUser(currentUser.id, {
          gamification: {
            ...currentUser.gamification,
            achievements: updatedAchievements
          }
        });
        
        if (result) {
          console.log('🏆 ¡LOGRO DESBLOQUEADO!', achievementId);
          return { 
            success: true, 
            achievement: newAchievement,
            user: result 
          };
        }

        return { success: false };
      },

      // 📊 ACTUALIZAR ESTADÍSTICAS
      updateStats: async (statsUpdate) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { success: false };

        const updatedStats = {
          ...currentUser.gamification.stats,
          ...statsUpdate
        };

        const result = await get().updateUser(currentUser.id, {
          gamification: {
            ...currentUser.gamification,
            stats: updatedStats
          }
        });

        return { success: !!result, user: result };
      },

      // 🔥 ACTUALIZAR RACHA
      updateStreak: async () => {
        const currentUser = get().currentUser;
        if (!currentUser) return { success: false };

        const today = new Date().toISOString().split('T')[0];
        const lastActive = currentUser.gamification.stats.streaks.lastActiveDate;

        let currentStreak = currentUser.gamification.stats.streaks.current;
        let longestStreak = currentUser.gamification.stats.streaks.longest;

        if (lastActive) {
          const lastDate = new Date(lastActive);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
            if (currentStreak > longestStreak) {
              longestStreak = currentStreak;
            }
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
          longestStreak = 1;
        }

        const updatedStreaks = {
          current: currentStreak,
          longest: longestStreak,
          totalActiveDays: currentUser.gamification.stats.streaks.totalActiveDays + 1,
          lastActiveDate: today
        };

        const result = await get().updateUser(currentUser.id, {
          gamification: {
            ...currentUser.gamification,
            stats: {
              ...currentUser.gamification.stats,
              streaks: updatedStreaks
            }
          }
        });
        
        if (result) {
          console.log('🔥 Racha actualizada:', currentStreak, 'días');
          return { 
            success: true, 
            currentStreak,
            user: result 
          };
        }

        return { success: false };
      },

      // ==================== GETTERS DE GAMIFICACIÓN ====================

      // 📊 Obtener stats de gamificación
      getGamificationStats: () => {
        const user = get().currentUser;
        if (!user?.gamification) return null;

        return {
          level: user.gamification.level,
          currentXP: user.gamification.currentXP,
          totalXP: user.gamification.totalXP,
          xpToNextLevel: user.gamification.xpToNextLevel,
          rank: user.gamification.rank,
          rankIcon: user.gamification.rankIcon,
          rankProgress: Math.floor((user.gamification.currentXP / user.gamification.xpToNextLevel) * 100)
        };
      },

      // 🏆 Obtener logros
      getAchievements: () => {
        const user = get().currentUser;
        if (!user?.gamification?.achievements) return { unlocked: [], inProgress: [] };
        return user.gamification.achievements;
      },

      // 📚 Obtener skills
      getSkills: () => {
        const user = get().currentUser;
        if (!user?.skills) return [];
        return user.skills;
      },

      // 🔥 Obtener racha actual
      getCurrentStreak: () => {
        const user = get().currentUser;
        if (!user?.gamification?.stats?.streaks) return 0;
        return user.gamification.stats.streaks.current;
      }
    }),
    {
      name: 'auth-storage',
      // Solo persistir lo esencial
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);