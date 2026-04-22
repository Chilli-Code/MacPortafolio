import express from 'express';
import cors from 'cors';
import pkg from '../generated/client/index.js';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

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

    // Buscar usuario
    const user = await prisma.user.findFirst({
      where: { username: username.trim() }
    });

    if (!user) {
      // No indicar si el usuario existe o no (seguridad)
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña con COMPATIBILIDAD HACIA ATRAS
    let passwordValid = false;

    // Primero intentar como bcrypt (nuevo formato seguro)
    if (user.password.startsWith('$2b$')) {
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
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  res.json(user);
});

app.post('/users', async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
});

app.put('/users/:id', async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
  res.json(user);
});

app.patch('/users/:id', async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
  res.json(user);
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
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const task = await prisma.task.create({ data: req.body });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
  res.json(task);
});

app.patch('/tasks/:id', async (req, res) => {
  const task = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({});
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