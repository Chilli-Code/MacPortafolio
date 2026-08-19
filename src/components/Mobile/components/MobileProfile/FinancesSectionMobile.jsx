import { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, CalendarIcon } from '#assets/icons';
import MobileNav from '#components/Mobile/MobileNav';
import { useAuthStore } from '#store/authStore';

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const FinancesSectionMobile = ({ onBack }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [userStats, setUserStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/stats/${currentUser.id}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        setUserStats(data.userStats || {});
        setMonthlyData(data.monthlyData || []);
      } catch (err) {
        console.error('Error cargando finanzas:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser?.id]);

  const totalEarnings = useMemo(
    () => monthlyData.length
      ? monthlyData.reduce((sum, d) => sum + (d.earnings || 0), 0)
      : (userStats.totalEarnings || 0),
    [monthlyData, userStats]
  );

  const avgMonthly = useMemo(
    () => monthlyData.length
      ? Math.round(monthlyData.reduce((sum, d) => sum + (d.earnings || 0), 0) / monthlyData.length)
      : 0,
    [monthlyData]
  );

  const now = new Date();
  const currentMonth = MONTHS_SHORT[now.getMonth()];
  const currentYear = now.getFullYear();
  const thisMonthEntry = monthlyData.find(d => d.month === currentMonth && d.year === currentYear);
  const monthlyEarnings = thisMonthEntry ? thisMonthEntry.earnings : 0;

  const maxEarnings = monthlyData.length ? Math.max(...monthlyData.map(d => d.earnings)) : 0;

  const years = [...new Set(monthlyData.map(d => d.year))];
  const breakdownTitle = years.length === 0
    ? 'Ingresos'
    : (years.length === 1 ? `Ingresos ${years[0]}` : 'Ingresos por mes');

  const isEmpty = totalEarnings === 0 && monthlyData.length === 0;

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <MobileNav title="Finanzas" onBack={onBack} showCancel={false} />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <MobileNav
        title="Finanzas"
        onBack={onBack}
        showCancel={false}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
            <DollarSign className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold mb-1">${totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-white/80">Total Ganado</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold mb-1">${avgMonthly.toLocaleString()}</p>
            <p className="text-xs text-white/80">Promedio Mensual</p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {breakdownTitle}
            </h3>
          </div>

          {isEmpty ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">
              Aún no tienes ingresos registrados.
            </p>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((m) => {
                const percentage = maxEarnings ? (m.earnings / maxEarnings) * 100 : 0;

                return (
                  <div key={`${m.year}-${m.month}`} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{m.month}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${m.earnings.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.hours}h trabajadas</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancesSectionMobile;
