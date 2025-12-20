// src/utils/terminalCommands.js

export const createCommands = (store, addToHistory, addNotification) => {
  const { 
    tasks, 
    userType, 
    availableTypes,
    fetchTasks, 
    setUserType,
    acceptTask 
  } = store;

  return {
    help: () => {
      addToHistory('Comandos disponibles:', 'success');
      addToHistory('  tasks fetch          - Obtener tareas según tu tipo');
      addToHistory('  tasks list           - Ver todas tus tareas');
      addToHistory('  tasks accept <id>    - Aceptar una tarea');
      addToHistory('  type                 - Ver tu tipo actual');
      addToHistory('  type set <tipo>      - Cambiar tu tipo');
      addToHistory('  type list            - Ver tipos disponibles');
      addToHistory('  clear                - Limpiar terminal');
      addToHistory('  help                 - Mostrar esta ayuda');
    },

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