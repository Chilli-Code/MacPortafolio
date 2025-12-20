// components/Profile/sections/AchievementsSection.jsx
import { Trophy } from "#assets/icons";
import { userStats } from "../utils/profileData";

const AchievementsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Medallas y Logros
      </h2>

      {/* Medallas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Medallas Desbloqueadas ({userStats.badges.length})
        </h3>
        
        <div 
          className="grid gap-4 max-h-96 overflow-y-auto pr-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))'
          }}
        >
          {userStats.badges.map(badge => (
            <div
              key={badge.id}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="text-5xl mb-3">{badge.emoji}</div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {badge.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{badge.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Destacados */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
        }}
      >
        <Highlight 
          label="Proyectos Completados" 
          value={userStats.projectsCompleted} 
          emoji="🏆" 
          borderColor="yellow"
          subtitle="Meta: 50 proyectos"
        />
        <Highlight 
          label="Racha Máxima" 
          value={`${userStats.longestStreak} días`} 
          emoji="🔥" 
          borderColor="orange"
          subtitle="Días consecutivos activo"
        />
        <Highlight 
          label="Calificación Promedio" 
          value={`${userStats.averageRating}/5`} 
          emoji="⭐" 
          borderColor="green"
          subtitle={`De ${userStats.projectsCompleted} clientes`}
        />
      </div>

      {/* Próximos Desafíos */}
      <div className="bg-white mb-30 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Próximos Desafíos
        </h3>
        <div className="space-y-4">
          <Challenge
            emoji="🎯"
            label="Completar 50 proyectos"
            current={userStats.projectsCompleted}
            total={50}
            colorFrom="blue-500"
            colorTo="purple-500"
          />
          
          <Challenge
            emoji="💰"
            label="Alcanzar $50,000 en ganancias"
            current={userStats.totalEarnings}
            total={50000}
            colorFrom="green-500"
            colorTo="emerald-500"
            formatValue={(val) => `$${val.toLocaleString()}`}
          />
          
          <Challenge
            emoji="🔥"
            label="Mantener racha de 60 días"
            current={userStats.currentStreak}
            total={60}
            colorFrom="orange-500"
            colorTo="red-500"
          />
        </div>
      </div>
    </div>
  );
};

// Componente Highlight mejorado
const Highlight = ({ label, value, emoji, borderColor = "yellow", subtitle }) => {
  const borderClasses = {
    yellow: "border-2 border-yellow-200 dark:border-yellow-800",
    orange: "border-2 border-orange-200 dark:border-orange-800",
    green: "border-2 border-green-200 dark:border-green-800",
    purple: "border-2 border-purple-200 dark:border-purple-800",
    red: "border-2 border-red-200 dark:border-red-800",
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${borderClasses[borderColor]} hover:scale-105 transition-transform`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Nuevo componente Challenge reutilizable
const Challenge = ({ 
  emoji, 
  label, 
  current, 
  total, 
  colorFrom, 
  colorTo,
  formatValue = (val) => val 
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-lg flex-shrink-0">{emoji}</span>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate">
            {label}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatValue(current)}/{formatValue(total)}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-${colorFrom} to-${colorTo} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default AchievementsSection;