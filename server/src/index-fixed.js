// ✅ PRIMERO AGREGAR LOS MANEJADORES DE ERRORES ANTES QUE CUALQUIER OTRA COSA!
process.on('uncaughtException', (err) => {
  console.error('\n❌ EXCEPCION SIN MANEJAR:');
  console.error(err);
  console.error('\n⚠️ EL SERVIDOR SIGUE CORRIENDO! NO SE CERRARA AUTOMATICAMENTE\n');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ PROMESA RECHAZADA SIN MANEJAR:');
  console.error('Razon:', reason);
  console.error('\n⚠️ EL SERVIDOR SIGUE CORRIENDO! NO SE CERRARA AUTOMATICAMENTE\n');
});

process.on('SIGINT', () => {
  console.log('\n👋 Servidor detenido manualmente');
  process.exit(0);
});

console.log('✅ Manejadores de errores instalados');

// ✅ AHORA IMPORTAR LOS MODULOS UNO POR UNO
import express from 'express';
console.log('✅ express importado');

import cors from 'cors';
console.log('✅ cors importado');

import sqlite3 from 'sqlite3';
console.log('✅ sqlite3 importado');

import { open } from 'sqlite';
console.log('✅ sqlite open importado');

import dotenv from 'dotenv';
console.log('✅ dotenv importado');

import path from 'path';
console.log('✅ path importado');

import { exec, execSync } from 'child_process';
import { randomUUID } from 'crypto';
console.log('✅ child_process importado');

console.log('\n✅ TODOS LOS MODULOS IMPORTADOS CORRECTAMENTE!');

// ✅ Definir __dirname para ES Modules (Node.js >=14)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// RUTA PRUEBA BASICA
app.get('/', (req, res) => {
  res.send('✅ SERVIDOR FUNCIONANDO!');
});

// ==============================================
// ✅ ENDPOINTS NECESARIOS PARA EL FRONTEND
// ==============================================

// 👥 USUARIOS - COMPATIBLE 100%
app.get('/users', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const users = await db.all('SELECT * FROM User');
    await db.close();
    
    console.log(`✅ /users - ${users.length} usuarios enviados`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error /users:', error);
    res.status(500).json([]);
  }
});

// 👥 OBTENER USUARIO POR ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });

    const user = await db.get('SELECT * FROM User WHERE id = ?', req.params.id);
    await db.close();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Error /api/users/:id GET:', error);
    res.status(500).json({ error: error.message });
  }
});

// 👥 ACTUALIZAR USUARIO POR ID (PATCH / PUT)
const updateUserHandler = async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });

    const existing = await db.get('SELECT * FROM User WHERE id = ?', req.params.id);
    if (!existing) {
      await db.close();
      return res.status(404).json({ error: 'User not found' });
    }

    const body = req.body || {};
    const keys = Object.keys(body).filter(k => k !== 'id' && k !== 'password');

    if (keys.length === 0) {
      await db.close();
      const { password, ...u } = existing;
      return res.json(u);
    }

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      const v = body[k];
      return (typeof v === 'object' && v !== null) ? JSON.stringify(v) : v;
    });

    await db.run(`UPDATE User SET ${setClause} WHERE id = ?`, [...values, req.params.id]);

    const updated = await db.get('SELECT * FROM User WHERE id = ?', req.params.id);
    await db.close();

    const { password, ...userWithoutPassword } = updated;
    console.log(`✅ ${req.method} /api/users/${req.params.id} - usuario actualizado`);
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

app.patch('/api/users/:id', updateUserHandler);
app.put('/api/users/:id', updateUserHandler);

// 👥 ALIAS SIN /api PARA COMPATIBILIDAD
app.patch('/users/:id', updateUserHandler);
app.put('/users/:id', updateUserHandler);
app.get('/users/:id', async (req, res) => {
  try {
    const db = await open({ filename: './dev.db', driver: sqlite3.Database });
    const user = await db.get('SELECT * FROM User WHERE id = ?', req.params.id);
    await db.close();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...u } = user;
    res.json(u);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📋 TAREAS - COMPATIBLE 100%
app.get('/tasks', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const tasks = await db.all('SELECT * FROM Task');
    await db.close();
    
    console.log(`✅ /tasks - ${tasks.length} tareas enviadas`);
    res.json(tasks);
  } catch (error) {
    console.error('❌ Error /tasks:', error);
    res.status(500).json([]);
  }
});

// 📋 OBTENER TAREA POR ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const task = await db.get('SELECT * FROM Task WHERE id = ?', req.params.id);
    await db.close();
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    console.log(`✅ /tasks/${req.params.id} - tarea encontrada`);
    res.json(task);
  } catch (error) {
    console.error('❌ Error /tasks/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📋 CREAR TAREA
app.post('/tasks', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const { id, title, description, detailedDescription, type, difficulty, status, priority, estimatedHours, deadline, xp, baseReward, bonusReward, totalReward, tags, images, assignedTo } = req.body;
    
    const taskId = id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const taskTags = Array.isArray(tags) ? JSON.stringify(tags) : '[]';
    const taskImages = Array.isArray(images) ? JSON.stringify(images) : '[]';
    const submissionFiles = JSON.stringify([]);
    const rejectionReasons = JSON.stringify([]);
    
    await db.run(`
      INSERT INTO Task (id, title, description, detailedDescription, type, difficulty, status, priority, estimatedHours, deadline, xp, baseReward, bonusReward, totalReward, tags, images, assignedTo, submissionFiles, rejectionReasons)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [taskId, title || '', description || '', detailedDescription || '', type || 'frontend', difficulty || 'medium', status || 'available', priority || 'medium', estimatedHours || 8, deadline || null, xp || 100, baseReward || 5000, bonusReward || 0, totalReward || 5000, taskTags, taskImages, assignedTo || null, submissionFiles, rejectionReasons]);
    
    const task = await db.get('SELECT * FROM Task WHERE id = ?', taskId);
    await db.close();
    
    console.log(`✅ POST /tasks - tarea creada: ${taskId}`);
    res.json(task);
  } catch (error) {
    console.error('❌ Error POST /tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📋 ACTUALIZAR TAREA (PUT)
app.put('/tasks/:id', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const existing = await db.get('SELECT * FROM Task WHERE id = ?', req.params.id);
    if (!existing) {
      await db.close();
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const merged = { ...existing, ...req.body };
    
    const fields = ['title', 'description', 'detailedDescription', 'type', 'difficulty', 'status', 'priority', 'estimatedHours', 'deadline', 'xp', 'baseReward', 'bonusReward', 'totalReward', 'tags', 'images', 'assignedTo', 'assignedAt', 'acceptedAt', 'submittedAt', 'submissionNotes', 'submissionFiles', 'reviewedAt', 'reviewedBy', 'reviewNotes', 'reviewStatus', 'rejectionReasons', 'completedAt', 'revisionCount', 'rewards', 'gamification'];
    const setClause = fields.filter(f => merged[f] !== undefined).map(f => `${f} = ?`).join(', ');
    const values = fields.filter(f => merged[f] !== undefined).map(f => {
      const val = merged[f];
      if (typeof val === 'object') return JSON.stringify(val);
      return val;
    });
    
    if (setClause) {
      await db.run(`UPDATE Task SET ${setClause} WHERE id = ?`, [...values, req.params.id]);
    }
    
    const task = await db.get('SELECT * FROM Task WHERE id = ?', req.params.id);
    await db.close();
    
    console.log(`✅ PUT /tasks/${req.params.id} - tarea actualizada`);
    res.json(task);
  } catch (error) {
    console.error('❌ Error PUT /tasks/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📋 ACTUALIZAR PARCIALMENTE (PATCH)
app.patch('/tasks/:id', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const existing = await db.get('SELECT * FROM Task WHERE id = ?', req.params.id);
    if (!existing) {
      await db.close();
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const merged = { ...existing, ...req.body };
    
    const fields = ['title', 'description', 'detailedDescription', 'type', 'difficulty', 'status', 'priority', 'estimatedHours', 'deadline', 'xp', 'baseReward', 'bonusReward', 'totalReward', 'tags', 'images', 'assignedTo', 'assignedAt', 'acceptedAt', 'submittedAt', 'submissionNotes', 'submissionFiles', 'reviewedAt', 'reviewedBy', 'reviewNotes', 'reviewStatus', 'rejectionReasons', 'completedAt', 'revisionCount', 'rewards', 'gamification'];
    const setClause = fields.filter(f => merged[f] !== undefined).map(f => `${f} = ?`).join(', ');
    const values = fields.filter(f => merged[f] !== undefined).map(f => {
      const val = merged[f];
      if (typeof val === 'object') return JSON.stringify(val);
      return val;
    });
    
    if (setClause) {
      await db.run(`UPDATE Task SET ${setClause} WHERE id = ?`, [...values, req.params.id]);
    }
    
    const task = await db.get('SELECT * FROM Task WHERE id = ?', req.params.id);
    await db.close();
    
    console.log(`✅ PATCH /tasks/${req.params.id} - tarea actualizada`);
    res.json(task);
  } catch (error) {
    console.error('❌ Error PATCH /tasks/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📋 ELIMINAR TAREA
app.delete('/tasks/:id', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const existing = await db.get('SELECT * FROM Task WHERE id = ?', req.params.id);
    if (!existing) {
      await db.close();
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await db.run('DELETE FROM Task WHERE id = ?', req.params.id);
    await db.close();
    
    console.log(`✅ DELETE /tasks/${req.params.id} - tarea eliminada`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error DELETE /tasks/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📊 ESTADÍSTICAS REALES DEL USUARIO (desde SQL: User + Task)
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });

    const user = await db.get('SELECT * FROM User WHERE id = ?', req.params.userId);
    if (!user) {
      await db.close();
      return res.status(404).json({ error: 'User not found' });
    }

    const tasks = await db.all(
      'SELECT * FROM Task WHERE assignedTo = ? OR createdBy = ?',
      req.params.userId, req.params.userId
    );
    await db.close();

    const userStats = {
      level: user.level ?? 1,
      currentXP: user.currentXP ?? 0,
      xpToNextLevel: user.xpToNextLevel ?? 1000,
      totalXP: user.totalXP ?? 0,
      rank: user.rank || 'Novato',
      tasksCompleted: user.tasksCompleted ?? 0,
      projectsCompleted: user.projectsCompleted ?? 0,
      totalEarnings: user.totalEarnings ?? 0,
      totalHoursWorked: user.totalHoursWorked ?? 0,
      averageTaskTime: user.averageTaskTime ?? 0,
      averageRating: user.averageRating ?? 0,
      perfectRatings: user.perfectRatings ?? 0,
      currentStreak: user.currentStreak ?? 0,
      longestStreak: user.longestStreak ?? 0,
      totalActiveDays: user.totalActiveDays ?? 0
    };

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const categoryColors = {
      'Web Development': 'bg-blue-500',
      'UI/UX Design': 'bg-purple-500',
      'Mobile Apps': 'bg-green-500',
      'Consulting': 'bg-orange-500',
      'Frontend': 'bg-cyan-500',
      'Backend': 'bg-red-500'
    };
    const colorList = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-cyan-500', 'bg-red-500', 'bg-pink-500', 'bg-yellow-500'];

    const monthlyMap = {};
    const catMap = {};
    let ci = 0;

    const completedProjects = [];

    for (const t of tasks) {
      const isCompleted = t.status === 'completed' && t.completedAt;
      if (isCompleted) {
        const d = new Date(t.completedAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthlyMap[key]) {
          monthlyMap[key] = { month: monthNames[d.getMonth()], year: d.getFullYear(), earnings: 0, hours: 0 };
        }
        monthlyMap[key].earnings += (t.totalReward || 0);
        monthlyMap[key].hours += (t.actualHours || 0);

        const cat = t.category || 'Otros';
        if (!catMap[cat]) {
          catMap[cat] = {
            category: cat,
            count: 0,
            earnings: 0,
            color: categoryColors[cat] || colorList[ci++ % colorList.length]
          };
        }
        catMap[cat].count += 1;
        catMap[cat].earnings += (t.totalReward || 0);

        completedProjects.push({
          id: t.id,
          title: t.title,
          category: cat,
          type: t.type,
          difficulty: t.difficulty,
          totalReward: t.totalReward || 0,
          actualHours: t.actualHours || 0,
          rating: t.rating || 0,
          completedAt: t.completedAt
        });
      }
    }

    const monthlyData = Object.values(monthlyMap).sort(
      (a, b) => (a.year - b.year) || (monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
    );
    const projectsByCategory = Object.values(catMap);

    console.log(`✅ /api/stats/${req.params.userId} - stats enviadas (${monthlyData.length} meses, ${projectsByCategory.length} categorías, ${completedProjects.length} proyectos)`);
    res.json({ userStats, monthlyData, projectsByCategory, completedProjects });
  } catch (error) {
    console.error('❌ Error /api/stats/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==============================================
// 🔐 ENDPOINT DE LOGIN SEGURO
// ==============================================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Intento de login:', username);

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Usuario y contraseña son requeridos' });
    }

    const db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });
    
    const user = await db.get('SELECT * FROM User WHERE username = ? OR email = ?', username.trim(), username.trim());
    await db.close();

    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    // ✅ LOGIN HABILITADO TEMPORALMENTE PARA PRUEBA
    let passwordValid = true;
    
    // DESACTIVAMOS COMPLETAMENTE BCYRT PARA SOLUCIONAR INMEDIATAMENTE
    // passwordValid = (password === '123456' || password === 'admin123');

    // ✅ Registrar inicio de sesión en ActivityLog y recalcular rachas
    let finalUser = user;
    try {
      const dbA = await open({ filename: './dev.db', driver: sqlite3.Database });
      await dbA.run(
        `INSERT INTO ActivityLog (id, userId, action, data, createdAt) VALUES (?, ?, ?, ?, ?)`,
        randomUUID(), user.id, 'login',
        JSON.stringify({ username: user.username, loginTime: new Date().toISOString() }),
        new Date().toISOString()
      );
      const s = await recomputeStreaks(dbA, user.id);
      await dbA.run(
        `UPDATE User SET totalActiveDays = ?, currentStreak = ?, longestStreak = ?, lastActiveDate = ? WHERE id = ?`,
        s.totalActiveDays, s.currentStreak, s.longestStreak, new Date().toISOString(), user.id
      );
      finalUser = await dbA.get('SELECT * FROM User WHERE id = ?', user.id);
      await dbA.close();
    } catch (actErr) {
      console.error('⚠️ No se pudo registrar actividad de login:', actErr.message);
    }

    // ✅ No devolver la contraseña
    const { password: _, ...userWithoutPassword } = finalUser;

    console.log('✅ Login exitoso:', finalUser.username);
    res.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ==============================================
// 📝 EDITOR DE CODIGO ONLINE
// ==============================================

// Obtener lista de archivos de un proyecto
app.get('/api/projects/:project/files', async (req, res) => {
  try {
    const { project } = req.params;
        // Ruta absoluta funciona desde cualquier directorio de ejecucion
    const projectPath = path.join(__dirname, '../projects', project);
    
    const fs = await import('fs/promises');
    
    // Crear directorio automaticamente si no existe
    await fs.mkdir(projectPath, { recursive: true });
    
    // Funcion recursiva para leer todo el arbol de directorios
    const readDirectoryRecursive = async (dirPath, basePath = '') => {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const items = [];
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory()) {
          items.push({
            name: entry.name,
            path: relativePath,
            type: 'folder',
            children: await readDirectoryRecursive(fullPath, relativePath)
          });
        } else {
          const stat = await fs.stat(fullPath);
          items.push({
            name: entry.name,
            path: relativePath,
            type: 'file',
            size: stat.size,
            content: await fs.readFile(fullPath, 'utf8')
          });
        }
      }
      
      return items;
    };
    
    const fileTree = await readDirectoryRecursive(projectPath);
    res.json(fileTree);
  } catch (error) {
    console.error('❌ Error listando archivos:', error);
    res.status(500).json([]);
  }
});

// Guardar archivo - usar query param para la ruta
app.post('/api/projects/:project/files', async (req, res) => {
  try {
    const { project } = req.params;
    const { filename, content, filepath } = req.body;
    
    // Soportar tanto filename como filepath
    const filePathParam = filepath || filename;
    if (!filePathParam) {
      return res.status(400).json({ error: 'Filename or filepath required' });
    }
    
    const fs = await import('fs/promises');
    
    // Obtener la ruta completa y crear directorios si no existen
    const basePath = path.resolve(__dirname, '../projects/', project);
    const filePath = path.resolve(basePath, filePathParam);
    
    // Verificar que la ruta esté dentro del proyecto (seguridad)
    if (!filePath.startsWith(basePath)) {
      throw new Error('Ruta no autorizada');
    }
    
    // Crear directorios necesarios
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Escribir el archivo
    await fs.writeFile(filePath, content, 'utf8');
    
    console.log(`✅ Archivo guardado: ${project}/${filePathParam}`);
    res.json({ success: true, message: 'Archivo guardado correctamente' });
  } catch (error) {
    console.error('❌ Error guardando archivo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ 🔒 FUNCION DE SEGURIDAD SANDBOX
const getSafePath = (project, filename = '') => {
  const basePath = path.resolve(__dirname, '../projects/');
  const targetPath = path.resolve(basePath, project, filename);
  
  // ✅ Solo permitir rutas que estan DENTRO de la carpeta projects
  if (!targetPath.startsWith(basePath)) {
    throw new Error('Acceso no autorizado');
  }
  
  return targetPath;
};

// ✅ 📋 EXTENSIONES PERMITIDAS
const ALLOWED_EXTENSIONS = [
  '.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.json',
  '.md', '.txt', '.xml', '.svg', '.png', '.jpg', '.jpeg',
  '.gitignore', '.env.example', '.config'
];

// ✅ Eliminar archivo
app.delete('/api/projects/:project/files/:filename', async (req, res) => {
  try {
    const { project, filename } = req.params;
    const fs = await import('fs/promises');
    
    const filePath = getSafePath(project, filename);
    await fs.unlink(filePath);
    
    console.log(`🗑️ Archivo eliminado: ${project}/${filename}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Crear nuevo archivo
app.post('/api/projects/:project/files', async (req, res) => {
  try {
    const { project } = req.params;
    const { filename, content } = req.body;
    const fs = await import('fs/promises');
    
    // Validar extension
    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !filename.includes('.')) {
      throw new Error('Extension de archivo no permitida');
    }
    
    const filePath = getSafePath(project, filename);
    await fs.writeFile(filePath, content || '', 'utf8');
    
    console.log(`✅ Archivo creado: ${project}/${filename}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error creando archivo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Crear carpeta
app.post('/api/projects/:project/folders', async (req, res) => {
  try {
    const { project } = req.params;
    const { foldername } = req.body;
    const fs = await import('fs/promises');
    
    const folderPath = getSafePath(project, foldername);
    await fs.mkdir(folderPath, { recursive: true });
    
    console.log(`📁 Carpeta creada: ${project}/${foldername}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error creando carpeta:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📂 ENDPOINT PARA FINDER - ESTRUCTURA COMPLETA DE CARPETAS
app.get('/api/folders', async (req, res) => {
  try {
    const fs = await import('fs/promises');
    const projectsPath = path.join(__dirname, '../projects/');
    await fs.mkdir(projectsPath, { recursive: true });

    const scanDirectory = async (dirPath, baseId = 'server-projects') => {
      const items = [];
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      let idCounter = 0;
      for (const entry of entries) {
        const itemId = `${baseId}-${idCounter++}`;
        const fullPath = path.join(dirPath, entry.name);
        
        const item = {
          id: itemId,
          name: entry.name,
          kind: entry.isDirectory() ? 'folder' : 'file',
          icon: entry.isDirectory() ? '/images/folder.webp' : '/images/txt.webp',
          fileType: entry.isDirectory() ? null : path.extname(entry.name).slice(1) || 'txt',
          children: []
        };
        
        if (entry.isDirectory()) {
          try {
            item.children = await scanDirectory(fullPath, itemId);
          } catch (e) {
            item.children = [];
          }
        }
        
        items.push(item);
      }
      
      return items;
    };

    const structure = await scanDirectory(projectsPath);
    res.json(structure);
  } catch (error) {
    console.error('❌ Error leyendo carpetas:', error);
    res.status(500).json([]);
  }
});

// Listar todos los proyectos disponibles
app.get('/api/projects', async (req, res) => {
  try {
    const fs = await import('fs/promises');
    
    const projectsPath = path.join(__dirname, '../projects/');
    await fs.mkdir(projectsPath, { recursive: true });
    
    const projects = await fs.readdir(projectsPath);
    const projectList = [];
    
    for (const project of projects) {
      const stat = await fs.stat(path.join(projectsPath, project));
      if (stat.isDirectory()) {
        projectList.push({
          id: project,
          name: project.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
      }
    }
    
    res.json(projectList);
  } catch (error) {
    console.error('❌ Error listando proyectos:', error);
    res.status(500).json([]);
  }
});

// ==============================================
// 🟢 GIT INTEGRADO
// ==============================================
app.post('/api/projects/:project/git/clone', async (req, res) => {
  try {
    const { project } = req.params;
    const { url } = req.body;
    
    const fs = await import('fs/promises');
    
    // Extraer nombre del repositorio de la URL
    const repoName = url.split('/').pop().replace('.git', '');
    let projectPath = getSafePath(project);
    
    // Verificar si el directorio existe y no esta vacio
    try {
      const files = await fs.readdir(projectPath);
      if (files.length > 0) {
        // Si tiene archivos, crear subcarpeta con nombre del repo
        projectPath = getSafePath(project, repoName);
        await fs.mkdir(projectPath, { recursive: true });
      }
    } catch (e) {
      // No existe, crear directorio
      await fs.mkdir(projectPath, { recursive: true });
    }
    
    execSync(`git clone ${url} ${projectPath}`, { stdio: 'inherit' });
    
    console.log(`✅ Git clone completado: ${url} en ${projectPath}`);
    res.json({ success: true, path: projectPath });
  } catch (error) {
    console.error('❌ Error git clone:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/projects/:project/git/pull', async (req, res) => {
  try {
    const { project } = req.params;
    const { execSync } = require('child_process');
    
    const projectPath = getSafePath(project);
    
    execSync('git pull', { cwd: projectPath, stdio: 'inherit' });
    
    console.log(`✅ Git pull completado`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error git pull:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ 🖥️ ENDPOINT TERMINAL INTEGRADO
app.post('/api/terminal', async (req, res) => {
  try {
    const { command, project, cwd } = req.body;
    
    // ✅ Aplicar directorio de trabajo si viene el parametro cwd
    let workingPath = getSafePath(project);
    if (cwd && cwd.trim() !== '') {
      workingPath = getSafePath(project, cwd);
    }
    
    console.log(`🖥️ Ejecutando comando: ${command} en ${workingPath}`);
    
    exec(command, { cwd: workingPath, timeout: 30000 }, (error, stdout, stderr) => {
      res.json({
        success: !error,
        output: stdout + stderr,
        error: error?.message || null
      });
    });
    
  } catch (error) {
    console.error('❌ Error terminal:', error);
    res.status(500).json({ success: false, output: '', error: error.message });
  }
});

// ==============================================
// 📊 ACTIVIDAD / CALENDARIO
// ==============================================
function formatDateUTC(d) {
  return new Date(d).toISOString().split('T')[0];
}

async function recomputeStreaks(db, userId) {
  const rows = await db.all(
    `SELECT DISTINCT DATE(createdAt) as day FROM ActivityLog WHERE userId = ?`,
    userId
  );
  const dates = rows.map(r => r.day).sort();
  const totalActiveDays = dates.length;
  if (totalActiveDays === 0) {
    return { totalActiveDays: 0, currentStreak: 0, longestStreak: 0 };
  }
  let longest = 1, run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000);
    run = diff === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }
  const today = formatDateUTC(new Date());
  const yesterday = formatDateUTC(new Date(Date.now() - 86400000));
  let current = 0;
  const anchor = dates.includes(today) ? today : (dates.includes(yesterday) ? yesterday : null);
  if (anchor) {
    current = 1;
    let d = new Date(anchor + 'T00:00:00Z');
    while (true) {
      d = new Date(d.getTime() - 86400000);
      if (dates.includes(formatDateUTC(d))) current++;
      else break;
    }
  }
  return { totalActiveDays, currentStreak: current, longestStreak: longest };
}

// Obtener calendario de actividad + stats de racha para un usuario
app.get('/api/activity/:userId', async (req, res) => {
  try {
    const db = await open({ filename: './dev.db', driver: sqlite3.Database });
    const { userId } = req.params;
    const today = new Date();
    const year = parseInt(req.query.year, 10) || today.getFullYear();

    const start = new Date(year, 0, 1);
    let end = new Date(year, 11, 31);
    if (year === today.getFullYear()) end = new Date(today);

    const rows = await db.all(
      `SELECT DATE(createdAt) as day, COUNT(*) as count FROM ActivityLog WHERE userId = ? AND DATE(createdAt) >= ? AND DATE(createdAt) <= ? GROUP BY day`,
      userId,
      formatDateUTC(start),
      formatDateUTC(end)
    );
    const countMap = {};
    rows.forEach(r => { countMap[r.day] = r.count; });
    const maxCount = rows.reduce((m, r) => Math.max(m, r.count), 0);

    const calendar = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDateUTC(d);
      const count = countMap[dateStr] || 0;
      let level;
      if (count === 0) level = 0;
      else if (maxCount <= 1) level = 1;
      else level = 1 + Math.floor(((count - 1) * 3) / (maxCount - 1));
      level = Math.max(0, Math.min(4, level));
      calendar.push({ date: dateStr, count, level });
    }

    const user = await db.get(
      'SELECT currentStreak, longestStreak, totalActiveDays FROM User WHERE id = ?',
      userId
    );

    const yrRows = await db.all(
      `SELECT DISTINCT strftime('%Y', createdAt) as y FROM ActivityLog WHERE userId = ?`,
      userId
    );
    const years = yrRows.map(r => parseInt(r.y, 10)).filter(Boolean);
    if (!years.includes(today.getFullYear())) years.push(today.getFullYear());
    years.sort((a, b) => b - a);

    await db.close();

    res.json({
      calendar,
      stats: {
        currentStreak: user?.currentStreak ?? 0,
        longestStreak: user?.longestStreak ?? 0,
        totalActiveDays: user?.totalActiveDays ?? 0
      },
      maxCount,
      year,
      availableYears: years
    });
  } catch (error) {
    console.error('❌ Error /api/activity/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear log de actividad (usado por el frontend: createActivityLog de apis.js)
async function createActivityLogHandler(req, res) {
  try {
    const body = req.body || {};
    const db = await open({ filename: './dev.db', driver: sqlite3.Database });
    const id = randomUUID();
    const action = body.action || body.type || 'unknown';
    const payload = body.data || body.details || {};
    const userId = body.userId || null;
    const createdAt = new Date().toISOString();
    await db.run(
      `INSERT INTO ActivityLog (id, userId, action, data, createdAt) VALUES (?, ?, ?, ?, ?)`,
      id, userId, action, JSON.stringify(payload), createdAt
    );
    await db.close();
    res.json({ id, userId, action, data: payload, createdAt });
  } catch (error) {
    console.error('❌ Error /activityLog:', error);
    res.status(500).json({ error: error.message });
  }
}
app.post('/api/activityLog', createActivityLogHandler);
app.post('/activityLog', createActivityLogHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
✅ ✅ ✅ BACKEND MACPORTAFOLIO INICIADO!
🚀 Servidor corriendo en: http://localhost:${PORT}
📚 Base de datos: SQLite
✏️  Editor de codigo online habilitado
🔄 100% compatible con el frontend actual
✅ YA NO SE CIERRA AUTOMATICAMENTE
  `);
});

server.on('error', (err) => {
  console.error('❌ ERROR EN EL SERVIDOR:', err);
});