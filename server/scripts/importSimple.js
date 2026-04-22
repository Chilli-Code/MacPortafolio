import { readFile } from 'fs/promises';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function importAllData() {
  console.log('📥 Importando todos los datos a SQLite...');

  // Abrir base de datos
  const db = await open({
    filename: './dev.db',
    driver: sqlite3.Database
  });

  // Leer db.json
  const rawData = await readFile('../db.json', 'utf8');
  const data = JSON.parse(rawData);

  console.log(`✅ Leidos:
  - ${data.users.length} usuarios
  - ${data.tasks.length} tareas
  - ${data.achievements.length} logros
  - ${data.badges.length} insignias
  - ${data.levels.length} niveles
  `);

  // Limpiar tablas
  console.log('🗑️ Limpiando base de datos...');
  await db.run('DELETE FROM ActivityLog');
  await db.run('DELETE FROM Leaderboard');
  await db.run('DELETE FROM Setting');
  await db.run('DELETE FROM GlobalNotification');
  await db.run('DELETE FROM Notification');
  await db.run('DELETE FROM UnlockedAchievement');
  await db.run('DELETE FROM Badge');
  await db.run('DELETE FROM Achievement');
  await db.run('DELETE FROM Task');
  await db.run('DELETE FROM User');
  await db.run('DELETE FROM Level');

  // Importar Niveles
  console.log('📤 Importando niveles...');
  for (const level of data.levels) {
    await db.run(
      'INSERT INTO Level (level, minXP, maxXP, title, icon) VALUES (?, ?, ?, ?, ?)',
      level.level, level.minXP, level.maxXP, level.title, level.icon
    );
  }

  // Importar Logros
  console.log('📤 Importando logros...');
  for (const a of data.achievements) {
    await db.run(
      'INSERT INTO Achievement (id, title, description, detailedDescription, icon, category, rarity, xpReward, coinReward, hidden, secret, requirementType, requirementValue, totalUnlocked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      a.id, a.title, a.description, a.detailedDescription, a.icon, a.category, a.rarity, a.xpReward, a.coinReward, a.hidden || 0, a.secret || 0, a.requirements?.type || 'none', a.requirements?.value || 0, a.stats?.totalUnlocked || 0
    );
  }

  // Importar Insignias
  console.log('📤 Importando insignias...');
  for (const b of data.badges) {
    await db.run(
      'INSERT INTO Badge (id, name, description, icon, rarity, category) VALUES (?, ?, ?, ?, ?, ?)',
      b.id, b.name, b.description, b.icon, b.rarity, b.category
    );
  }

  // Importar Usuarios
  console.log('📤 Importando usuarios...');
  for (const u of data.users) {
    await db.run(`
      INSERT INTO User (
        id, username, password, email, fullName, role, type, avatar, createdAt,
        bio, location, website, timezone, languages, github, linkedin, twitter, phone, skills,
        level, currentXP, xpToNextLevel, totalXP, rank, rankIcon, rankProgress,
        tasksCompleted, projectsCompleted, totalEarnings, totalHoursWorked, averageTaskTime, averageRating, perfectRatings,
        currentStreak, longestStreak, totalActiveDays, lastActiveDate,
        theme, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      u.id, u.username, u.password, u.email, u.fullName, u.role, u.type, u.avatar, u.createdAt,
      u.profile?.bio, u.profile?.location, u.profile?.website, u.profile?.timezone, JSON.stringify(u.profile?.languages || []), u.profile?.socialLinks?.github, u.profile?.socialLinks?.linkedin, u.profile?.socialLinks?.twitter, u.profile?.phone, JSON.stringify(u.skills || []),
      u.gamification?.level || 1, u.gamification?.currentXP || 0, u.gamification?.xpToNextLevel || 1000, u.gamification?.totalXP || 0, u.gamification?.rank || "Novato", u.gamification?.rankIcon || "🌱", u.gamification?.rankProgress || 0,
      u.gamification?.stats?.tasksCompleted || 0, u.gamification?.stats?.projectsCompleted || 0, u.gamification?.stats?.totalEarnings || 0, u.gamification?.stats?.totalHoursWorked || 0, u.gamification?.stats?.averageTaskTime || 0, u.gamification?.stats?.averageRating || 0, u.gamification?.stats?.perfectRatings || 0,
      u.gamification?.stats?.streaks?.current || 0, u.gamification?.stats?.streaks?.longest || 0, u.gamification?.stats?.streaks?.totalActiveDays || 0, u.gamification?.stats?.streaks?.lastActiveDate,
      u.preferences?.theme || "dark", u.preferences?.language || "es"
    );
  }

  // Importar Tareas
  console.log('📤 Importando tareas...');
  for (const t of data.tasks) {
    await db.run(`
      INSERT INTO Task (
        id, title, description, detailedDescription, type, category, difficulty, priority, estimatedHours, deadline,
        xp, baseReward, bonusReward, totalReward,
        status, tags, images,
        assignedTo, assignedAt, acceptedAt, submittedAt, submissionNotes, submissionFiles,
        reviewedAt, reviewedBy, reviewNotes, reviewStatus, rating, completedAt, actualHours, rejectionReasons, revisionCount,
        createdAt, createdBy, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      t.id, t.title, t.description, t.detailedDescription, t.type, t.category, t.difficulty, t.priority || "medium", t.estimatedHours, t.deadline,
      t.rewards?.xp || t.xp || 0, t.rewards?.baseReward || t.reward || 0, t.rewards?.bonusReward || 0, t.rewards?.totalReward || t.reward || 0,
      t.status, JSON.stringify(t.tags || []), JSON.stringify(t.images || []),
      t.assignedTo, t.assignedAt, t.acceptedAt, t.submittedAt, t.submissionNotes, JSON.stringify(t.submissionFiles || []),
      t.reviewedAt, t.reviewedBy, t.reviewNotes, t.reviewStatus, t.rating, t.completedAt, t.actualHours, JSON.stringify(t.rejectionReasons || []), t.revisionCount || 0,
      t.createdAt, t.createdBy, t.updatedAt || t.createdAt
    );
  }

  // Importar Notificaciones
  console.log('📤 Importando notificaciones...');
  for (const n of data.notifications) {
    await db.run(
      'INSERT INTO Notification (id, userId, type, title, message, read, link, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      n.id, n.userId, n.type, n.title, n.message, n.read, n.link, n.createdAt
    );
  }

  // Importar Notificaciones Globales
  console.log('📤 Importando notificaciones globales...');
  for (const n of data.globalNotifications) {
    await db.run(
      'INSERT INTO GlobalNotification (id, type, title, message, icon, color, priority, createdAt, expiresAt, dismissedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      n.id, n.type, n.title, n.message, n.icon, n.color, n.priority, n.createdAt, n.expiresAt, JSON.stringify(n.dismissedBy || [])
    );
  }

  // Importar Leaderboards
  console.log('📤 Importando leaderboards...');
  for (const l of data.leaderboards) {
    await db.run(
      'INSERT INTO Leaderboard (id, period, type, rankings, updatedAt) VALUES (?, ?, ?, ?, ?)',
      l.id, l.period, l.type, JSON.stringify(l.rankings), l.updatedAt
    );
  }

  await db.close();

  console.log('\n✅ ✅ ✅ TODOS LOS DATOS IMPORTADOS CORRECTAMENTE!');
  console.log('\n🔚 Proceso finalizado. La base de datos ya tiene todos los datos.');
}

importAllData()
  .catch(e => {
    console.error('❌ Error importando datos:', e);
    process.exit(1);
  });