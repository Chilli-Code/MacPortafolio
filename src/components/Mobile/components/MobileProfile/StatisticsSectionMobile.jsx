// src/components/Mobile/screens/StatisticsSectionMobile.jsx
import { useState } from 'react';
import { BarChart3, Clock, Target, TrendingUp, DollarSign, ChevronRight } from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';
import { userStats, monthlyData, projectsByCategory } from '#Desktop/components/Profile/utils/profileData';

const StatisticsSectionMobile = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  const periods = [
    { id: 'year', label: '2024' },
    { id: 'month', label: 'Este Mes' },
    { id: 'week', label: 'Esta Semana' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
      {/* Header */}
      <MobileNav 
        title="Estadísticas"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Summary Cards */}
        <div className="p-4 space-y-3">
          <SummaryCard
            icon={<DollarSign className="w-6 h-6 text-green-500" />}
            title="Ganancias Totales"
            value={`$${userStats.totalEarnings.toLocaleString()}`}
            change="+12.5%"
            changePositive={true}
            color="green"
          />
          <SummaryCard
            icon={<Clock className="w-6 h-6 text-blue-500" />}
            title="Horas Trabajadas"
            value={`${userStats.totalHoursWorked.toLocaleString()}h`}
            subtitle={`Promedio: ${Math.round(userStats.totalHoursWorked / userStats.projectsCompleted)}h por proyecto`}
            color="blue"
          />
          <SummaryCard
            icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
            title="Tarifa por Hora"
            value={`$${Math.round(userStats.totalEarnings / userStats.totalHoursWorked)}`}
            subtitle="Basado en tu historial"
            color="purple"
          />
        </div>

        {/* Period Selector */}
        <div className="px-4 py-3">
          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`
                  flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all
                  ${selectedPeriod === period.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="mx-4 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Ganancias Mensuales
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">2024</span>
          </div>

          <div className="flex items-end justify-between h-40 gap-1">
            {monthlyData.map((data, index) => {
              const height = (data.earnings / maxEarnings) * 100;
              const isHighest = data.earnings === maxEarnings;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center">
                    {isHighest && (
                      <span className="text-[10px] font-bold text-green-500 mb-1">
                        ${(data.earnings / 1000).toFixed(1)}k
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        isHighest
                          ? 'bg-gradient-to-t from-green-500 to-green-400'
                          : 'bg-gradient-to-t from-blue-500 to-blue-400'
                      }`}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400">
                    {data.month.slice(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects by Category */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Proyectos por Categoría
          </h3>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
            {projectsByCategory.map((project) => {
              const totalProjects = projectsByCategory.reduce((sum, p) => sum + p.count, 0);
              const percentage = (project.count / totalProjects) * 100;
              
              return (
                <div key={project.category} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {project.category}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {project.count} proyectos
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ${project.earnings.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(percentage)}%
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${project.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="px-4 space-y-3">
          <MetricCard
            label="Promedio por Proyecto"
            value={`${Math.round(userStats.totalHoursWorked / userStats.projectsCompleted)}h`}
            icon={<Target className="w-5 h-5 text-blue-500" />}
          />
          <MetricCard
            label="Proyectos Completados"
            value={userStats.projectsCompleted}
            icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
          />
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, title, value, change, changePositive, subtitle, color }) => {
  const bgColors = {
    green: 'bg-green-50 dark:bg-green-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 ${bgColors[color]} rounded-2xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {value}
            </p>
            {change && (
              <span className={`text-xs font-medium ${changePositive ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
    <span className="text-xl font-bold text-gray-900 dark:text-white">
      {value}
    </span>
  </div>
);

export default StatisticsSectionMobile;