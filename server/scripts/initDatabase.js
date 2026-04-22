import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initDatabase() {
  console.log('📋 Inicializando base de datos...');

  // Abrir base de datos SQLite
  const db = await open({
    filename: './dev.db',
    driver: sqlite3.Database
  });

  // Crear tablas
  console.log('🗄️ Creando tablas...');

  // Tabla User
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT UNIQUE,
      fullName TEXT,
      role TEXT,
      type TEXT,
      avatar TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      bio TEXT,
      location TEXT,
      website TEXT,
      timezone TEXT DEFAULT 'America/Bogota',
      languages TEXT,
      github TEXT,
      linkedin TEXT,
      twitter TEXT,
      phone TEXT,
      skills TEXT,
      level INTEGER DEFAULT 1,
      currentXP INTEGER DEFAULT 0,
      xpToNextLevel INTEGER DEFAULT 1000,
      totalXP INTEGER DEFAULT 0,
      rank TEXT DEFAULT 'Novato',
      rankIcon TEXT DEFAULT '🌱',
      rankProgress INTEGER DEFAULT 0,
      tasksCompleted INTEGER DEFAULT 0,
      projectsCompleted INTEGER DEFAULT 0,
      totalEarnings INTEGER DEFAULT 0,
      totalHoursWorked INTEGER DEFAULT 0,
      averageTaskTime INTEGER DEFAULT 0,
      averageRating REAL DEFAULT 0,
      perfectRatings INTEGER DEFAULT 0,
      currentStreak INTEGER DEFAULT 0,
      longestStreak INTEGER DEFAULT 0,
      totalActiveDays INTEGER DEFAULT 0,
      lastActiveDate DATETIME,
      theme TEXT DEFAULT 'dark',
      language TEXT DEFAULT 'es'
    )
  `);

  // Tabla Task
  await db.exec(`
    CREATE TABLE IF NOT EXISTS task (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      detailedDescription TEXT,
      type TEXT,
      category TEXT,
      difficulty TEXT,
      priority TEXT DEFAULT 'medium',
      estimatedHours INTEGER,
      deadline DATETIME,
      xp INTEGER,
      baseReward INTEGER,
      bonusReward INTEGER,
      totalReward INTEGER,
      status TEXT DEFAULT 'available',
      tags TEXT,
      images TEXT,
      assignedTo TEXT,
      assignedAt DATETIME,
      acceptedAt DATETIME,
      submittedAt DATETIME,
      submissionNotes TEXT,
      submissionFiles TEXT,
      reviewedAt DATETIME,
      reviewedBy TEXT,
      reviewNotes TEXT,
      reviewStatus TEXT,
      rating INTEGER,
      completedAt DATETIME,
      actualHours INTEGER,
      rejectionReasons TEXT,
      revisionCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdBy TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla Achievement
  await db.exec(`
    CREATE TABLE IF NOT EXISTS achievement (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      detailedDescription TEXT,
      icon TEXT,
      category TEXT,
      rarity TEXT,
      xpReward INTEGER,
      coinReward INTEGER,
      hidden INTEGER DEFAULT 0,
      secret INTEGER DEFAULT 0,
      requirementType TEXT,
      requirementValue INTEGER,
      totalUnlocked INTEGER DEFAULT 0
    )
  `);

  // Tabla UnlockedAchievement
  await db.exec(`
    CREATE TABLE IF NOT EXISTS unlocked_achievement (
      id TEXT PRIMARY KEY,
      userId TEXT,
      achievementId TEXT,
      unlockedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      progress INTEGER DEFAULT 0,
      maxProgress INTEGER DEFAULT 1,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (achievementId) REFERENCES achievement(id) ON DELETE CASCADE,
      UNIQUE(userId, achievementId)
    )
  `);

  // Tabla Badge
  await db.exec(`
    CREATE TABLE IF NOT EXISTS badge (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      icon TEXT,
      rarity TEXT,
      category TEXT
    )
  `);

  // Tabla Level
  await db.exec(`
    CREATE TABLE IF NOT EXISTS level (
      level INTEGER PRIMARY KEY AUTOINCREMENT,
      minXP INTEGER,
      maxXP INTEGER,
      title TEXT,
      icon TEXT
    )
  `);

  // Tabla Notification
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notification (
      id TEXT PRIMARY KEY,
      userId TEXT,
      type TEXT,
      title TEXT,
      message TEXT,
      read INTEGER DEFAULT 0,
      link TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    )
  `);

  // Tabla GlobalNotification
  await db.exec(`
    CREATE TABLE IF NOT EXISTS global_notification (
      id TEXT PRIMARY KEY,
      type TEXT,
      title TEXT,
      message TEXT,
      icon TEXT,
      color TEXT,
      priority TEXT DEFAULT 'normal',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME,
      dismissedBy TEXT
    )
  `);

  // Tabla Setting
  await db.exec(`
    CREATE TABLE IF NOT EXISTS setting (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE,
      value TEXT,
      type TEXT
    )
  `);

  // Tabla Leaderboard
  await db.exec(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id TEXT PRIMARY KEY,
      period TEXT,
      type TEXT,
      rankings TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla ActivityLog
  await db.exec(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      userId TEXT,
      action TEXT,
      data TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ ✅ ✅ Base de datos inicializada correctamente!');
  await db.close();
}

initDatabase()
  .catch(e => {
    console.error('❌ Error inicializando base de datos:', e);
    process.exit(1);
  });