// src/components/Mobile/screens/ActivitySectionMobile.jsx
import { useState, useMemo, useEffect } from 'react';
import { CalendarIcon, Flame, Trophy, Activity, ChevronLeft, ChevronRight } from '#assets/icons';
import MobileNav from '#Mobile/MobileNav';
import { getActivityColor } from '#Desktop/components/Profile/utils/profileHelpers';
import clsx from 'clsx';
import { useAuthStore } from '#store/authStore';

const monthsLabels = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const ActivitySectionMobile = ({ onBack }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [calendar, setCalendar] = useState([]);
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0, totalActiveDays: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!currentUser?.id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/api/activity/${currentUser.id}?year=${selectedYear}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        setCalendar(data.calendar || []);
        setStats(data.stats || { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 });
        if (Array.isArray(data.availableYears) && data.availableYears.length) {
          setAvailableYears(data.availableYears);
          if (!data.availableYears.includes(selectedYear)) {
            setSelectedYear(data.availableYears[0]);
          }
        }
      } catch (err) {
        console.error('Error cargando actividad:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser?.id, selectedYear]);

  // Meses del año elegido (enero-dic, o hasta el mes actual si es el año en curso)
  const availableMonths = useMemo(() => {
    const lastMonth = selectedYear === currentYear ? currentMonth : 11;
    const arr = [];
    for (let m = 0; m <= lastMonth; m++) arr.push({ year: selectedYear, month: m });
    return arr;
  }, [selectedYear, currentYear, currentMonth]);

  useEffect(() => {
    if (availableMonths.length) setSelectedIdx(availableMonths.length - 1);
  }, [availableMonths.length]);

  const sel = availableMonths[selectedIdx];

  const weeks = useMemo(() => {
    const result = [];
    let currentWeek = [];
    calendar.forEach(day => {
      const d = new Date(day.date);
      if (d.getDay() === 0 && currentWeek.length) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length) result.push(currentWeek);
    return result;
  }, [calendar]);

  const monthLabels = useMemo(() => {
    return weeks.map((week, i) => {
      const month = new Date(week[0].date).getMonth();
      const prevMonth = i > 0 ? new Date(weeks[i - 1][0].date).getMonth() : -1;
      return i === 0 || month !== prevMonth ? MONTHS_SHORT[month] : '';
    });
  }, [weeks]);

  const currentMonthData = useMemo(() => {
    if (!sel) return [];
    return calendar.filter(d => {
      const dt = new Date(d.date);
      return dt.getFullYear() === sel.year && dt.getMonth() === sel.month;
    });
  }, [calendar, sel]);

  const totalTasksThisMonth = currentMonthData.reduce((sum, day) => sum + day.count, 0);
  const activeDaysThisMonth = currentMonthData.filter(day => day.count > 0).length;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
      {/* Header */}
      <MobileNav
        title="Actividad"
        onBack={onBack}
        showCancel={false}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {loading ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
            Cargando actividad…
          </p>
        ) : calendar.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
            Aún no tienes actividad registrada.
          </p>
        ) : (
        <>
          {/* Stats Hero */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Racha Actual</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stats.currentStreak}
                  </p>
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  días consecutivos
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Racha Máxima</p>
                <div className="flex items-baseline gap-2 justify-end">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.longestStreak}
                  </p>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  días
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <QuickStat value={stats.totalActiveDays} label="Días activos" />
              <QuickStat value={totalTasksThisMonth} label="Este mes" />
              <QuickStat value={activeDaysThisMonth} label="Días este mes" />
            </div>
          </div>

          {/* Month Selector */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
                disabled={selectedIdx === 0}
                className="p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {sel ? monthsLabels[sel.month] : 'Actividad'}
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSelectedIdx(Math.min(availableMonths.length - 1, selectedIdx + 1))}
                disabled={selectedIdx === availableMonths.length - 1}
                className="p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Activity Grid - Estilo GitHub */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Actividad {selectedYear}
            </h3>

            {/* Etiquetas de meses */}
            <div className="flex gap-1 mb-1">
              {monthLabels.map((label, i) => (
                <div key={i} className="w-3 flex-shrink-0">
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>

            {/* Días de la semana */}
            <div className="flex gap-1 mb-2 pl-0">
              <div className="text-[10px] text-gray-400 w-full text-center">L</div>
              <div className="text-[10px] text-gray-400 w-full text-center">M</div>
              <div className="text-[10px] text-gray-400 w-full text-center">M</div>
              <div className="text-[10px] text-gray-400 w-full text-center">J</div>
              <div className="text-[10px] text-gray-400 w-full text-center">V</div>
              <div className="text-[10px] text-gray-400 w-full text-center">S</div>
              <div className="text-[10px] text-gray-400 w-full text-center">D</div>
            </div>

            {/* Grid scrollable horizontalmente */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="inline-flex gap-1">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {week.map(day => (
                      <ActivitySquare key={day.date} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
              <span>Menos</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(l => (
                  <div
                    key={l}
                    className={clsx("w-3 h-3 rounded-sm", getActivityColor(l))}
                  />
                ))}
              </div>
              <span>Más</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 py-6 space-y-3">
            <StatCard
              icon={<Flame className="w-6 h-6 text-orange-500" />}
              title="Racha Actual"
              value={`${stats.currentStreak} días`}
              subtitle="Sigue así para mantener tu racha"
              color="orange"
            />
            <StatCard
              icon={<Trophy className="w-6 h-6 text-yellow-500" />}
              title="Racha Máxima"
              value={`${stats.longestStreak} días`}
              subtitle="Tu mejor racha registrada"
              color="yellow"
            />
            <StatCard
              icon={<Activity className="w-6 h-6 text-green-500" />}
              title="Total de Días Activos"
              value={`${stats.totalActiveDays} días`}
              subtitle="Has estado muy productivo"
              color="green"
            />
          </div>
        </>
        )}
      </div>
    </div>
  );
};

// Quick Stat Component
const QuickStat = ({ value, label }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
    <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

// Activity Square Component
const ActivitySquare = ({ day }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 1500)}
        className={clsx(
          "w-3 h-3 rounded-sm transition-all active:scale-110",
          getActivityColor(day.level)
        )}
      />

      {/* Tooltip móvil */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
            {day.date}: {day.count} actividades
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, subtitle, color }) => {
  const bgColors = {
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${bgColors[color]} rounded-2xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySectionMobile;
