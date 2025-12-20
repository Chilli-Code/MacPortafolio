// src/components/Safari/TaskTabs.jsx
import { Clipboard, Clock, XCircle, CheckCircle } from '#assets/icons';

const TaskTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { 
      id: 'available', 
      label: 'Disponibles', 
      count: counts.available,
      icon: <Clipboard className="w-4 h-4 text-blue-500" />
    },
    { 
      id: 'in_progress', 
      label: 'En Progreso', 
      count: counts.inProgress,
      icon: <Clock className="w-4 h-4 text-orange-400" />
    },
    { 
      id: 'rejected', 
      label: 'Rechazadas', 
      count: counts.rejected,
      icon: <XCircle className="w-4 h-4 text-red-600" />
    },
    { 
      id: 'completed', 
      label: 'Completadas', 
      count: counts.completed,
      icon: <CheckCircle className="w-4 h-4 text-green-600" />
    }
  ];

  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {/* Icono al lado del texto */}
          {tab.icon}
          <span>{tab.label}</span>
          
          {/* Contador con badge */}
          {tab.count > 0 && (
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              activeTab === tab.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TaskTabs;