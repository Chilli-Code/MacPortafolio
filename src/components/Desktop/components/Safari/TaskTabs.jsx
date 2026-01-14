import { Clipboard, Clock, XCircle, CheckCircle, Eye, Plus } from '#assets/icons';

const TaskTabs = ({ activeTab, onTabChange, counts = {}, onAddTab, onCloseTab, tabs: propTabs = [] }) => {

  // Mapear tabs dinámicas con iconos y counts si son las estándar
  const tabs = propTabs.map(tab => {
    let icon = null;
    let count = 0;

    switch (tab.id) {
      case 'available':
        icon = <Clipboard className="w-4 h-4 text-blue-500" />;
        count = counts.available || 0;
        break;
      case 'in_progress':
        icon = <Clock className="w-4 h-4 text-orange-400" />;
        count = counts.inProgress || 0;
        break;
      case 'pending_review':
        icon = <Eye className="w-4 h-4 text-purple-700" />;
        count = counts.pending_review || 0;
        break;
      case 'rejected':
        icon = <XCircle className="w-4 h-4 text-red-600" />;
        count = counts.rejected || 0;
        break;
      case 'completed':
        icon = <CheckCircle className="w-4 h-4 text-green-600" />;
        count = counts.completed || 0;
        break;
      default:
        icon = null; // las tabs community u otras no tienen icono ni count
    }

    return {
      ...tab,
      icon,
      count
    };
  });

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`group relative flex items-center gap-2 min-w-[120px] max-w-[200px] px-3 h-8 rounded-t-md
            transition-all cursor-pointer select-none border-b-2 
            ${activeTab === tab.id ? 'dark:bg-white/10 bg-blue-100 border-blue-500 text-gray-400 dark:text-white/90'
              : 'dark:bg-white/5 bg-blue-100/30 border-transparent dark:text-white/50 text-gray-500 hover:text-gray-600 dark:hover:text-white/80 dark:hover:bg-white/10 hover:bg-blue-100/55'}
          `}
        >
          {tab.icon}
          <span className="truncate flex-1 text-xs font-medium" title={tab.label}>{tab.label}</span>
          {tab.count > 0 && (
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full
              ${activeTab === tab.id ? 'dark:bg-blue-100/30 text-blue-400 bg-gray-200 dark:text-white' : 'bg-gray-100/20 text-gray-300'}`}
            >
              {tab.count}
            </span>
          )}

          {/* Botón cerrar para pestañas dinámicas (no default) */}
          {tab.id !== 'available' && onCloseTab && (
            <span
              className="ml-1 cursor-pointer text-gray-400 hover:text-red-400"
              onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
            >
              ×
            </span>
          )}

        </button>
      ))}

      {/* Botón + */}
      <button
        onClick={onAddTab}
        aria-label="Cerrar ventana"
        className="h-7 w-7 flex items-center justify-center rounded-md dark:text-white/50 text-gray-500 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-white/10 transition-colors ml-1"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TaskTabs;
