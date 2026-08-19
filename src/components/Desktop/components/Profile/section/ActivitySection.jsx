// components/Profile/sections/ActivitySection.jsx
import { CalendarIcon, Flame, Trophy, Activity } from "#assets/icons";
import { getActivityColor } from "../utils/profileHelpers";
import clsx from "clsx";
import { useMemo, useEffect, useState } from "react";
import { useAuthStore } from "#store/authStore";

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const ActivitySection = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentYear = new Date().getFullYear();
  const [calendar, setCalendar] = useState([]);
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0, totalActiveDays: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <CalendarIcon className="w-6 h-6" />
        Calendario de Actividad
      </h2>

      {/* Calendario */}
      <div className="bg-white overflow-hidden overflow-x-scroll dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
              Actividad {selectedYear}
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <span className="whitespace-nowrap">
              {stats.totalActiveDays} días activo
            </span>
            <span className="whitespace-nowrap">
              Racha actual: {stats.currentStreak} días
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">
            Cargando actividad…
          </p>
        ) : calendar.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">
            Aún no tienes actividad registrada.
          </p>
        ) : (
          <>
            {/* Grid del calendario - tamaño fijo original, alineado a la izquierda */}
            <div className="overflow-x-auto pb-4">
              <div className="inline-flex flex-col gap-2">
                {/* Etiquetas de meses */}
                <div className="flex gap-1">
                  {monthLabels.map((label, i) => (
                    <div key={i} className="w-3 flex-shrink-0">
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {weeks.map((week, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {week.map(day => (
                        <div
                          key={day.date}
                          className={clsx(
                            "w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-blue-400 cursor-pointer flex-shrink-0",
                            getActivityColor(day.level)
                          )}
                          title={`${day.date}: ${day.count} actividades`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
              <span>Menos</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(l => (
                  <div
                    key={l}
                    className={clsx("w-3 h-3 rounded-sm flex-shrink-0", getActivityColor(l))}
                  />
                ))}
              </div>
              <span>Más</span>
            </div>
          </>
        )}
      </div>

      {/* Estadísticas */}
      <div
        className="grid gap-4 mb-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
        }}
      >
        <Stat
          icon={Flame}
          label="Racha actual"
          value={stats.currentStreak}
          iconColor="text-orange-500"
        />
        <Stat
          icon={Trophy}
          label="Racha máxima"
          value={stats.longestStreak}
          iconColor="text-yellow-500"
        />
        <Stat
          icon={Activity}
          label="Días activos"
          value={stats.totalActiveDays}
          iconColor="text-green-500"
        />
      </div>
    </div>
  );
};

// Componente Stat mejorado
const Stat = ({ icon: Icon, label, value, iconColor = "text-orange-500" }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
    <Icon className={`w-7 h-7 md:w-8 md:h-8 ${iconColor} mb-3 flex-shrink-0`} />
    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 truncate">
      {value}
    </p>
    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
      {label}
    </p>
  </div>
);

export default ActivitySection;
