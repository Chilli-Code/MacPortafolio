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

console.log('\n✅ TODOS LOS MODULOS IMPORTADOS CORRECTAMENTE!');

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

    // ✅ COMPATIBILIDAD HACIA ATRAS CON CONTRASEÑAS SIN HASH
    let passwordValid = false;

    if (user.password.startsWith('$2b$')) {
      // Contraseña ya hasheada
      import('bcrypt').then(async bcrypt => {
        passwordValid = await bcrypt.compare(password, user.password);
      });
    } else {
      // Contraseña en texto plano
      passwordValid = (password === user.password);
    }
    
    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    // ✅ No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login exitoso:', user.username);
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

// Start server
const server = app.listen(PORT, () => {
  console.log(`
✅ ✅ ✅ BACKEND MACPORTAFOLIO INICIADO!
🚀 Servidor corriendo en: http://localhost:${PORT}
📚 Base de datos: SQLite
🔄 100% compatible con el frontend actual
✅ YA NO SE CIERRA AUTOMATICAMENTE
  `);
});

server.on('error', (err) => {
  console.error('❌ ERROR EN EL SERVIDOR:', err);
});