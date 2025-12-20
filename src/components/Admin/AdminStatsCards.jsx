// src/components/admin/AdminStatsCards.jsx
import { Users, Clock,  CheckCircle, Activity, TrendingUp } from '#assets/icons';

const statsConfig = [
  { 
    label: 'Usuarios', 
    valueKey: 'totalUsers', 
    icon: Users, 
    color: 'blue', 
    change: '+12%' 
  },
  { 
    label: 'En Revisión', 
    valueKey: 'activeTasks', 
    icon: Clock, 
    color: 'orange', 
    change: 'pendientes' 
  },
  { 
    label: 'Completadas', 
    valueKey: 'completedTasks', 
    icon: CheckCircle, 
    color: 'green', 
    change: '+8% este mes' 
  },
  { 
    label: 'Sistema', 
    valueKey: 'systemHealth', 
    icon: Activity, 
    color: 'purple', 
    change: 'Operativo' 
  }
];

const AdminStatsCards = ({ stats }) => {
  // ⭐ Validación para evitar errores
  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 animate-pulse">
            <div className="h-12 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {statsConfig.map(({ label, valueKey, icon: Icon, color, change }, i) => {
        const value = stats[valueKey] || 0; // ⭐ Valor por defecto
        const displayValue = valueKey === 'systemHealth' ? `${value}%` : value;
        const changeText = valueKey === 'activeTasks' ? `${value} ${change}` : change;
        
        return (
          <div 
            key={i} 
            className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 p-6 rounded-xl border border-${color}-500/20`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{label}</p>
                <p className={`text-3xl font-bold text-${color}-400`}>{displayValue}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 text-sm text-${color}-400`}>
              <TrendingUp className="w-4 h-4" />
              <span>{changeText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;