// src/hooks/useGamification.js
import { useAuthStore } from '../store/authStore';
import api from '../service/apis';

// ⭐ Hook principal de gamificación
export const useGamification = () => {
  // Usar 'currentUser' en lugar de 'user' (tu nomenclatura)
  const currentUser = useAuthStore(state => state.currentUser);
  const addXP = useAuthStore(state => state.addXP);
  const addSkillXP = useAuthStore(state => state.addSkillXP);
  const unlockAchievement = useAuthStore(state => state.unlockAchievement);
  const updateStats = useAuthStore(state => state.updateStats);
  const updateStreak = useAuthStore(state => state.updateStreak);
  const getGamificationStats = useAuthStore(state => state.getGamificationStats);

  // 🎮 Completar una tarea (procesa todo el sistema de gamificación)
  const completeTask = async (task, actualHours, rating = 5) => {
    if (!currentUser) return { success: false, error: 'Usuario no autenticado' };

    try {
      console.log('🎮 Processing task completion:', task.title);

      const results = {
        xpGained: 0,
        skillXPGained: {},
        achievementsUnlocked: [],
        leveledUp: false,
        newLevel: null,
        streakUpdated: false,
        currentStreak: 0
      };

      // 1️⃣ GANAR XP BASE DE LA TAREA
      const baseXP = task.rewards?.xp || task.xp || 0;
      let totalXP = baseXP;

      // Bonos condicionales
      if (task.rewards?.bonusConditions) {
        // Bonus por completar antes de tiempo
        if (task.rewards.bonusConditions.earlyCompletion && actualHours < task.estimatedHours) {
          totalXP += task.rewards.bonusConditions.earlyCompletion;
        }
        
        // Bonus por calificación perfecta
        if (task.rewards.bonusConditions.perfectRating && rating === 5) {
          totalXP += task.rewards.bonusConditions.perfectRating;
        }
        
        // Bonus por no tener revisiones
        if (task.rewards.bonusConditions.noRevisions && task.revisionCount === 0) {
          totalXP += task.rewards.bonusConditions.noRevisions;
        }
      }

      const xpResult = await addXP(totalXP, 'task');
      results.xpGained = totalXP;
      results.leveledUp = xpResult.leveledUp;
      results.newLevel = xpResult.newLevel;

      console.log('✅ XP añadido:', totalXP);

      // 2️⃣ AGREGAR XP A SKILLS ESPECÍFICAS
      if (task.gamification?.skillXP) {
        for (const [skillId, xp] of Object.entries(task.gamification.skillXP)) {
          await addSkillXP(skillId, xp);
          results.skillXPGained[skillId] = xp;
          console.log('📚 Skill XP añadido:', skillId, '+', xp);
        }
      }

      // 3️⃣ VERIFICAR Y DESBLOQUEAR LOGROS
      if (task.gamification?.achievementTriggers) {
        const achievements = await api.getAchievements();
        
        for (const achievementId of task.gamification.achievementTriggers) {
          const achievement = achievements.find(a => a.id === achievementId);
          
          if (achievement) {
            const shouldUnlock = await checkAchievementCondition(achievement, currentUser);
            
            if (shouldUnlock) {
              const unlockResult = await unlockAchievement(achievementId);
              
              if (unlockResult.success && !unlockResult.alreadyUnlocked) {
                results.achievementsUnlocked.push(achievementId);
                
                // Dar XP del logro
                if (achievement.xpReward) {
                  await addXP(achievement.xpReward, 'achievement');
                  results.xpGained += achievement.xpReward;
                }
                
                console.log('🏆 Logro desbloqueado:', achievementId);
              }
            }
          }
        }
      }

      // 4️⃣ ACTUALIZAR ESTADÍSTICAS
      const newStats = {
        tasksCompleted: currentUser.gamification.stats.tasksCompleted + 1,
        totalEarnings: currentUser.gamification.stats.totalEarnings + (task.rewards?.totalReward || task.reward || 0),
        totalHoursWorked: currentUser.gamification.stats.totalHoursWorked + actualHours,
        averageRating: calculateNewAverage(
          currentUser.gamification.stats.averageRating,
          currentUser.gamification.stats.tasksCompleted,
          rating
        )
      };

      // Actualizar stats de calidad
      if (rating === 5 && task.revisionCount === 0) {
        newStats.perfectRatings = currentUser.gamification.stats.perfectRatings + 1;
      }

      // Actualizar stats de velocidad
      if (actualHours < 2) {
        newStats.speed = {
          ...currentUser.gamification.stats.speed,
          tasksCompletedUnder2Hours: currentUser.gamification.stats.speed.tasksCompletedUnder2Hours + 1
        };
      }

      if (!currentUser.gamification.stats.speed.fastestTask || actualHours < currentUser.gamification.stats.speed.fastestTask) {
        newStats.speed = {
          ...currentUser.gamification.stats.speed,
          fastestTask: actualHours
        };
      }

      await updateStats(newStats);
      console.log('📊 Estadísticas actualizadas');

      // 5️⃣ ACTUALIZAR RACHA
      const streakResult = await updateStreak();
      results.streakUpdated = streakResult.success;
      results.currentStreak = streakResult.currentStreak;

      console.log('🔥 Racha:', results.currentStreak, 'días');

      // 6️⃣ CREAR LOG DE ACTIVIDAD
      await api.createActivityLog({
        userId: currentUser.id,
        type: 'task_completed',
        taskId: task.id,
        details: {
          xpGained: results.xpGained,
          rewardEarned: task.rewards?.totalReward || task.reward,
          achievementsUnlocked: results.achievementsUnlocked,
          skillXPGained: results.skillXPGained,
          rating,
          actualHours
        }
      });

      console.log('✅ Tarea completada y gamificación procesada');

      return {
        success: true,
        ...results
      };

    } catch (error) {
      console.error('❌ Error procesando completado de tarea:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  return {
    currentUser,
    completeTask,
    addXP,
    addSkillXP,
    unlockAchievement,
    updateStats,
    updateStreak,
    getGamificationStats
  };
};

// ⭐ Hook para stats de gamificación
export const useGamificationStats = () => {
  const getGamificationStats = useAuthStore(state => state.getGamificationStats);
  return getGamificationStats();
};

// ⭐ Hook para logros
export const useAchievements = () => {
  const getAchievements = useAuthStore(state => state.getAchievements);
  return getAchievements();
};

// ⭐ Hook para skills
export const useSkills = () => {
  const getSkills = useAuthStore(state => state.getSkills);
  return getSkills();
};

// ⭐ Hook para racha actual
export const useStreak = () => {
  const getCurrentStreak = useAuthStore(state => state.getCurrentStreak);
  return getCurrentStreak();
};

// ============ FUNCIONES AUXILIARES ============

// Verificar si un logro debe desbloquearse
const checkAchievementCondition = async (achievement, user) => {
  const { requirements } = achievement;

  switch (requirements.type) {
    case 'tasks_completed':
      return user.gamification.stats.tasksCompleted >= requirements.value;

    case 'tasks_by_type':
      return true; // Simplificado - aquí deberías contar del activityLog

    case 'consecutive_days':
      return user.gamification.stats.streaks.current >= requirements.value;

    case 'task_completion_time':
      return true;

    case 'perfect_tasks':
      return user.gamification.stats.perfectRatings >= requirements.value;

    case 'total_earnings':
      return user.gamification.stats.totalEarnings >= requirements.value;

    case 'level_reached':
      return user.gamification.level >= requirements.value;

    default:
      return false;
  }
};

// Calcular nuevo promedio
const calculateNewAverage = (currentAverage, currentCount, newValue) => {
  return ((currentAverage * currentCount) + newValue) / (currentCount + 1);
};