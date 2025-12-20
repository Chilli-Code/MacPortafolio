// src/components/Safari/EmptyState.jsx
import { Clock, Terminal as TerminalIcon, CheckCircle, XCircle } from '#assets/icons';

const EmptyState = ({ type }) => {
  const states = {
    'no-fetch': {
      icon: TerminalIcon,
      title: 'Conecta con la Terminal',
      description: 'Abre la Terminal y ejecuta el comando para obtener tus tareas.',
      code: 'tasks fetch',
      color: 'from-blue-400 to-purple-500'
    },
    'available': {
      icon: Clock,
      title: 'No hay tareas disponibles',
      description: 'Cambia tu rol con',
      code: 'role set frontend',
      color: 'from-gray-400 to-gray-500'
    },
    'in_progress': {
      icon: Clock,
      title: 'No tienes tareas en progreso',
      description: 'Acepta una tarea disponible para comenzar',
      color: 'from-orange-400 to-red-500'
    },
    'rejected': {
      icon: XCircle,
      title: 'No tienes tareas rechazadas',
      description: 'Las tareas rechazadas aparecerán aquí para que puedas corregirlas',
      color: 'from-red-400 to-pink-500'
    },
    'completed': {
      icon: CheckCircle,
      title: 'No tienes tareas completadas',
      description: 'Las tareas finalizadas aparecerán aquí',
      color: 'from-green-400 to-emerald-500'
    }
  };

  const state = states[type] || states['no-fetch'];
  const Icon = state.icon;

  return (
    <div className="text-center py-20">
      <div className={`w-20 h-20 bg-gradient-to-br ${state.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
        <Icon className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {state.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {state.description}
      </p>
      {state.code && (
        <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 max-w-md mx-auto border border-gray-700">
          <p className="text-green-400 font-mono text-sm mb-2">user@tasks ~ $</p>
          <p className="text-white font-mono text-lg">{state.code}</p>
        </div>
      )}
    </div>
  );
};

export default EmptyState;