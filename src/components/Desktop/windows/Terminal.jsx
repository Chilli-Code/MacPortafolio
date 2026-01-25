// src/windows/Terminal.jsx
import { useState, useRef, useEffect } from 'react';
import WindowControls from "#components/Desktop/WindowControls";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { useTasksStore } from '#store/tasksStore';
import { useNotificationStore } from '#components/AchievementNotification';
import { TerminalIcon } from '#assets/icons';
import { createCommands } from '../../../utils/terminalCommands';
import useLocationStore from '#store/location';
import useWindowStore from '#store/window';
import { locations } from '#constants';

const Terminal = ({ isMaximized, setIsMaximized }) => {
  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();
  const [commandHistory, setCommandHistory] = useState([
    { type: 'system', text: 'Terminal de Tareas v1.0.0' },
    { type: 'system', text: 'Escribe "help" para ver comandos' }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isValidCommand, setIsValidCommand] = useState(false);
const [commandParts, setCommandParts] = useState({ cmd: '', args: '' });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [executedCommands, setExecutedCommands] = useState([]);
  const [lastLsInfo, setLastLsInfo] = useState(null); // ← NUEVO
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const terminalStateRef = useRef({
    currentPath: '~',
  });
    const validCommands = [
    'help', 'ls', 'cd', 'pwd', 'open', 'clear',
    'tasks', 'type', 'tasks fetch', 'tasks list', 'tasks accept',
    'type list', 'type set'
  ];

  const handleCommandChange = (value) => {
    setCurrentCommand(value);
    
    const trimmed = value.trim();
    const firstSpace = trimmed.indexOf(' ');
    
    if (firstSpace === -1) {
      // Solo comando, sin argumentos
      setCommandParts({ cmd: trimmed, args: '' });
    } else {
      // Comando con argumentos
      const cmd = trimmed.substring(0, firstSpace);
      const args = trimmed.substring(firstSpace);
      setCommandParts({ cmd, args });
    }
  };

    const isCommandValid = (cmd) => {
    const cmdLower = cmd.toLowerCase();
    return validCommands.includes(cmdLower) || 
           validCommands.some(valid => valid.startsWith(cmdLower));
  };


  const store = useTasksStore();
  const { addNotification } = useNotificationStore();

  const addToHistory = (text, type = 'output') => {
    setCommandHistory(prev => [...prev, { type, text }]);
  };

  // Helper para encontrar carpeta
  const findFolderByPath = (path, locations) => {
    if (path === '/' || path === '~') return { children: Object.values(locations) };

    const parts = path.split('/').filter(Boolean);
    let current = { children: Object.values(locations) };
    let found = null;

    for (const part of parts) {
      found = current.children.find(
        item => item.kind === 'folder' && item.name.toLowerCase() === part.toLowerCase()
      );
      if (!found) return null;
      current = found;
    }
    return found;
  };

  const commands = createCommands(
    store, 
    addToHistory, 
    addNotification,
    setActiveLocation,
    openWindow,
    terminalStateRef,
    setLastLsInfo
  );

  const executeCommand = async (cmd) => {
    const trimmedCmd = cmd.trim();
    
    if (trimmedCmd === 'clear') {
      setCommandHistory([
        { type: 'system', text: 'Terminal de Tareas v1.0.0' },
        { type: 'system', text: 'Escribe "help" para ver comandos' }
      ]);
      setLastLsInfo(null);
      return;
    }

    if (trimmedCmd === '') return;

    setExecutedCommands(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const currentPath = terminalStateRef.current.currentPath;
    addToHistory(`user@tasks:${currentPath}$ ${cmd}`, 'command');

    const parts = trimmedCmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const mainCmd = parts[0]?.toLowerCase();
    const args = parts.slice(1).map(arg => arg.replace(/^"(.*)"$/, '$1'));
    
    // ✅ FIX: Intentar comando compuesto primero (tasks fetch, type set, etc.)
    const fullCmd = `${mainCmd} ${args[0] || ''}`.trim();
    
    if (commands[fullCmd]) {
      // Es un comando compuesto (tasks fetch, type list, etc.)
      await commands[fullCmd](args.slice(1), locations);
    } else if (commands[mainCmd]) {
      // Es un comando simple (ls, cd, pwd, etc.)
      await commands[mainCmd](args, locations);
    } else {
      addToHistory(`bash: ${mainCmd}: comando no encontrado`, 'error');
    }
  };

const handleKeyDown = (e) => {
  // Enter - Ejecutar comando
  if (e.key === 'Enter' && currentCommand.trim()) {
    executeCommand(currentCommand);
    setCurrentCommand('');
    setCommandParts({ cmd: '', args: '' }); // Reset
    return;
  }

  // Flecha arriba
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (executedCommands.length === 0) return;
    
    const newIndex = historyIndex === -1 
      ? executedCommands.length - 1 
      : Math.max(0, historyIndex - 1);
    
    setHistoryIndex(newIndex);
    handleCommandChange(executedCommands[newIndex]);
    return;
  }

  // Flecha abajo
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex === -1) return;
    
    const newIndex = historyIndex + 1;
    
    if (newIndex >= executedCommands.length) {
      setHistoryIndex(-1);
      handleCommandChange('');
    } else {
      setHistoryIndex(newIndex);
      handleCommandChange(executedCommands[newIndex]);
    }
    return;
  }

  // Tab - Autocompletado mejorado
  if (e.key === 'Tab') {
    e.preventDefault();
    
    const parts = currentCommand.trim().split(' ');
    const cmd = parts[0];
    const argFull = parts.slice(1).join(' ');

    if (cmd !== 'cd' && cmd !== 'open') return;

    // ✅ Soporte para rutas anidadas: cd Trabajo/Food
    const pathParts = argFull.split('/');
    const pathToNavigate = pathParts.slice(0, -1).join('/'); // "Trabajo"
    const toComplete = pathParts[pathParts.length - 1]; // "Food"

    let currentPath = terminalStateRef.current.currentPath;
    
    // Si hay partes de ruta, navegarlas
    if (pathToNavigate) {
      const pathPartsArray = pathToNavigate.split('/').filter(Boolean);
      let tempFolder = currentPath === '~'
        ? { children: Object.values(locations) }
        : findFolderByPath(currentPath, locations);

      for (const part of pathPartsArray) {
        if (!tempFolder || !tempFolder.children) return;
        
        const found = tempFolder.children.find(
          item => item.kind === 'folder' && item.name.toLowerCase() === part.toLowerCase()
        );
        
        if (!found) return;
        tempFolder = found;
      }
      
      // Buscar coincidencias en la subcarpeta
      const matches = tempFolder.children
        .filter(item => {
          if (cmd === 'cd' && item.kind !== 'folder') return false;
          return item.name.toLowerCase().startsWith(toComplete.toLowerCase());
        })
        .map(f => f.name);

      if (matches.length === 0) return;
      
      if (matches.length === 1) {
        const completed = matches[0].includes(' ') ? `"${matches[0]}"` : matches[0];
        const fullPath = pathToNavigate ? `${pathToNavigate}/${completed}` : completed;
        handleCommandChange(`${cmd} ${fullPath}`);
      } else {
        // Mostrar opciones
        addToHistory(matches.join('  '), 'info');
        
        // Autocompletar prefijo común
        const commonPrefix = matches.reduce((acc, name) => {
          let i = 0;
          while (i < acc.length && i < name.length && acc[i].toLowerCase() === name[i].toLowerCase()) {
            i++;
          }
          return acc.substring(0, i);
        });
        
        if (commonPrefix.length > toComplete.length) {
          const completed = commonPrefix.includes(' ') ? `"${commonPrefix}"` : commonPrefix;
          const fullPath = pathToNavigate ? `${pathToNavigate}/${completed}` : completed;
          handleCommandChange(`${cmd} ${fullPath}`);
        }
      }
    } else {
      // Sin ruta anidada, buscar en carpeta actual
      const folder = currentPath === '~'
        ? { children: Object.values(locations) }
        : findFolderByPath(currentPath, locations);

      if (!folder || !folder.children) return;

      const matches = folder.children
        .filter(item => {
          if (cmd === 'cd' && item.kind !== 'folder') return false;
          return item.name.toLowerCase().startsWith(toComplete.toLowerCase());
        })
        .map(f => f.name);

      if (matches.length === 0) return;
      
      if (matches.length === 1) {
        const completed = matches[0].includes(' ') ? `"${matches[0]}"` : matches[0];
        handleCommandChange(`${cmd} ${completed}`);
      } else {
        addToHistory(matches.join('  '), 'info');
        
        const commonPrefix = matches.reduce((acc, name) => {
          let i = 0;
          while (i < acc.length && i < name.length && acc[i].toLowerCase() === name[i].toLowerCase()) {
            i++;
          }
          return acc.substring(0, i);
        });
        
        if (commonPrefix.length > toComplete.length) {
          const completed = commonPrefix.includes(' ') ? `"${commonPrefix}"` : commonPrefix;
          handleCommandChange(`${cmd} ${completed}`);
        }
      }
    }
  }
};

  const lineColors = {
    command: 'text-green-400',
    success: 'text-green-300',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-300',
    system: 'text-gray-400',
       folder: 'text-blue-400 font-bold text-base',  // ← NUEVO: Carpetas en azul
    file: 'text-gray-300'                    // ← NUEVO: Archivos en gris
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getPromptPath = () => {
    const path = terminalStateRef.current.currentPath;
    if (path === '~' || path === '/') return path;
    
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 2) {
      return `~/${parts[parts.length - 1]}`;
    }
    return path;
  };

  return (
    <div className="flex flex-col h-full">
      <div id="window-header" className="flex-shrink-0">
        <WindowControls target="terminal" onMaximize={() => setIsMaximized(!isMaximized)} />
        <h2 className="flex items-center gap-2 justify-center">
          <TerminalIcon className="w-4 h-4" />
          Terminal de Tareas
          {store.hasNewTasks && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </h2>
      </div>

      <div className="flex-1 bg-gray-900 flex flex-col font-mono text-sm overflow-hidden">
    <div className="flex-1 p-4 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
          <div className="space-y-1">
            {commandHistory.map((line, i) => (
              <div key={i} className={`${lineColors[line.type] || 'text-gray-300'} leading-relaxed whitespace-pre-wrap`}>
                {line.text}
              </div>
            ))}
          </div>
          
          {/* Prompt con comando coloreado */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400 font-bold">user@tasks</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">{getPromptPath()}</span>
            <span className="text-green-400">$</span>
            
            {/* Input invisible para capturar texto */}
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => handleCommandChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 w-0"
              autoFocus
            />
            
            {/* Display con colores separados */}
{/* Display con colores separados */}
<div className="flex-1 cursor-text" onClick={() => inputRef.current?.focus()}>
  {currentCommand ? (
    <>
      {/* Comando en verde/rojo */}
      <span className={
        isCommandValid(commandParts.cmd)
          ? 'text-green-300'
          : 'text-red-300'
      }>
        {commandParts.cmd}
      </span>
      {/* Argumentos en cyan */}
      <span className="text-cyan-300">
        {commandParts.args}
      </span>
      {/* Cursor - SOLO cuando hay texto */}
      <span className="text-green-400 animate-pulse">▌</span>
    </>
  ) : (
    <>
      <span className="text-gray-500"></span>
      {/* Cursor cuando NO hay texto - SIN parpadeo */}
      <span className="text-green-400">▌</span>
    </>
  )}
</div>
          </div>
          <div ref={terminalEndRef} />
        </div>



        <div className="flex-shrink-0 bg-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between border-t border-gray-700">
          <div className="flex items-center gap-4">
            <span>Tipo: <span className="text-blue-400 font-semibold">{store.userType}</span></span>
            <span>Tareas: <span className="text-green-400">{store.tasks.length}</span></span>
            {store.hasNewTasks && <span className="text-yellow-400 animate-pulse">● Nuevas</span>}
            
            {lastLsInfo && (
              <>
                <span className="text-gray-600">|</span>
                <span className="text-gray-500">
                  {lastLsInfo.total} items ({lastLsInfo.folders} carpetas, {lastLsInfo.files} archivos)
                </span>
              </>
            )}
          </div>
          <span>↑↓ Historial | Tab Autocompletar</span>
        </div>
      </div>
    </div>
  );
};

export default WindowWrapper(Terminal, "terminal");