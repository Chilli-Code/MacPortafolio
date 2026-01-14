// components/Profile/sections/ActivitySection.jsx
import {  CalendarIcon, Flame, Trophy, Activity } from "#assets/icons";
import { userStats } from "../utils/profileData";
import { generateActivityData, getActivityColor } from "../utils/profileHelpers";
import clsx from "clsx";
import { useMemo } from "react";

const ActivitySection = () => {
  const activityData = useMemo(generateActivityData, []);

  const weeks = useMemo(() => {
    const result = [];
    let currentWeek = [];

    activityData.forEach(day => {
      const d = new Date(day.date);
      if (d.getDay() === 0 && currentWeek.length) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length) result.push(currentWeek);
    return result;
  }, [activityData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <CalendarIcon className="w-6 h-6" />
        Calendario de Actividad
      </h2>

      {/* Calendario */}
      <div className="bg-white overflow-hidden overflow-x-scroll dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 flex-wrap">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            Últimos 12 meses
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <span className="whitespace-nowrap">
              {userStats.totalDaysActive} días activo
            </span>
            <span className="whitespace-nowrap">
              Racha actual: {userStats.currentStreak} días
            </span>
          </div>
        </div>

        {/* Grid del calendario - scrollable horizontalmente si es necesario */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-1 min-w-full">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1">
                {week.map(day => (
                  <div
                    key={day.date}
                    className={clsx(
                      "w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-blue-400 cursor-pointer flex-shrink-0",
                      getActivityColor(day.level)
                    )}
                    title={`${day.date}: ${day.count} tareas`}
                  />
                ))}
              </div>
            ))}
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
          value={userStats.currentStreak}
          iconColor="text-orange-500"
        />
        <Stat 
          icon={Trophy} 
          label="Racha máxima" 
          value={userStats.longestStreak}
          iconColor="text-yellow-500"
        />
        <Stat 
          icon={Activity} 
          label="Días activos" 
          value={userStats.totalDaysActive}
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