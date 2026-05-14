import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MANEJO GLOBAL DE ERRORES PARA QUE NO SE CIERRE EL SERVIDOR
process.on('uncaughtException', (err) => {
  console.error('\n❌ EXCEPCION SIN MANEJAR:');
  console.error(err);
  console.error('\n⚠️ EL SERVIDOR SIGUE CORRIENDO! NO SE CERRARA AUTOMATICAMENTE\n');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ PROMESA RECHAZADA SIN MANEJAR:');
  console.error('Promesa:', promise);
  console.error('Razon:', reason);
  console.error('\n⚠️ EL SERVIDOR SIGUE CORRIENDO! NO SE CERRARA AUTOMATICAMENTE\n');
});

process.on('SIGINT', () => {
  console.log('\n👋 Servidor detenido manualmente');
  process.exit(0);
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login. Intenta nuevamente en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Abrir base de datos
async function getDB() {
  return open({
    filename: './dev.db',
    driver: sqlite3.Database
  });
}

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

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Usuario y contraseña son requeridos' });
    }

    const db = await getDB();
    const user = await db.get('SELECT * FROM User WHERE username = ?', username.trim());
    await db.close();

    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    let passwordValid = false;
    if (user.password.startsWith('$2b$')) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      passwordValid = (password === user.password);
      if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const db2 = await getDB();
        await db2.run('UPDATE User SET password = ? WHERE id = ?', hashedPassword, user.id);
        await db2.close();
        console.log(`✅ Contraseña migrada automaticamente para usuario: ${user.username}`);
      }
    }
    
    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos' });
    }

    const { password: _, ...userWithoutPassword } = user;

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
// 👥 ENDPOINT GESTION DE USUARIOS
// ==============================================

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const db = await getDB();
    const users = await db.all('SELECT id, username, email, fullName, role, type, avatar, createdAt, level, currentXP FROM User ORDER BY createdAt DESC');
    await db.close();
    res.json(users);
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Crear nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, fullName, role, type, avatar } = req.body;

    // Validaciones basicas
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Usuario, email y contraseña son requeridos' });
    }

    const db = await getDB();

    // Verificar si username o email ya existen
    const existingUser = await db.get('SELECT id FROM User WHERE username = ? OR email = ?', username, email);
    
    if (existingUser) {
      await db.close();
      return res.status(400).json({ success: false, error: 'El usuario o email ya existen' });
    }

    // Hashear contraseña automaticamente
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar nuevo usuario
    const result = await db.run(`
      INSERT INTO User (
        id, username, password, email, fullName, role, type, avatar, createdAt,
        languages, skills, level, currentXP, xpToNextLevel, totalXP, rank,
        theme, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      crypto.randomUUID(),
      username,
      hashedPassword,
      email,
      fullName || username,
      role || 'user',
      type || 'user',
      avatar || '/images/Avatar.png',
      new Date().toISOString(),
      '[]',
      '[]',
      1,
      0,
      1000,
      0,
      'Novato',
      'dark',
      'es'
    );

    const newUser = await db.get('SELECT id, username, email, fullName, role, type, avatar, createdAt FROM User WHERE id = ?', result.lastID);
    await db.close();

    res.json({
      success: true,
      user: newUser,
      message: 'Usuario creado correctamente'
    });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, fullName, role } = req.body;

    if (!username || !email) {
      return res.status(400).json({ success: false, error: 'Usuario y email son requeridos' });
    }

    const db = await getDB();
    
    let updateQuery = 'UPDATE User SET username = ?, email = ?, fullName = ?, role = ?';
    let params = [username, email, fullName || username, role || 'user'];

    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateQuery += ', password = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.run(updateQuery, params);
    
    const updatedUser = await db.get('SELECT id, username, email, fullName, role, type, avatar, createdAt, level FROM User WHERE id = ?', id);
    await db.close();

    res.json({
      success: true,
      user: updatedUser,
      message: 'Usuario actualizado correctamente'
    });

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await getDB();
    await db.run('DELETE FROM User WHERE id = ?', id);
    await db.close();

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});


// ==============================================
// 📋 ENDPOINT GESTION DE TAREAS
// ==============================================

// Obtener todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const db = await getDB();
    const tasks = await db.all('SELECT * FROM Task ORDER BY createdAt DESC');
    await db.close();
    res.json(tasks);
  } catch (error) {
    console.error('❌ Error obteniendo tareas:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Crear nueva tarea
app.post('/api/tasks', async (req, res) => {
  try {
    const {
      title, description, detailedDescription, type, category, difficulty, priority,
      estimatedHours, deadline, xp, baseReward, bonusReward, tags, createdBy
    } = req.body;

    if (!title || !description || !type || !difficulty || !xp || !baseReward) {
      return res.status(400).json({ success: false, error: 'Campos obligatorios faltantes' });
    }

    const taskId = crypto.randomUUID();
    const totalReward = baseReward + (bonusReward || 0);
    const now = new Date().toISOString();

    const db = await getDB();
    
    await db.run(`
      INSERT INTO Task (
        id, title, description, detailedDescription, type, category, difficulty, priority,
        estimatedHours, deadline, xp, baseReward, bonusReward, totalReward, tags, images,
        status, createdBy, createdAt, updatedAt, rejectionReasons, submissionFiles
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      taskId, title, description, detailedDescription, type, category, difficulty,
      priority || 'medium', estimatedHours, deadline, xp, baseReward, bonusReward || 0,
      totalReward, JSON.stringify(tags || []), '[]', 'available', createdBy,
      now, now, '[]', '[]'
    );

    const newTask = await db.get('SELECT * FROM Task WHERE id = ?', taskId);
    await db.close();

    res.json({
      success: true,
      task: newTask,
      message: 'Tarea creada correctamente'
    });

  } catch (error) {
    console.error('❌ Error creando tarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Actualizar tarea
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;

    const db = await getDB();
    
    // Actualizar solo los campos que vienen
    const updates = [];
    const values = [];
    
    const allowedFields = [
      'title', 'description', 'detailedDescription', 'type', 'category',
      'difficulty', 'priority', 'estimatedHours', 'deadline', 'xp',
      'baseReward', 'bonusReward', 'status', 'tags', 'assignedTo'
    ];

    allowedFields.forEach(field => {
      if (taskData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(field === 'tags' ? JSON.stringify(taskData[field]) : taskData[field]);
      }
    });

    if (updates.length === 0) {
      await db.close();
      return res.status(400).json({ success: false, error: 'No hay campos para actualizar' });
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await db.run(`UPDATE Task SET ${updates.join(', ')} WHERE id = ?`, values);
    
    const updatedTask = await db.get('SELECT * FROM Task WHERE id = ?', id);
    await db.close();

    res.json({ success: true, task: updatedTask });

  } catch (error) {
    console.error('❌ Error actualizando tarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Eliminar tarea
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await getDB();
    await db.run('DELETE FROM Task WHERE id = ?', id);
    await db.close();

    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error eliminando tarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Aprobar tarea
app.patch('/api/tasks/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerId, reviewNotes, rating } = req.body;

    const db = await getDB();
    await db.run(`
      UPDATE Task SET
        status = 'completed',
        reviewStatus = 'approved',
        reviewedBy = ?,
        reviewedAt = ?,
        reviewNotes = ?,
        rating = ?,
        updatedAt = ?
      WHERE id = ?`,
      reviewerId, new Date().toISOString(), reviewNotes, rating, new Date().toISOString(), id
    );

    await db.close();
    res.json({ success: true, message: 'Tarea aprobada correctamente' });

  } catch (error) {
    console.error('❌ Error aprobando tarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Rechazar tarea
app.patch('/api/tasks/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerId, reviewNotes, rejectionReasons } = req.body;

    const db = await getDB();
    await db.run(`
      UPDATE Task SET
        status = 'changes_requested',
        reviewStatus = 'rejected',
        reviewedBy = ?,
        reviewedAt = ?,
        reviewNotes = ?,
        rejectionReasons = ?,
        revisionCount = revisionCount + 1,
        updatedAt = ?
      WHERE id = ?`,
      reviewerId, new Date().toISOString(), reviewNotes, JSON.stringify(rejectionReasons || []),
      new Date().toISOString(), id
    );

    await db.close();
    res.json({ success: true, message: 'Tarea rechazada' });

  } catch (error) {
    console.error('❌ Error rechazando tarea:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});


// ==============================================
// 📂 ENDPOINTS PARA EL EDITOR DE CODIGO
// ==============================================

const scanDirectory = (dirPath, basePath = '') => {
  const items = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      items.push({
        name: entry.name,
        path: relativePath,
        type: 'folder',
        children: scanDirectory(fullPath, relativePath)
      });
    } else {
      const stat = fs.statSync(fullPath);
      items.push({
        name: entry.name,
        path: relativePath,
        type: 'file',
        size: stat.size,
        content: fs.readFileSync(fullPath, 'utf8')
      });
    }
  }
  
  return items;
};

// Obtener lista de archivos de un proyecto
app.get('/api/projects/:project/files', async (req, res) => {
  try {
    const { project } = req.params;
    const projectPath = path.join(__dirname, '../projects', project);
    
    if (!fs.existsSync(projectPath)) {
      return res.json([]);
    }
    
    const fileTree = scanDirectory(projectPath);
    res.json(fileTree);
  } catch (error) {
    console.error('❌ Error listando archivos:', error);
    res.status(500).json([]);
  }
});

// Guardar archivo
app.post('/api/projects/:project/files', async (req, res) => {
  try {
    const { project } = req.params;
    const { filename, content, filepath } = req.body;
    
    const filePathParam = filepath || filename;
    if (!filePathParam) {
      return res.status(400).json({ error: 'Filename or filepath required' });
    }
    
    const basePath = path.resolve(__dirname, '../projects/', project);
    const fullPath = path.resolve(basePath, filePathParam);
    
    if (!fullPath.startsWith(basePath)) {
      throw new Error('Ruta no autorizada');
    }
    
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`✅ Archivo guardado: ${project}/${filePathParam}`);
    res.json({ success: true, message: 'Archivo guardado correctamente' });
  } catch (error) {
    console.error('❌ Error guardando archivo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Eliminar archivo
app.delete('/api/projects/:project/files/:filename', async (req, res) => {
  try {
    const { project, filename } = req.params;
    const basePath = path.resolve(__dirname, '../projects/', project);
    const filePath = path.resolve(basePath, filename);
    
    if (!filePath.startsWith(basePath)) {
      throw new Error('Ruta no autorizada');
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    fs.unlinkSync(filePath);
    console.log(`🗑️ Archivo eliminado: ${project}/${filename}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando archivo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
✅ ✅ ✅ BACKEND MACPORTAFOLIO INICIADO!
🚀 Servidor corriendo en: http://localhost:${PORT}
📚 Base de datos: SQLite
🔄 100% compatible con el frontend actual
  `);
});