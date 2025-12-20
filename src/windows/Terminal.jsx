// src/windows/Terminal.jsx
import { useState, useRef, useEffect } from 'react';
import WindowControls from "#components/WindowControls";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { useTasksStore } from '#store/tasksStore';
import { useNotificationStore } from '#components/AchievementNotification';
import { TerminalIcon, ChevronRight } from '#assets/icons';
import { createCommands } from '../utils/terminalCommands';

const Terminal = ({ isMaximized, setIsMaximized }) => {
  const [commandHistory, setCommandHistory] = useState([
    { type: 'system', text: 'Terminal de Tareas v1.0.0' },
    { type: 'system', text: 'Escribe "help" para ver comandos' }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const store = useTasksStore();
  const { addNotification } = useNotificationStore();

  const addToHistory = (text, type = 'output') => {
    setCommandHistory(prev => [...prev, { type, text }]);
  };

  const executeCommand = async (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    addToHistory(`$ ${cmd}`, 'command');

    const commands = createCommands(store, addToHistory, addNotification);
    
    // Parsear comando
    const [mainCmd, ...args] = trimmedCmd.split(' ');
    const fullCmd = `${mainCmd}${args.length > 0 && args[0] ? ' ' + args[0] : ''}`;

    // Ejecutar
    if (commands[fullCmd]) {
      await commands[fullCmd](args.slice(1));
    } else if (commands[mainCmd]) {
      await commands[mainCmd](args);
    } else if (trimmedCmd === '') {
      return;
    } else if (trimmedCmd === 'clear') {
      commands.clear(setCommandHistory);
    } else {
      addToHistory(`Comando no reconocido: ${trimmedCmd}`, 'error');
      addToHistory('Escribe "help" para ver comandos', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const lineColors = {
    command: 'text-green-400',
    success: 'text-green-300',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-300',
    system: 'text-gray-400'
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        <div className="flex-1 p-4 space-y-1 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
          {commandHistory.map((line, i) => (
            <div key={i} className={`${lineColors[line.type] || 'text-gray-300'} leading-relaxed`}>
              {line.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <div className="flex-shrink-0">
          <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400 flex items-center gap-1">
                <span className="font-bold">user@tasks</span>
                <ChevronRight className="w-4 h-4" />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                className="flex-1 bg-transparent text-gray-300 outline-none"
                placeholder="Escribe un comando..."
                autoFocus
              />
            </div>
          </form>

          <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between border-t border-gray-700">
            <div className="flex items-center gap-4">
              <span>Tipo: <span className="text-blue-400 font-semibold">{store.userType}</span></span>
              <span>Tareas: <span className="text-green-400">{store.tasks.length}</span></span>
              {store.hasNewTasks && <span className="text-yellow-400 animate-pulse">● Nuevas tareas</span>}
            </div>
            <span>Escribe "help"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowWrapper(Terminal, "terminal");