// components/Profile/sections/ProjectsSection.jsx
import { Briefcase } from "#assets/icons";

const CATEGORY_COLORS = {
  'Web Development': 'bg-blue-500',
  'UI/UX Design': 'bg-purple-500',
  'Mobile Apps': 'bg-green-500',
  'Consulting': 'bg-orange-500',
  'Frontend': 'bg-cyan-500',
  'Backend': 'bg-red-500'
};
const COLOR_LIST = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-cyan-500', 'bg-red-500', 'bg-pink-500', 'bg-yellow-500'];

const colorFor = (cat, i) => CATEGORY_COLORS[cat] || COLOR_LIST[i % COLOR_LIST.length];

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const ProjectsSection = ({ userStats = {}, projectsByCategory = [], completedProjects = [] }) => {
  const total = completedProjects.length;
  const totalEarnings = completedProjects.reduce((s, p) => s + (p.totalReward || 0), 0);

  const catColorMap = {};
  projectsByCategory.forEach((cat, i) => { catColorMap[cat.category] = colorFor(cat.category, i); });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <Briefcase className="w-6 h-6" />
        Proyectos Completados
      </h2>

      {total === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Aún no tienes proyectos completados.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Cuando completes un proyecto aparecerá aquí con su categoría, ganancias y más.
          </p>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ganado</p>
            </div>

            {projectsByCategory.map((cat) => (
              <div key={cat.category} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className={`w-6 h-6 ${catColorMap[cat.category] || 'bg-gray-500'} rounded-full mb-2`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{cat.count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cat.category}</p>
              </div>
            ))}
          </div>

          {/* Por Categoría */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Por Categoría
            </h3>
            <div className="space-y-6">
              {projectsByCategory.map((cat) => {
                const pct = total > 0 ? (cat.count / total) * 100 : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-3 gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-4 h-4 ${catColorMap[cat.category] || 'bg-gray-500'} rounded-full flex-shrink-0`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{cat.category}</h4>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {cat.count} · ${cat.earnings.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${catColorMap[cat.category] || 'bg-gray-500'} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detalle de proyectos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detalle de Proyectos
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {completedProjects.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{p.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${catColorMap[p.category] || 'bg-gray-500'} flex-shrink-0`}>
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-green-600 dark:text-green-400">${p.totalReward.toLocaleString()}</span>
                    {p.actualHours ? <span>{p.actualHours}h</span> : null}
                    {p.rating ? <span className="text-yellow-500">⭐ {p.rating}</span> : null}
                  </div>
                  {p.completedAt ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{formatDate(p.completedAt)}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsSection;
