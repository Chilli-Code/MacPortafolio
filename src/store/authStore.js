// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ API BASE AL SERVIDOR BACKEND EN PUERTO 3001
const API_BASE = 'http://localhost:3001/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ==================== ESTADO EXISTENTE ====================
      currentUser: null,
      isAuthenticated: false,

      // ==================== LOGIN SEGURO ====================
      login: async (username, password) => {
        try {
          console.log('🌐 Intentando login seguro en:', `${API_BASE}/login`);
          
          const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }
          
          const result = await response.json();

          if (result.success) {
            const user = result.user;
            
            // ⭐ CREAR SESIÓN CON TODOS LOS DATOS
            const userSession = {
              ...user, // <- Incluye TODA la gamificación, skills, etc.
              isLoggedIn: true,
              loginTime: new Date().toISOString()
            };

            set({ currentUser: userSession, isAuthenticated: true });
            localStorage.setItem('userSession', JSON.stringify(userSession));
            
            console.log('✅ Login exitoso:', user.username);
            return { success: true, user: userSession };
          }

          return { success: false, error: result.error || 'Usuario o contraseña incorrectos' };
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