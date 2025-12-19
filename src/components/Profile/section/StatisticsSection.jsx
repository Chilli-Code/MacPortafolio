// /components/Profile/section/StatisticsSection.jsx

import { BarChart3, Clock, Target, TrendingUp } from "lucide-react";

const StatisticsSection = ({ userStats, monthlyData, projectsByCategory }) => {
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <BarChart3 className="w-6 h-6" />
        Estadísticas Detalladas
      </h2>

      {/* Gráfico de ganancias mensuales */}
      <div className="bg-white overflow-hidden overflow-x-scroll dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Ganancias Mensuales (2024)
        </h3>
        <div className="flex items-end justify-between h-64 gap-2">
          {monthlyData.map((data, index) => {
            const height = (data.earnings / maxEarnings) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    ${(data.earnings / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${data.month}: $${data.earnings}`}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribución por categorías */}
      <div className="bg-white overflow-hidden overflow-x-scroll dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Proyectos por Categoría
        </h3>
        <div className="space-y-4">
          {projectsByCategory.map((project) => {
            const totalProjects = projectsByCategory.reduce((sum, p) => sum + p.count, 0);
            const percentage = (project.count / totalProjects) * 100;
            
            return (
              <div key={project.category}>
                <div className="flex justify-between text-sm mb-2 flex-wrap">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {project.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {project.count} proyectos · ${project.earnings.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${project.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen de horas */}
      <div 
        className="grid gap-4 mb-20"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
        }}
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
          <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {userStats.totalHoursWorked.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Horas totales trabajadas</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
          <Target className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.round(userStats.totalHoursWorked / userStats.projectsCompleted)}h
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por proyecto</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            ${Math.round(userStats.totalEarnings / userStats.totalHoursWorked)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tarifa por hora</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;