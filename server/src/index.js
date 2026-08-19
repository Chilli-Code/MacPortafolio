import express from 'express';
import cors from 'cors';
import pkg from '../generated/client/index.js';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting para login (previene fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Maximo 5 intentos
  message: { error: 'Demasiados intentos de login. Intenta nuevamente en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==============================================
// 🔐 ENDPOINT DE LOGIN SEGURO
// ==============================================
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validacion basica
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario (incluye badges y logros que viven en tablas aparte)
    const user = await prisma.user.findFirst({
      where: { username: username.trim() },
      include: { badges: true, unlockedAchievements: true }
    });

    if (!user) {
      // No indicar si el usuario existe o no (seguridad)
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña con COMPATIBILIDAD HACIA ATRAS
    let passwordValid = false;

    // Primero intentar como bcrypt (cualquier versión válida: $2a$ $2b$ $2y$)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      // Si no es hash, comparar directamente como texto plano
      passwordValid = (password === user.password);

      // SI COINCIDE, ACTUALIZAR AUTOMATICAMENTE A HASH!
      if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        console.log(`✅ Contraseña migrada automaticamente para usuario: ${user.username}`);
      }
    }
    
    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    // No devolver la contraseña nunca
    const { password: _, ...userWithoutPassword } = user;

    // Login exitoso
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
// RUTAS COMPATIBLES 1:1 CON JSON-SERVER
// ==============================================

// USERS
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    console.log('GET user:', req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
    res.json(user);
  } catch (error) {
    console.error('Error patching user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({});
});

// TASKS
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  try {
    console.log('GET task:', req.params.id);
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      id: req.body.id || crypto.randomUUID(),
      status: req.body.status || 'available',
      tags: req.body.tags || [],
      images: req.body.images || [],
      rejectionReasons: req.body.rejectionReasons || [],
      createdBy: req.body.createdBy || 'adm_001',
      totalReward: req.body.totalReward || ((req.body.baseReward || 0) + (req.body.bonusReward || 0))
    };
    console.log('Creating task:', taskData);
    const task = await prisma.task.create({ data: taskData });
    res.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    console.log('PUT task:', req.params.id, req.body);
    const task = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
    res.json(task);
  } catch (error) {
    console.error('Error updating task (PUT):', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    console.log('PATCH task:', req.params.id, req.body);
    const task = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
    res.json(task);
  } catch (error) {
    console.error('Error patching task:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({});
});

// APPROVE TASK
app.patch('/tasks/:id/approve', async (req, res) => {
  try {
    console.log('APPROVE task:', req.params.id);
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        status: 'completed',
        completedAt: new Date().toISOString(),
        reviewNotes: req.body.reviewNotes || '✅ Aprobada'
      }
    });
    res.json(task);
  } catch (error) {
    console.error('Error approving task:', error);
    res.status(500).json({ error: error.message });
  }
});

// REJECT TASK
app.patch('/tasks/:id/reject', async (req, res) => {
  try {
    console.log('REJECT task:', req.params.id);
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        status: 'rejected',
        reviewNotes: req.body.reviewNotes || '❌ Rechazada'
      }
    });
    res.json(task);
  } catch (error) {
    console.error('Error rejecting task:', error);
    res.status(500).json({ error: error.message });
  }
});

// ACHIEVEMENTS
app.get('/achievements', async (req, res) => {
  const achievements = await prisma.achievement.findMany();
  res.json(achievements);
});

// BADGES
app.get('/badges', async (req, res) => {
  const badges = await prisma.badge.findMany();
  res.json(badges);
});

// LEVELS
app.get('/levels', async (req, res) => {
  const levels = await prisma.level.findMany();
  res.json(levels);
});

// NOTIFICATIONS
app.get('/notifications', async (req, res) => {
  const notifications = await prisma.notification.findMany();
  res.json(notifications);
});

// GLOBAL NOTIFICATIONS
app.get('/globalNotifications', async (req, res) => {
  const notifications = await prisma.globalNotification.findMany();
  res.json(notifications);
});

// SETTINGS
app.get('/settings', async (req, res) => {
  const settings = await prisma.setting.findMany();
  res.json(settings);
});

// LEADERBOARDS
app.get('/leaderboards', async (req, res) => {
  const leaderboards = await prisma.leaderboard.findMany();
  res.json(leaderboards);
});

// ACTIVITY LOG
app.get('/activityLog', async (req, res) => {
  const logs = await prisma.activityLog.findMany();
  res.json(logs);
});

// ==============================================
// 📂 ENDPOINT PARA OBTENER ESTRUCTURA DE CARPETAS
// ==============================================
const scanDirectory = (dirPath, baseId = 'server-projects') => {
  const items = [];
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  let idCounter = 0;
  for (const file of files) {
    const itemId = `${baseId}-${idCounter++}`;
    const fullPath = path.join(dirPath, file.name);
    
    const item = {
      id: itemId,
      name: file.name,
      kind: file.isDirectory() ? 'folder' : 'file',
      icon: file.isDirectory() ? '/images/folder.webp' : '/images/txt.webp',
      fileType: file.isDirectory() ? null : path.extname(file.name).slice(1) || 'txt',
      children: []
    };
    
    if (file.isDirectory()) {
      try {
        item.children = scanDirectory(fullPath, itemId);
      } catch (e) {
        item.children = [];
      }
    }
    
    items.push(item);
  }
  
  return items;
};

app.get('/api/folders', async (req, res) => {
  try {
    const projectsPath = path.join(__dirname, '../projects');
    
    if (!fs.existsSync(projectsPath)) {
      return res.json([]);
    }
    
    const structure = scanDirectory(projectsPath);
    res.json(structure);
  } catch (error) {
    console.error('❌ Error leyendo carpetas:', error);
    res.status(500).json({ error: 'No se pudo leer la estructura de carpetas' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`
✅ ✅ ✅ BACKEND MACPORTAFOLIO INICIADO!
🚀 Servidor corriendo en: http://localhost:${PORT}
📚 Base de datos: SQLite con Prisma ORM
🔄 100% compatible con el frontend actual
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Apagando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});