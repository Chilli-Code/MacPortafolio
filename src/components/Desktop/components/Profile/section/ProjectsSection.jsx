// components/Profile/sections/ProjectsSection.jsx
import { Briefcase } from "#assets/icons";
import { userStats, projectsByCategory } from "../utils/profileData";

const ProjectsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <Briefcase className="w-6 h-6" />
        Proyectos Completados
      </h2>

      {/* Resumen - Grid adaptativo que responde al ancho del contenedor */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.projectsCompleted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>

        {projectsByCategory.map(cat => (
          <div key={cat.category} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className={`w-6 h-6 ${cat.color} rounded-full mb-2`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{cat.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cat.category}</p>
          </div>
        ))}
      </div>

      {/* Detalle */}
      <div className="bg-white mb-20 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Por Categoría
        </h3>
        <div className="space-y-6">
          {projectsByCategory.map(cat => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-3 gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-4 h-4 ${cat.color} rounded-full flex-shrink-0`} />
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">{cat.category}</h4>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  ${cat.earnings.toLocaleString()}
                </span>
              </div>

              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} transition-all duration-300`}
                  style={{
                    width: `${(cat.earnings / userStats.totalEarnings) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;