import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send } from 'lucide-react';
import MobileNav from '#Mobile/MobileNav';
import {useTasksStore} from '#store/tasksStore'; // Asegúrate de tener este store
import { useNotificationStore } from '#components/AchievementNotification';


const TerminalScreen = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([
    { type: 'system', text: 'Terminal Mobile v1.0' },
    { type: 'system', text: 'Escribe "help" para ver comandos disponibles' },
  ]);
  const scrollRef = useRef(null);
  
  const taskStore = useTasksStore();
  const { addNotification } = useNotificationStore();

  const addToHistory = (text, type = 'output') => {
    setCommandHistory(prev => [...prev, { type, text }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const createCommands = () => {
    const { 
      tasks, 
      userType, 
      availableTypes,
      fetchTasks, 
      setUserType,
      acceptTask 
    } = taskStore;

    return {
      help: () => {
        addToHistory('📱 Comandos disponibles:', 'success');
        addToHistory('  tasks fetch          - Obtener tareas disponibles');
        addToHistory('  tasks list           - Ver todas tus tareas');
        addToHistory('  tasks accept <id>    - Aceptar una tarea');
        addToHistory('  type                 - Ver tu tipo actual');
        addToHistory('  type set <tipo>      - Cambiar tu tipo');
        addToHistory('  type list            - Ver tipos disponibles');
        addToHistory('  clear                - Limpiar terminal');
        addToHistory('  help                 - Mostrar esta ayuda');
      },

      'tasks fetch': async () => {
        addToHistory('🔄 Buscando tareas disponibles...', 'info');
        
        try {
          const fetchedTasks = await fetchTasks();
          
          if (fetchedTasks && fetchedTasks.length > 0) {
            addToHistory(`✅ ${fetchedTasks.length} tareas encontradas para tipo: ${userType}`, 'success');
            addToHistory('📱 Abre Safari para ver las tareas', 'info');
          } else {
            addToHistory('⚠️  No hay tareas disponibles para tu tipo', 'warning');
          }
        } catch (error) {
          addToHistory('❌ Error al conectar con el servidor', 'error');
        }
      },

      'tasks list': () => {
        const availableTasks = tasks.filter(t => t.status === 'available');
        
        if (!availableTasks || availableTasks.length === 0) {
          addToHistory('No tienes tareas. Usa "tasks fetch"', 'warning');
          return;
        }

        addToHistory(`📋 Tareas disponibles (${availableTasks.length}):`, 'success');
        addToHistory('─'.repeat(40));
        
        availableTasks.forEach(task => {
          addToHistory(`🆕 ID: ${task.id} | ${task.title}`);
          addToHistory(`   💼 ${task.type} | 🎯 ${task.difficulty}`);
          addToHistory(`   ⭐ ${task.xp} XP | 💰 $${task.reward}`);
          addToHistory(`   📅 ${task.deadline}`);
          addToHistory('─'.repeat(40));
        });
      },

      'tasks accept': async (args) => {
        const taskId = parseInt(args[0]);
        
        if (!taskId) {
          addToHistory('❌ Uso: tasks accept <id>', 'error');
          return;
        }

        const task = tasks.find(t => t.id === taskId);
        
        if (!task) {
          addToHistory(`❌ Tarea #${taskId} no encontrada`, 'error');
          return;
        }

        if (task.status !== 'available') {
          addToHistory(`⚠️  Tarea en estado: ${task.status}`, 'warning');
          return;
        }

        try {
          const currentUser = JSON.parse(localStorage.getItem('userSession'));
          await acceptTask(taskId, currentUser.id);
          
          addToHistory(`✅ Tarea "${task.title}" aceptada!`, 'success');
          addToHistory(`💰 $${task.reward} | ⭐ ${task.xp} XP`, 'info');
          
          addNotification({
            type: 'task',
            category: 'Tarea Aceptada',
            title: task.title,
            description: `Recompensa: $${task.reward}`,
            xp: 25
          });
        } catch (error) {
          addToHistory('❌ Error al aceptar tarea', 'error');
        }
      },

      type: () => {
        addToHistory(`👤 Tipo actual: ${userType}`, 'info');
        addToHistory('Usa "type set <tipo>" para cambiar', 'info');
      },

      'type list': () => {
        addToHistory('📋 Tipos disponibles:', 'success');
        availableTypes.forEach(type => {
          const current = type === userType ? ' ⭐' : '';
          addToHistory(`  - ${type}${current}`);
        });
      },

      'type set': (args) => {
        const newType = args[0];
        
        if (!newType) {
          addToHistory('❌ Uso: type set <tipo>', 'error');
          return;
        }

        if (!availableTypes.includes(newType)) {
          addToHistory(`❌ Tipo "${newType}" no válido`, 'error');
          addToHistory('Usa "type list"', 'info');
          return;
        }

        setUserType(newType);
        addToHistory(`✅ Tipo → ${newType}`, 'success');
        addToHistory('Ejecuta "tasks fetch"', 'info');
      },

      clear: () => {
        setCommandHistory([
          { type: 'system', text: 'Terminal limpiada' }
        ]);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    addToHistory(`$ ${trimmedInput}`, 'input');
    
    const [command, ...args] = trimmedInput.split(' ');
    const commands = createCommands();
    
    const commandKey = Object.keys(commands).find(key => {
      const parts = key.split(' ');
      const inputParts = trimmedInput.split(' ').slice(0, parts.length);
      return parts.join(' ') === inputParts.join(' ');
    });

    if (commandKey) {
      const remainingArgs = trimmedInput.split(' ').slice(commandKey.split(' ').length);
      commands[commandKey](remainingArgs);
    } else {
      addToHistory(`❌ Comando no reconocido: ${command}`, 'error');
      addToHistory('Escribe "help" para ver comandos', 'info');
    }

    setInput('');
  };

  const getLineColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'input': return 'text-purple-500 font-semibold';
      case 'system': return 'text-gray-500 italic';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <MobileNav 
        title="Terminal"
        onBack={onBack}
        showCancel={false}
      />

      {/* Terminal Output */}
      <div 
        ref={scrollRef}
        className=" bg-[#cbcbcb45] overflow-y-scroll px-4 py-4 font-mono text-sm"
      >
        {commandHistory.map((line, i) => (
          <div key={i} className={`mb-1 ${getLineColor(line.type)}`}>
            {line.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-800 px-4 py-3 flex items-center gap-2">
        <span className="text-green-500 font-mono">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un comando..."
          className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-gray-600"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded-lg active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default TerminalScreen;