import { Activity, Users, Database, Settings } from '#assets/icons';

const iconComponents = {
  Activity,
  Users,
  Database,
  Settings
};

const AdminSidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <aside className="w-64 border-r border-gray-800 bg-gray-900/50 p-6 space-y-2">
      {tabs.map(({ id, name, icon: iconName, badge }) => {
        const Icon = iconComponents[iconName];
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-gray-800/50'
            }`}
          >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{name}</span>
            {badge > 0 && (
              <span className="ml-auto bg-blue-500 text-xs px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};

export default AdminSidebar;