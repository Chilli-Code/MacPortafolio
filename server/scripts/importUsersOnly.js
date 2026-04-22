import { readFile } from 'fs/promises';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function importOnlyUsers() {
  console.log('📥 Importando SOLO USUARIOS y TAREAS...');

  const db = await open({
    filename: './dev.db',
    driver: sqlite3.Database
  });

  const rawData = await readFile('../db.json', 'utf8');
  const data = JSON.parse(rawData);

  console.log(`✅ Leidos: ${data.users.length} usuarios, ${data.tasks.length} tareas`);

  // Importar Usuarios
  console.log('📤 Importando usuarios...');
  for (const u of data.users) {
    try {
      await db.run(`
        INSERT INTO User (
          id, username, password, email, fullName, role, type, avatar, createdAt,
          bio, location, website, timezone, languages, github, linkedin, twitter, phone, skills,
          level, currentXP, xpToNextLevel, totalXP, rank, rankIcon, rankProgress,
          tasksCompleted, projectsCompleted, totalEarnings, totalHoursWorked, averageTaskTime, averageRating, perfectRatings,
          currentStreak, longestStreak, totalActiveDays,
          theme, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        u.id, u.username, u.password, u.email, u.fullName, u.role, u.type, u.avatar, u.createdAt,
        u.profile?.bio, u.profile?.location, u.profile?.website, u.profile?.timezone, JSON.stringify(u.profile?.languages || []), u.profile?.socialLinks?.github, u.profile?.socialLinks?.linkedin, u.profile?.socialLinks?.twitter, u.profile?.phone, JSON.stringify(u.skills || []),
        u.gamification?.level || 1, u.gamification?.currentXP || 0, u.gamification?.xpToNextLevel || 1000, u.gamification?.totalXP || 0, u.gamification?.rank || "Novato", u.gamification?.rankIcon || "🌱", u.gamification?.rankProgress || 0,
        u.gamification?.stats?.tasksCompleted || 0, u.gamification?.stats?.projectsCompleted || 0, u.gamification?.stats?.totalEarnings || 0, u.gamification?.stats?.totalHoursWorked || 0, u.gamification?.stats?.averageTaskTime || 0, u.gamification?.stats?.averageRating || 0, u.gamification?.stats?.perfectRatings || 0,
        u.gamification?.stats?.streaks?.current || 0, u.gamification?.stats?.streaks?.longest || 0, u.gamification?.stats?.streaks?.totalActiveDays || 0,
        u.preferences?.theme || "dark", u.preferences?.language || "es"
      );
      console.log(`✅ Usuario importado: ${u.username}`);
    } catch (e) {
      console.log(`⚠️ Usuario ${u.username} ya existe, saltando`);
    }
  }

  await db.close();
  console.log('\n✅ ✅ ✅ USUARIOS IMPORTADOS CORRECTAMENTE!');
}

importOnlyUsers();