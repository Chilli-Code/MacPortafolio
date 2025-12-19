// src/hooks/useAchievements.js

import { useNotificationStore } from '../components/AchievementNotification';

export const useAchievements = () => {
  const { addNotification } = useNotificationStore();

  const showLevelUp = (level, xp) => {
    addNotification({
      type: 'level',
      category: 'Nivel Alcanzado',
      title: `¡Nivel ${level}!`,
      description: `Has alcanzado el nivel ${level}. ¡Sigue así!`,
      xp: xp
    });
  };

  const showTaskComplete = (taskName, xp) => {
    addNotification({
      type: 'task',
      category: 'Tarea Completada',
      title: taskName,
      description: '¡Excelente trabajo! Tarea completada exitosamente.',
      xp: xp
    });
  };

  const showStreak = (days) => {
    addNotification({
      type: 'streak',
      category: 'Racha Activa',
      title: `¡${days} días consecutivos!`,
      description: `Has mantenido tu racha por ${days} días. ¡Impresionante!`,
      xp: days * 10
    });
  };

  const showMilestone = (milestone, progress) => {
    addNotification({
      type: 'milestone',
      category: 'Hito Alcanzado',
      title: milestone.title,
      description: milestone.description,
      progress: progress,
      xp: milestone.xp
    });
  };

  const showSkillUnlocked = (skill) => {
    addNotification({
      type: 'skill',
      category: 'Habilidad Desbloqueada',
      title: `Nueva Habilidad: ${skill.name}`,
      description: skill.description,
      xp: 50
    });
  };

  const showEarningMilestone = (amount) => {
    addNotification({
      type: 'earning',
      category: 'Hito Financiero',
      title: `$${amount.toLocaleString()} ganados`,
      description: '¡Felicidades por alcanzar este hito financiero!',
      xp: Math.floor(amount / 100)
    });
  };

  const showCustom = (notification) => {
    addNotification(notification);
  };

  return {
    showLevelUp,
    showTaskComplete,
    showStreak,
    showMilestone,
    showSkillUnlocked,
    showEarningMilestone,
    showCustom
  };
};