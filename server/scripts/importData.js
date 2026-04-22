import pkg from '../generated/client/index.js';
const { PrismaClient } = pkg;
import { readFile } from 'fs/promises';

const prisma = new PrismaClient();

async function importData() {
  console.log('📥 Iniciando importacion de datos desde db.json...');

  // Leer archivo original
  const rawData = await readFile('../db.json', 'utf8');
  const data = JSON.parse(rawData);

  console.log(`✅ Leidos:
  - ${data.users.length} usuarios
  - ${data.tasks.length} tareas
  - ${data.achievements.length} logros
  - ${data.badges.length} insignias
  - ${data.levels.length} niveles
  - ${data.notifications.length} notificaciones
  - ${data.globalNotifications.length} notificaciones globales
  `);

  // Limpiar base de datos
  console.log('🗑️ Limpiando base de datos...');
  await prisma.activityLog.deleteMany();
  await prisma.leaderboard.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.globalNotification.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.unlockedAchievement.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.level.deleteMany();

  // Importar Niveles
  console.log('📤 Importando niveles...');
  for (const level of data.levels) {
    await prisma.level.create({
      data: {
        level: level.level,
        minXP: level.minXP,
        maxXP: level.maxXP,
        title: level.title,
        icon: level.icon,
      }
    });
  }

  // Importar Logros
  console.log('📤 Importando logros...');
  for (const achievement of data.achievements) {
    await prisma.achievement.create({
      data: {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        detailedDescription: achievement.detailedDescription,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        xpReward: achievement.xpReward,
        coinReward: achievement.coinReward,
        hidden: achievement.hidden,
        secret: achievement.secret,
        requirementType: achievement.requirements.type,
        requirementValue: achievement.requirements.value,
        totalUnlocked: achievement.stats?.totalUnlocked || 0,
      }
    });
  }

  // Importar Insignias
  console.log('📤 Importando insignias...');
  for (const badge of data.badges) {
    await prisma.badge.create({
      data: {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        category: badge.category,
      }
    });
  }

  // Importar Usuarios
  console.log('📤 Importando usuarios...');
  for (const user of data.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        type: user.type,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt),
        bio: user.profile?.bio,
        location: user.profile?.location,
        website: user.profile?.website,
        timezone: user.profile?.timezone,
        languages: user.profile?.languages || [],
        github: user.profile?.socialLinks?.github,
        linkedin: user.profile?.socialLinks?.linkedin,
        twitter: user.profile?.socialLinks?.twitter,
        phone: user.profile?.phone,
        skills: user.skills || [],
        level: user.gamification?.level || 1,
        currentXP: user.gamification?.currentXP || 0,
        xpToNextLevel: user.gamification?.xpToNextLevel || 1000,
        totalXP: user.gamification?.totalXP || 0,
        rank: user.gamification?.rank || "Novato",
        rankIcon: user.gamification?.rankIcon || "🌱",
        rankProgress: user.gamification?.rankProgress || 0,
        tasksCompleted: user.gamification?.stats?.tasksCompleted || 0,
        projectsCompleted: user.gamification?.stats?.projectsCompleted || 0,
        totalEarnings: user.gamification?.stats?.totalEarnings || 0,
        totalHoursWorked: user.gamification?.stats?.totalHoursWorked || 0,
        averageTaskTime: user.gamification?.stats?.averageTaskTime || 0,
        averageRating: user.gamification?.stats?.averageRating || 0,
        perfectRatings: user.gamification?.stats?.perfectRatings || 0,
        currentStreak: user.gamification?.stats?.streaks?.current || 0,
        longestStreak: user.gamification?.stats?.streaks?.longest || 0,
        totalActiveDays: user.gamification?.stats?.streaks?.totalActiveDays || 0,
        lastActiveDate: user.gamification?.stats?.streaks?.lastActiveDate ? new Date(user.gamification.stats.streaks.lastActiveDate) : null,
        theme: user.preferences?.theme || "dark",
        language: user.preferences?.language || "es",
      }
    });
  }

  // Importar Tareas
  console.log('📤 Importando tareas...');
  for (const task of data.tasks) {
    await prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        detailedDescription: task.detailedDescription,
        type: task.type,
        category: task.category,
        difficulty: task.difficulty,
        priority: task.priority || "medium",
        estimatedHours: task.estimatedHours,
        deadline: task.deadline ? new Date(task.deadline) : null,
        xp: task.rewards?.xp || task.xp || 0,
        baseReward: task.rewards?.baseReward || task.reward || 0,
        bonusReward: task.rewards?.bonusReward || 0,
        totalReward: task.rewards?.totalReward || task.reward || 0,
        status: task.status,
        tags: task.tags || [],
        images: task.images || [],
        assignedTo: task.assignedTo,
        assignedAt: task.assignedAt ? new Date(task.assignedAt) : null,
        acceptedAt: task.acceptedAt ? new Date(task.acceptedAt) : null,
        submittedAt: task.submittedAt ? new Date(task.submittedAt) : null,
        submissionNotes: task.submissionNotes,
        submissionFiles: task.submissionFiles || [],
        reviewedAt: task.reviewedAt ? new Date(task.reviewedAt) : null,
        reviewedBy: task.reviewedBy,
        reviewNotes: task.reviewNotes,
        reviewStatus: task.reviewStatus,
        rating: task.rating,
        completedAt: task.completedAt ? new Date(task.completedAt) : null,
        actualHours: task.actualHours,
        rejectionReasons: task.rejectionReasons || [],
        revisionCount: task.revisionCount || 0,
        createdAt: new Date(task.createdAt),
        createdBy: task.createdBy,
        updatedAt: new Date(task.updatedAt || task.createdAt),
      }
    });
  }

  // Importar Notificaciones
  console.log('📤 Importando notificaciones...');
  for (const notification of data.notifications) {
    await prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        link: notification.link,
        createdAt: new Date(notification.createdAt),
      }
    });
  }

  // Importar Notificaciones Globales
  console.log('📤 Importando notificaciones globales...');
  for (const notif of data.globalNotifications) {
    await prisma.globalNotification.create({
      data: {
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        icon: notif.icon,
        color: notif.color,
        priority: notif.priority,
        createdAt: new Date(notif.createdAt),
        expiresAt: notif.expiresAt ? new Date(notif.expiresAt) : null,
        dismissedBy: notif.dismissedBy || [],
      }
    });
  }

  // Importar Tablas de clasificacion
  console.log('📤 Importando leaderboards...');
  for (const leaderboard of data.leaderboards) {
    await prisma.leaderboard.create({
      data: {
        id: leaderboard.id,
        period: leaderboard.period,
        type: leaderboard.type,
        rankings: leaderboard.rankings,
        updatedAt: new Date(leaderboard.updatedAt),
      }
    });
  }

  console.log('\n✅ ✅ ✅ TODOS LOS DATOS IMPORTADOS CORRECTAMENTE!');
  console.log('\n🔚 Importacion finalizada.');

  await prisma.$disconnect();
}

importData()
  .catch(e => {
    console.error('❌ Error importando datos:', e);
    process.exit(1);
  });