import { useState, useEffect, useMemo } from 'react';
import { Briefcase, TrendingUp } from '#assets/icons';
import MobileNav from '#components/Mobile/MobileNav';
import { useAuthStore } from '#store/authStore';

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

const ProjectsSectionMobile = ({ onBack }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [userStats, setUserStats] = useState({});
  const [projectsByCategory, setProjectsByCategory] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/stats/${currentUser.id}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        setUserStats(data.userStats || {});
        setProjectsByCategory(data.projectsByCategory || []);
        setCompletedProjects(data.completedProjects || []);
      } catch (err) {
        console.error('Error cargando proyectos:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser?.id]);

  const total = completedProjects.length;
  const totalEarnings = useMemo(
    () => completedProjects.reduce((s, p) => s + (p.totalReward || 0), 0),
    [completedProjects]
  );

  const catColorMap = {};
  projectsByCategory.forEach((cat, i) => { catColorMap[cat.category] = colorFor(cat.category, i); });

  const isEmpty = total === 0;

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <MobileNav title="Proyectos" onBack={onBack} showCancel={false} />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <MobileNav
        title="Proyectos"
        onBack={onBack}
        showCancel={false}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
            <Briefcase className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold mb-1">{total}</p>
            <p className="text-xs text-white/80">Total</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold mb-1">${totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-white/80">Ganado</p>
          </div>
        </div>

        {isEmpty ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no tienes proyectos completados.
            </p>
          </div>
        ) : (
          <>
            {/* Por Categoría */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Por Categoría</h3>
              </div>
              <div className="space-y-3">
                {projectsByCategory.map((cat) => {
                  const pct = total > 0 ? (cat.count / total) * 100 : 0;
                  return (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                          <span className={`w-3 h-3 rounded-full ${catColorMap[cat.category] || 'bg-gray-500'}`} />
                          {cat.category}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {cat.count} · ${cat.earnings.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${catColorMap[cat.category] || 'bg-gray-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalle de proyectos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Detalle de Proyectos</h3>
              <div className="space-y-3">
                {completedProjects.map((p) => (
                  <div key={p.id} className="rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">{p.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${catColorMap[p.category] || 'bg-gray-500'} flex-shrink-0`}>
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-green-600 dark:text-green-400">${p.totalReward.toLocaleString()}</span>
                      {p.actualHours ? <span>{p.actualHours}h</span> : null}
                      {p.rating ? <span className="text-yellow-500">⭐ {p.rating}</span> : null}
                    </div>
                    {p.completedAt ? (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(p.completedAt)}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsSectionMobile;
