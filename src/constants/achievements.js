// src/constants/achievements.js

export const ACHIEVEMENTS_CONFIG = {
  // ==================== LOGROS DE TAREAS ====================
  first_task_accepted: {
    id: 'ach_first_task',
    title: 'Primera Misión',
    description: 'Acepta tu primera tarea',
    icon: '🎯',
    category: 'milestone',
    rarity: 'common',
    xpReward: 50,
    trigger: 'TASK_ACCEPTED',
    condition: (stats) => stats.tasksAccepted >= 1,
    once: true
  },

  first_task_completed: {
    id: 'ach_first_complete',
    title: 'Primer Éxito',
    description: 'Completa tu primera tarea',
    icon: '✅',
    category: 'milestone',
    rarity: 'common',
    xpReward: 100,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.tasksCompleted >= 1,
    once: true
  },

  task_master_10: {
    id: 'ach_10_tasks',
    title: 'Trabajador Consistente',
    description: 'Completa 10 tareas',
    icon: '💪',
    category: 'milestone',
    rarity: 'rare',
    xpReward: 250,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.tasksCompleted >= 10,
    once: true
  },

  task_master_50: {
    id: 'ach_50_tasks',
    title: 'Maestro de Tareas',
    description: 'Completa 50 tareas',
    icon: '🏆',
    category: 'milestone',
    rarity: 'epic',
    xpReward: 500,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.tasksCompleted >= 50,
    once: true
  },

  task_master_100: {
    id: 'ach_100_tasks',
    title: 'Centurión',
    description: 'Completa 100 tareas',
    icon: '👑',
    category: 'milestone',
    rarity: 'legendary',
    xpReward: 1000,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.tasksCompleted >= 100,
    once: true
  },

  speed_demon: {
    id: 'ach_speed',
    title: 'Rayo Veloz',
    description: 'Completa una tarea en menos de 2 horas',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    xpReward: 300,
    trigger: 'TASK_COMPLETED',
    condition: (stats, taskData) => {
      if (!taskData?.acceptedAt || !taskData?.completedAt) return false;
      const timeDiff = new Date(taskData.completedAt) - new Date(taskData.acceptedAt);
      const hours = timeDiff / (1000 * 60 * 60);
      return hours < 2;
    },
    once: false // Puede desbloquearse múltiples veces
  },

  // ==================== LOGROS DE NIVEL ====================
  level_5: {
    id: 'ach_lvl_5',
    title: 'Aprendiz',
    description: 'Alcanza el nivel 5',
    icon: '⭐',
    category: 'level',
    rarity: 'common',
    xpReward: 100,
    trigger: 'LEVEL_UP',
    condition: (stats) => stats.level >= 5,
    once: true
  },

  level_10: {
    id: 'ach_lvl_10',
    title: 'Desarrollador',
    description: 'Alcanza el nivel 10',
    icon: '🌟',
    category: 'level',
    rarity: 'rare',
    xpReward: 300,
    trigger: 'LEVEL_UP',
    condition: (stats) => stats.level >= 10,
    once: true
  },

  level_20: {
    id: 'ach_lvl_20',
    title: 'Senior Developer',
    description: 'Alcanza el nivel 20',
    icon: '💎',
    category: 'level',
    rarity: 'legendary',
    xpReward: 1000,
    trigger: 'LEVEL_UP',
    condition: (stats) => stats.level >= 20,
    once: true
  },

  // ==================== LOGROS DE RACHA ====================
  streak_3: {
    id: 'ach_streak_3',
    title: 'Comenzando Fuerte',
    description: '3 días consecutivos',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 150,
    trigger: 'STREAK_UPDATE',
    condition: (stats) => stats.streak >= 3,
    once: true
  },

  streak_7: {
    id: 'ach_streak_7',
    title: 'Semana de Fuego',
    description: '7 días consecutivos',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    xpReward: 300,
    trigger: 'STREAK_UPDATE',
    condition: (stats) => stats.streak >= 7,
    once: true
  },

  streak_30: {
    id: 'ach_streak_30',
    title: 'Racha Legendaria',
    description: '30 días consecutivos',
    icon: '💎',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1500,
    trigger: 'STREAK_UPDATE',
    condition: (stats) => stats.streak >= 30,
    once: true
  },

  // ==================== LOGROS DE GANANCIAS ====================
  first_payment: {
    id: 'ach_first_payment',
    title: 'Primer Pago',
    description: 'Gana tu primer pago',
    icon: '💵',
    category: 'earning',
    rarity: 'common',
    xpReward: 100,
    trigger: 'EARNINGS_UPDATE',
    condition: (stats) => stats.totalEarnings > 0,
    once: true
  },

  earnings_1000: {
    id: 'ach_1k',
    title: 'Primer Millar',
    description: 'Gana $1,000 en total',
    icon: '💰',
    category: 'earning',
    rarity: 'rare',
    xpReward: 500,
    trigger: 'EARNINGS_UPDATE',
    condition: (stats) => stats.totalEarnings >= 1000,
    once: true
  },

  earnings_10000: {
    id: 'ach_10k',
    title: 'Millonario',
    description: 'Gana $10,000 en total',
    icon: '💎',
    category: 'earning',
    rarity: 'legendary',
    xpReward: 1000,
    trigger: 'EARNINGS_UPDATE',
    condition: (stats) => stats.totalEarnings >= 10000,
    once: true
  },

  // ==================== LOGROS DE HABILIDADES ====================
  frontend_master: {
    id: 'ach_frontend_50',
    title: 'Maestro Frontend',
    description: 'Completa 50 tareas de frontend',
    icon: '⚛️',
    category: 'skill',
    rarity: 'legendary',
    xpReward: 1000,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.frontendTasksCompleted >= 50,
    once: true
  },

  backend_master: {
    id: 'ach_backend_50',
    title: 'Maestro Backend',
    description: 'Completa 50 tareas de backend',
    icon: '🟢',
    category: 'skill',
    rarity: 'legendary',
    xpReward: 1000,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.backendTasksCompleted >= 50,
    once: true
  },

  fullstack_legend: {
    id: 'ach_fullstack',
    title: 'Leyenda Full Stack',
    description: 'Completa 25 tareas frontend Y 25 backend',
    icon: '🚀',
    category: 'skill',
    rarity: 'legendary',
    xpReward: 2000,
    trigger: 'TASK_COMPLETED',
    condition: (stats) => stats.frontendTasksCompleted >= 25 && stats.backendTasksCompleted >= 25,
    once: true
  }
};

// Helper para obtener logros por trigger
export const getAchievementsByTrigger = (trigger) => {
  return Object.values(ACHIEVEMENTS_CONFIG).filter(ach => ach.trigger === trigger);
};

// Helper para verificar si un logro ya fue desbloqueado
export const isAchievementUnlocked = (achievementId, unlockedAchievements) => {
  return unlockedAchievements.some(ach => ach.id === achievementId);
};