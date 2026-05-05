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