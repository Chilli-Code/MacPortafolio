import { readFile } from 'fs/promises';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function simpleImport() {
  console.log('📥 Iniciando importacion simple de datos desde db.json...');

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

  // Abrir base de datos SQLite
  const db = await open({
    filename: './dev.db',
    driver: sqlite3.Database
  });

  // Limpiar tablas
  console.log('🗑️ Limpiando tablas...');
  await db.exec('DELETE FROM unlocked_achievement');
  await db.exec('DELETE FROM badge');
  await db.exec('DELETE FROM achievement');
  await db.exec('DELETE FROM task');
  await db.exec('DELETE FROM user');
  await db.exec('DELETE FROM level');

  // Importar Niveles
  console.log('📤 Importando niveles...');
  for (const level of data.levels) {
    await db.run(
      'INSERT INTO level (level, minXP, maxXP, title, icon) VALUES (?, ?, ?, ?, ?)',
      [level.level, level.minXP, level.maxXP, level.title, level.icon]
    );
  }

  // Importar Logros
  console.log('📤 Importando logros...');
  for (const achievement of data.achievements) {
    await db.run(
      'INSERT INTO achievement (id, title, description, detailedDescription, icon, category, rarity, xpReward, coinReward, hidden, secret, requirementType, requirementValue, totalUnlocked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        achievement.id,
        achievement.title,
        achievement.description,
        achievement.detailedDescription,
        achievement.icon,
        achievement.category,
        achievement.rarity,
        achievement.xpReward,
        achievement.coinReward,
        achievement.hidden ? 1 : 0,
        achievement.secret ? 1 : 0,
        achievement.requirements.type,
        achievement.requirements.value || 0, // Default to 0 if missing
        achievement.stats?.totalUnlocked || 0
      ]
    );
  }

  // Importar Insignias
  console.log('📤 Importando insignias...');
  for (const badge of data.badges) {
    await db.run(
      'INSERT INTO badge (id, name, description, icon, rarity, category) VALUES (?, ?, ?, ?, ?, ?)',
      [
        badge.id,
        badge.name,
        badge.description,
        badge.icon,
        badge.rarity,
        badge.category
      ]
    );
  }

  // Importar Usuarios
  console.log('📤 Importando usuarios...');
  for (const user of data.users) {
    await db.run(
      'INSERT INTO user (id, username, password, email, fullName, role, type, avatar, createdAt, bio, location, website, timezone, languages, github, linkedin, twitter, phone, skills, level, currentXP, xpToNextLevel, totalXP, rank, rankIcon, rankProgress, tasksCompleted, projectsCompleted, totalEarnings, totalHoursWorked, averageTaskTime, averageRating, perfectRatings, currentStreak, longestStreak, totalActiveDays, lastActiveDate, theme, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        user.id,
        user.username,
        user.password,
        user.email,
        user.fullName,
        user.role,
        user.type,
        user.avatar,
        user.createdAt || new Date().toISOString(), // Default to current date if null
        user.profile?.bio,
        user.profile?.location,
        user.profile?.website,
        user.profile?.timezone || "America/Bogota", // Default to America/Bogota if null
        JSON.stringify(user.profile?.languages || []),
        user.profile?.socialLinks?.github,
        user.profile?.socialLinks?.linkedin,
        user.profile?.socialLinks?.twitter,
        user.profile?.phone,
        JSON.stringify(user.skills || []),
        user.gamification?.level || 1,
        user.gamification?.currentXP || 0,
        user.gamification?.xpToNextLevel || 1000,
        user.gamification?.totalXP || 0,
        user.gamification?.rank || "Novato",
        user.gamification?.rankIcon || "🌱",
        user.gamification?.rankProgress || 0,
        user.gamification?.stats?.tasksCompleted || 0,
        user.gamification?.stats?.projectsCompleted || 0,
        user.gamification?.stats?.totalEarnings || 0,
        user.gamification?.stats?.totalHoursWorked || 0,
        user.gamification?.stats?.averageTaskTime || 0,
        user.gamification?.stats?.averageRating || 0,
        user.gamification?.stats?.perfectRatings || 0,
        user.gamification?.stats?.streaks?.current || 0,
        user.gamification?.stats?.streaks?.longest || 0,
        user.gamification?.stats?.streaks?.totalActiveDays || 0,
        user.gamification?.stats?.streaks?.lastActiveDate,
        user.preferences?.theme || "dark",
        user.preferences?.language || "es"
      ]
    );
  }

  // Importar Tareas
  console.log('📤 Importando tareas...');
  for (const task of data.tasks) {
    await db.run(
      'INSERT INTO task (id, title, description, detailedDescription, type, category, difficulty, priority, estimatedHours, deadline, xp, baseReward, bonusReward, totalReward, status, tags, images, assignedTo, assignedAt, acceptedAt, submittedAt, submissionNotes, submissionFiles, reviewedAt, reviewedBy, reviewNotes, reviewStatus, rating, completedAt, actualHours, rejectionReasons, revisionCount, createdAt, createdBy, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        task.id,
        task.title,
        task.description,
        task.detailedDescription,
        task.type,
        task.category,
        task.difficulty,
        task.priority || "medium",
        task.estimatedHours,
        task.deadline,
        task.rewards?.xp || task.xp || 0,
        task.rewards?.baseReward || task.reward || 0,
        task.rewards?.bonusReward || 0,
        task.rewards?.totalReward || task.reward || 0,
        task.status,
        JSON.stringify(task.tags || []),
        JSON.stringify(task.images || []),
        task.assignedTo,
        task.assignedAt,
        task.acceptedAt,
        task.submittedAt,
        task.submissionNotes,
        JSON.stringify(task.submissionFiles || []),
        task.reviewedAt,
        task.reviewedBy,
        task.reviewNotes,
        task.reviewStatus,
        task.rating,
        task.completedAt,
        task.actualHours,
        JSON.stringify(task.rejectionReasons || []),
        task.revisionCount || 0,
        task.createdAt || new Date().toISOString(), // Default to current date if null
        task.createdBy || "adm_001", // Default to admin if null
        task.updatedAt || task.createdAt || new Date().toISOString() // Default to createdAt or current date if null
      ]
    );
  }

  // Importar Notificaciones
  console.log('📤 Importando notificaciones...');
  for (const notification of data.notifications) {
    await db.run(
      'INSERT INTO notification (id, userId, type, title, message, read, link, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        notification.id,
        notification.userId,
        notification.type,
        notification.title,
        notification.message,
        notification.read ? 1 : 0,
        notification.link,
        notification.createdAt
      ]
    );
  }

  // Importar Notificaciones Globales
  console.log('📤 Importando notificaciones globales...');
  for (const notif of data.globalNotifications) {
    await db.run(
      'INSERT INTO global_notification (id, type, title, message, icon, color, priority, createdAt, expiresAt, dismissedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        notif.id,
        notif.type,
        notif.title,
        notif.message,
        notif.icon,
        notif.color,
        notif.priority,
        notif.createdAt,
        notif.expiresAt,
        JSON.stringify(notif.dismissedBy || [])
      ]
    );
  }

  console.log('\n✅ ✅ ✅ TODOS LOS DATOS IMPORTADOS CORRECTAMENTE!');
  console.log('\n🔚 Importacion simple finalizada.');

  await db.close();
}

simpleImport()
  .catch(e => {
    console.error('❌ Error importando datos:', e);
    process.exit(1);
  });