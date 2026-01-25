// src/utils/terminalCommands.js
import { 
  Folder, 
  FileText, 
  FileCode, 
  Image, 
  FileJson,
  Globe,
  Palette,
  File
} from 'lucide-react';



export const createCommands = (
  store,
  addToHistory,
  addNotification,
  setActiveLocation,
  openWindow,
  terminalStateRef,
  setLastLsInfo
) => {
  const { 
    tasks, 
    userType, 
    availableTypes,
    fetchTasks, 
    setUserType,
    acceptTask 
  } = store;

  // 🆕 Estado interno de la terminal para navegación
const getPath = () => terminalStateRef.current.currentPath;
const setPath = (path) => {
  terminalStateRef.current.currentPath = path;
};

const getFileIcon = (item) => {
  return ''; // Sin iconos
};


  // 🆕 Función helper para encontrar carpeta por path
const findFolderByPath = (path, locations) => {
  if (path === '/' || path === '~') return { children: Object.values(locations) };

  const parts = path.split('/').filter(Boolean); // ["Trabajo", "Food Delivery App"]
  let current = { children: Object.values(locations) };
  let found = null;

  for (const part of parts) {
    found = current.children.find(
      item =>
        item.kind === 'folder' &&
        item.name.toLowerCase() === part.toLowerCase()
    );

    if (!found) return null;
    current = found;
  }

  return found;
};



  return {
    help: () => {
      addToHistory('Comandos disponibles:', 'success');
      addToHistory('');
      addToHistory('📂 NAVEGACIÓN:', 'info');
      addToHistory('  ls                   - Listar archivos/carpetas');
      addToHistory('  cd <carpeta>         - Cambiar directorio');
      addToHistory('  pwd                  - Ver directorio actual');
      addToHistory('  open <archivo>       - Abrir archivo');
      addToHistory('');
      addToHistory('📋 TAREAS:', 'info');
      addToHistory('  tasks fetch          - Obtener tareas');
      addToHistory('  tasks list           - Ver tareas');
      addToHistory('  tasks accept <id>    - Aceptar tarea');
      addToHistory('');
      addToHistory('👤 PERFIL:', 'info');
      addToHistory('  type                 - Ver tipo actual');
      addToHistory('  type set <tipo>      - Cambiar tipo');
      addToHistory('  type list            - Ver tipos');
      addToHistory('');
      addToHistory('  clear                - Limpiar terminal');
    },

    // 🆕 LISTAR ARCHIVOS
ls: (args, locations) => {
  const currentPath = getPath();

  const folder = currentPath === '~'
    ? { children: Object.values(locations) }
    : findFolderByPath(currentPath, locations);

  if (!folder || !folder.children) {
    addToHistory('Directorio vacío', 'warning');
    setLastLsInfo(null);
    return;
  }

  const folders = folder.children.filter(item => item.kind === 'folder');
  const files = folder.children.filter(item => item.kind === 'file');

  const formatItems = (items) => {
    if (items.length === 0) return [];
    
    const maxLength = Math.max(...items.map(item => item.name.length));
    const columnWidth = maxLength + 4;
    const terminalWidth = 80;
    const columns = Math.floor(terminalWidth / columnWidth);
    
    const rows = Math.ceil(items.length / columns);
    const formatted = [];
    
    for (let row = 0; row < rows; row++) {
      let line = '';
      for (let col = 0; col < columns; col++) {
        const index = row + col * rows;
        if (index < items.length) {
          const item = items[index];
          const name = item.name.padEnd(columnWidth);
          line += name; // ← SIN [DIR]
        }
      }
      formatted.push(line.trimEnd());
    }
    
    return formatted;
  };

  // Mostrar carpetas primero (en azul)
  if (folders.length > 0) {
    formatItems(folders).forEach(line => addToHistory(line, 'folder'));
  }

  // Luego archivos (en gris)
  if (files.length > 0) {
    if (folders.length > 0) addToHistory(''); // Espacio entre carpetas y archivos
    formatItems(files).forEach(line => addToHistory(line, 'file'));
  }

  // ✅ GUARDAR INFO EN EL FOOTER (no mostrar en output)
  setLastLsInfo({
    total: folder.children.length,
    folders: folders.length,
    files: files.length
  });

  // ❌ NO AGREGAR ESTO AL HISTORIAL:
  // addToHistory('');
  // addToHistory(`${total} items total...`, 'system');
},





    // 🆕 CAMBIAR DIRECTORIO
// En terminalCommands.js - actualiza el comando cd:

cd: (args, locations) => {
  let target = args[0];
  const currentPath = getPath();

  if (!target) {
    addToHistory('❌ Uso: cd <carpeta>', 'error');
    return;
  }

  // ✅ Limpiar comillas del target completo
  target = target.replace(/^["']|["']$/g, '');

  // cd ~ o cd / - ir a raíz
  if (target === '/' || target === '~') {
    setPath('~');
    addToHistory('📂 ~', 'success');
    return;
  }

  // cd .. - retroceder
  if (target === '..') {
    if (currentPath === '~' || currentPath === '/') {
      addToHistory('📂 Ya estás en la raíz', 'warning');
      return;
    }
    
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const newPath = parts.length === 0 ? '~' : `/${parts.join('/')}`;
    setPath(newPath);
    addToHistory(`📂 ${newPath}`, 'success');
    return;
  }

  // ✅ Soporte para rutas anidadas con limpieza de comillas
  const pathParts = target.split('/').filter(Boolean).map(part => 
    part.replace(/^["']|["']$/g, '') // Limpiar comillas de cada parte
  );
  
  let currentFolder = currentPath === '~'
    ? { children: Object.values(locations) }
    : findFolderByPath(currentPath, locations);

  if (!currentFolder || !currentFolder.children) {
    addToHistory('❌ Directorio inválido', 'error');
    return;
  }

  let finalPath = currentPath;
  
  // Navegar por cada parte de la ruta
  for (const part of pathParts) {
    const folder = currentFolder.children.find(
      item => item.kind === 'folder' && item.name.toLowerCase() === part.toLowerCase()
    );

    if (!folder) {
      addToHistory(`❌ Carpeta "${part}" no encontrada en ${finalPath}`, 'error');
      return;
    }

    finalPath = finalPath === '~' ? `/${folder.name}` : `${finalPath}/${folder.name}`;
    currentFolder = folder;
  }

  setPath(finalPath);
  addToHistory(`📂 ${finalPath}`, 'success');
},




    // 🆕 VER DIRECTORIO ACTUAL
pwd: () => {
  addToHistory(`📂 ${getPath()}`, 'info');
},

open: (args, locations) => {
  const currentPath = terminalStateRef.current.currentPath;
  const folder = findFolderByPath(currentPath, locations);

  if (!folder || !folder.children) {
    addToHistory('❌ Carpeta vacía', 'error');
    return;
  }

  const files = folder.children.filter(f => f.kind === 'file');

  if (files.length === 0) {
    addToHistory('❌ No hay archivos', 'error');
    return;
  }

  // 🎯 Definir qué archivos puede editar según la tarea
  const editableFiles = files
    .filter(f => ['js', 'jsx', 'css', 'html'].includes(f.fileType))
    .map(f => f.name);

  openWindow('codeeditor', {
    projectName: folder.name,
    folderFiles: files,
    editableFiles: editableFiles, // ← Solo estos puede editar
    currentFile: files[0],
  });

  addToHistory(`💻 Abriendo proyecto: ${folder.name}`, 'success');
  addToHistory(`✅ Archivos editables: ${editableFiles.length}`, 'info');
},







    // Comandos existentes...
    'tasks fetch': async () => {
      addToHistory('🔄 Conectando al servidor...', 'info');
      
      try {
        const fetchedTasks = await fetchTasks();
        
        if (fetchedTasks && fetchedTasks.length > 0) {
          addToHistory(`✅ ${fetchedTasks.length} tareas encontradas para tipo: ${userType}`, 'success');
          addToHistory('Abre Safari para ver las tareas o usa "tasks list"', 'info');
        } else {
          addToHistory('⚠️  No hay tareas disponibles para tu tipo', 'warning');
        }
      } catch (error) {
        addToHistory('❌ Error al conectar con el servidor', 'error');
      }
    },

    'tasks list': () => {
      if (!tasks || tasks.length === 0) {
        addToHistory('No tienes tareas. Usa "tasks fetch" para obtenerlas', 'warning');
        return;
      }

      addToHistory(`📋 Tareas disponibles (${tasks.length}):`, 'success');
      addToHistory('─'.repeat(80));
      
      tasks.forEach(task => {
        const statusEmoji = {
          available: '🆕',
          in_progress: '⏳',
          pending_review: '👀',
          completed: '✅',
          rejected: '❌'
        }[task.status] || '📋';
        
        addToHistory(`${statusEmoji} ID: ${task.id} | ${task.title}`);
        addToHistory(`   💼 Tipo: ${task.type} | 🎯 ${task.difficulty} | ⭐ ${task.xp} XP | 💰 $${task.reward}`);
        addToHistory(`   📝 ${task.description}`);
        addToHistory(`   📅 Deadline: ${task.deadline}`);
        addToHistory('─'.repeat(80));
      });
    },

    'tasks accept': async (args) => {
      const taskId = parseInt(args[0]);
      
      if (!taskId) {
        addToHistory('❌ Especifica el ID: tasks accept 1', 'error');
        return;
      }

      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        addToHistory(`❌ Tarea #${taskId} no encontrada`, 'error');
        return;
      }

      if (task.status !== 'available') {
        addToHistory(`⚠️  Esta tarea ya está en estado: ${task.status}`, 'warning');
        return;
      }

      try {
        const currentUser = JSON.parse(localStorage.getItem('userSession'));
        await acceptTask(taskId, currentUser.id);
        
        addToHistory(`✅ Tarea "${task.title}" aceptada!`, 'success');
        addToHistory(`💰 Recompensa: $${task.reward} | ⭐ XP: ${task.xp}`, 'info');
        
        addNotification({
          type: 'task',
          category: 'Tarea Aceptada',
          title: task.title,
          description: `Recompensa: $${task.reward}`,
          xp: 25
        });
      } catch (error) {
        addToHistory('❌ Error al aceptar la tarea', 'error');
      }
    },

    type: () => {
      addToHistory(`👤 Tu tipo actual: ${userType}`, 'info');
      addToHistory('Usa "type set <tipo>" para cambiar', 'info');
    },

    'type list': () => {
      addToHistory('📋 Tipos disponibles:', 'success');
      availableTypes.forEach(type => {
        const current = type === userType ? ' ⭐ (actual)' : '';
        addToHistory(`  - ${type}${current}`);
      });
    },

    'type set': (args) => {
      const newType = args[0];
      
      if (!newType) {
        addToHistory('❌ Especifica un tipo: type set frontend', 'error');
        return;
      }

      if (!availableTypes.includes(newType)) {
        addToHistory(`❌ Tipo "${newType}" no válido`, 'error');
        addToHistory('Usa "type list" para ver tipos disponibles', 'info');
        return;
      }

      setUserType(newType);
      addToHistory(`✅ Tipo cambiado a: ${newType}`, 'success');
      addToHistory('Ejecuta "tasks fetch" para obtener nuevas tareas', 'info');
    },

    clear: (setCommandHistory) => {
      setCommandHistory([{ type: 'system', text: 'Terminal limpiada' }]);
    }
  };
};