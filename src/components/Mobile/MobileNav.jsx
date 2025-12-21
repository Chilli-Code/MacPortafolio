import { Home, ListTodo, User, Settings } from 'lucide-react';

const MobileNav = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'tasks', icon: ListTodo, label: 'Tareas' },
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-3 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeView === id
                ? 'text-blue-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;