// components/Profile/sections/FinancesSection.jsx
import { DollarSign, TrendingUp } from "#assets/icons";
import { userStats, monthlyData } from "../utils/profileData";

const FinancesSection = () => {
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
        <DollarSign className="w-6 h-6 text-green-500" />
        Resumen Financiero
      </h2>

      {/* Totales - Grid responsive */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}
      >
        <FinanceCard
          icon={DollarSign}
          iconColor="text-green-600 dark:text-green-400"
          gradientFrom="from-green-50"
          gradientTo="to-emerald-50"
          gradientFromDark="dark:from-green-900/20"
          gradientToDark="dark:to-emerald-900/20"
          label="Ganancias Totales"
          value={`$${userStats.totalEarnings.toLocaleString()}`}
          subtitle={`+$${userStats.monthlyEarnings.toLocaleString()} este mes`}
          subtitleColor="text-green-600 dark:text-green-400"
        />

        <FinanceCard
          icon={TrendingUp}
          iconColor="text-blue-600 dark:text-blue-400"
          gradientFrom="from-blue-50"
          gradientTo="to-cyan-50"
          gradientFromDark="dark:from-blue-900/20"
          gradientToDark="dark:to-cyan-900/20"
          label="Promedio Mensual"
          value={`$${Math.round(userStats.totalEarnings / 12).toLocaleString()}`}
          subtitle="Últimos 12 meses"
          subtitleColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Desglose mensual */}
      <div className="bg-white mb-20 dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-scroll">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ingresos 2024
        </h3>

        <div className="space-y-2">
          {monthlyData.map((m) => (
            <MonthRow
              key={m.month}
              month={m.month}
              earnings={m.earnings}
              hours={m.hours}
              maxEarnings={maxEarnings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente FinanceCard reutilizable
const FinanceCard = ({
  icon: Icon,
  iconColor,
  gradientFrom,
  gradientTo,
  gradientFromDark,
  gradientToDark,
  label,
  value,
  subtitle,
  subtitleColor
}) => (
  <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} ${gradientFromDark} ${gradientToDark} rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow`}>
    <Icon className={`w-8 h-8 md:w-10 md:h-10 ${iconColor} mb-3 md:mb-4 flex-shrink-0`} />
    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
      {label}
    </p>
    <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white truncate">
      {value}
    </p>
    <p className={`text-xs md:text-sm ${subtitleColor} mt-2`}>
      {subtitle}
    </p>
  </div>
);

// Componente MonthRow reutilizable
const MonthRow = ({ month, earnings, hours, maxEarnings }) => {
  const percentage = (earnings / maxEarnings) * 100;

  return (
    <div className="flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {/* Mes */}
      <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 w-10 md:w-16 flex-shrink-0">
        {month}
      </span>

      {/* Barra de progreso */}
      <div className="flex-1 min-w-0">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Ganancias */}
      <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white w-20 md:w-24 text-right flex-shrink-0 truncate">
        ${earnings.toLocaleString()}
      </span>

      {/* Horas */}
      <span className="text-xs text-gray-500 dark:text-gray-400 w-12 md:w-16 text-right flex-shrink-0">
        {hours}h
      </span>
    </div>
  );
};

export default FinancesSection;