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
import { terminalThemes, terminalThemeList } from '#constants/terminalThemes';
import { useAppSettingsStore } from '#store/appSettingsStore';

// Genera una tabla con bordes box-drawing (estilo termcn) a partir de columnas y filas.
const buildTable = (columns, rows) => {
  const cell = (r, i) => String(r[i] ?? '');
  const widths = columns.map((col, i) =>
    Math.max(col.header.length, ...rows.map(r => cell(r, i).length))
  );

  const pad = (s, w) => String(s).padEnd(w, ' ');
  const border = (left, mid, right) =>
    left + widths.map(w => '─'.repeat(w + 2)).join(mid) + right;
  const rowStr = (cells) =>
    '│' + cells.map((c, i) => ' ' + pad(c, widths[i]) + ' ').join('│') + '│';

  const lines = [];
  lines.push(border('╭', '┬', '╮'));
  lines.push(rowStr(columns.map(c => c.header)));
  lines.push(border('├', '┼', '┤'));
  rows.forEach(r => lines.push(rowStr(columns.map((c, i) => cell(r, i)))));
  lines.push(border('╰', '┴', '╯'));
  return lines.join('\n');
};



export const createCommands = (
  store,
  addToHistory,
  addNotification,
  setActiveLocation,
  openWindow,
  terminalStateRef,
  setLastLsInfo,
  replaceLastLine,
  setTerminalTheme
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
      addToHistory('Comandos disponibles:', 'heading');
      addToHistory('');
      addToHistory('📂 NAVEGACIÓN', 'heading');
      addToHistory('  ls                   Listar archivos/carpetas');
      addToHistory('  cd <carpeta>         Cambiar directorio');
      addToHistory('  pwd                  Ver directorio actual');
      addToHistory('  open <archivo>       Abrir archivo');
      addToHistory('');
      addToHistory('📋 TAREAS', 'heading');
      addToHistory('  tasks fetch           Obtener tareas');
      addToHistory('  tasks list            Ver tareas');
      addToHistory('  tasks accept <id>     Aceptar tarea');
      addToHistory('');
      addToHistory('👤 PERFIL', 'heading');
      addToHistory('  type                  Ver tipo actual');
      addToHistory('  type set <tipo>       Cambiar tipo');
      addToHistory('  type list             Ver tipos');
      addToHistory('');
      addToHistory('  clear                 Limpiar terminal');
    },

    // 🆕 CAMBIAR TEMA DE LA TERMINAL (paletas de termcn)
    theme: (args) => {
      const sub = (args[0] || '').toLowerCase();

      if (sub === 'list' || sub === '') {
        const current = useAppSettingsStore.getState().terminalTheme;
        addToHistory('🎨 Temas disponibles:', 'heading');
        terminalThemeList.forEach(({ value, label }) => {
          const mark = value === current ? ' ⭐ (actual)' : '';
          addToHistory(`  ${value.padEnd(20)} ${label}${mark}`);
        });
        addToHistory('');
        addToHistory('Usa: theme <nombre>   (ej. theme nord)', 'info');
        return;
      }

      if (terminalThemes[sub]) {
        setTerminalTheme(sub);
        addToHistory(`✅ Tema cambiado a: ${terminalThemes[sub].label}`, 'success');
      } else {
        addToHistory(`❌ Tema "${sub}" no encontrado`, 'error');
        addToHistory('Usa "theme list" para ver los disponibles', 'info');
      }
    },

    // 🆕 LISTAR ARCHIVOS
    ls: (args, locations) => {
      const currentPath = getPath();

      const folder = currentPath === '~'
        ? { children: Object.values(locations) }
        : findFolderByPath(currentPath, locations);

      if (!folder || !folder.children || folder.children.length === 0) {
        addToHistory('Directorio vacío', 'warning');
        setLastLsInfo(null);
        return;
      }

      const folders = folder.children.filter(item => item.kind === 'folder');
      const files = folder.children.filter(item => item.kind === 'file');

      const rows = [
        ...folders.map(f => ['📁', f.name]),
        ...files.map(f => ['📄', f.name]),
      ];

      const table = buildTable(
        [{ header: 'Tipo' }, { header: 'Nombre' }],
        rows
      );

      addToHistory(table, 'table');

      // ✅ GUARDAR INFO EN EL FOOTER (no mostrar en output)
      setLastLsInfo({
        total: folder.children.length,
        folders: folders.length,
        files: files.length
      });
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
      addToHistory('🔄 Conectando al servidor...', 'spinner');
      
      try {
        const fetchedTasks = await fetchTasks();
        
        if (fetchedTasks && fetchedTasks.length > 0) {
          replaceLastLine(`✅ ${fetchedTasks.length} tareas encontradas para tipo: ${userType}`, 'alert-success');
          addToHistory('Abre Safari para ver las tareas o usa "tasks list"', 'info');
        } else {
          replaceLastLine('⚠️  No hay tareas disponibles para tu tipo', 'alert-warning');
        }
      } catch (error) {
        replaceLastLine('❌ Error al conectar con el servidor', 'alert-error');
      }
    },

    'tasks list': () => {
      if (!tasks || tasks.length === 0) {
        addToHistory('No tienes tareas. Usa "tasks fetch" para obtenerlas', 'warning');
        return;
      }

      addToHistory(`📋 Tareas disponibles (${tasks.length}):`, 'heading');

      const statusEmoji = {
        available: '🆕',
        in_progress: '⏳',
        pending_review: '👀',
        completed: '✅',
        rejected: '❌'
      };

      const rows = tasks.map(task => [
        String(task.id),
        statusEmoji[task.status] || '📋',
        task.title,
        task.type,
        task.difficulty,
        String(task.xp),
        `$${task.reward}`,
        task.deadline,
      ]);

      const table = buildTable(
        [
          { header: 'ID' }, { header: 'Estado' }, { header: 'Título' },
          { header: 'Tipo' }, { header: 'Dificultad' }, { header: 'XP' },
          { header: 'Recompensa' }, { header: 'Deadline' },
        ],
        rows
      );

      addToHistory(table, 'table');
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
  };
};