// src/components/Mobile/screens/AchievementsSectionMobile.jsx
import { useState } from 'react';
import { Trophy, ChevronRight } from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';
import { userStats } from '#Desktop/components/Profile/utils/profileData';

const AchievementsSectionMobile = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos', icon: '🏆' },
    { id: 'completed', label: 'Completados', icon: '✅' },
    { id: 'progress', label: 'En Progreso', icon: '⏳' },
    { id: 'locked', label: 'Bloqueados', icon: '🔒' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
      {/* Header */}
      <MobileNav 
        title="Logros"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Hero Stats - iOS Style */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Logros</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {userStats.badges.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Desbloqueados
              </p>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-3">
            <MiniStat emoji="🎯" value={userStats.projectsCompleted} label="Proyectos" />
            <MiniStat emoji="🔥" value={`${userStats.currentStreak}d`} label="Racha" />
            <MiniStat emoji="⭐" value={userStats.averageRating} label="Rating" />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0
                  ${selectedCategory === cat.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="px-4 py-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Medallas ({userStats.badges.length})
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {userStats.badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className="mt-2">
          <div className="px-4 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Desafíos Activos
            </h3>
            <button className="text-sm text-blue-500 font-medium active:opacity-50 transition-opacity">
              Ver Todos
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
            <ChallengeItem
              emoji="🎯"
              title="Completar 50 proyectos"
              current={userStats.projectsCompleted}
              total={50}
              color="blue"
            />
            <ChallengeItem
              emoji="💰"
              title="Alcanzar $50,000 en ganancias"
              current={userStats.totalEarnings}
              total={50000}
              color="green"
              format={(val) => `$${val.toLocaleString()}`}
            />
            <ChallengeItem
              emoji="🔥"
              title="Mantener racha de 60 días"
              current={userStats.currentStreak}
              total={60}
              color="orange"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 py-6 space-y-3">
          <StatsCard
            icon="🏆"
            title="Proyectos Completados"
            value={userStats.projectsCompleted}
            subtitle="Meta: 50 proyectos"
            color="yellow"
          />
          <StatsCard
            icon="⭐"
            title="Calificación Promedio"
            value={`${userStats.averageRating}/5`}
            subtitle={`De ${userStats.projectsCompleted} clientes`}
            color="green"
          />
          <StatsCard
            icon="🔥"
            title="Racha Máxima"
            value={`${userStats.longestStreak} días`}
            subtitle="Días consecutivos activo"
            color="orange"
          />
        </div>
      </div>
    </div>
  );
};

// Mini Stat Component - iOS Style
const MiniStat = ({ emoji, value, label }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
    <div className="text-3xl mb-2">{emoji}</div>
    <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

// Badge Card Component
const BadgeCard = ({ badge }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={() => {
        alert(`${badge.name}\nObtenido: ${badge.date}\n\n${badge.description || 'Badge desbloqueado con éxito'}`);
      }}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl p-4 
        border border-gray-200 dark:border-gray-700
        transition-all duration-150
        ${isPressed ? 'scale-95 bg-gray-50 dark:bg-gray-700' : 'scale-100'}
      `}
    >
      <div className="text-4xl mb-2">{badge.emoji}</div>
      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
        {badge.name}
      </p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
        {badge.date}
      </p>
    </button>
  );
};

// Challenge Item Component
const ChallengeItem = ({ emoji, title, current, total, color, format = (val) => val }) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  };

  return (
    <div className="px-4 py-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {format(current)} / {format(total)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Stats Card Component - iOS Style
const StatsCard = ({ icon, title, value, subtitle, color }) => {
  const bgColors = {
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20',
    green: 'bg-green-100 dark:bg-green-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20'
  };

  return (
    <button className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 ${bgColors[color]} rounded-2xl flex items-center justify-center text-3xl`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
};

export default AchievementsSectionMobile;