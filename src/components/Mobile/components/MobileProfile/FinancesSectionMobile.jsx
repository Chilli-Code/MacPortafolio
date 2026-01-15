import { DollarSign, TrendingUp, CalendarIcon } from '#assets/icons';
import MobileNav from '#components/Mobile/MobileNav';

const FinancesSectionMobile = ({ onBack }) => {
  const userStats = {
    totalEarnings: 12500,
    monthlyEarnings: 2100
  };

  const monthlyData = [
    { month: 'Ene', earnings: 1200, hours: 45 },
    { month: 'Feb', earnings: 980, hours: 38 },
    { month: 'Mar', earnings: 1500, hours: 52 },
    { month: 'Abr', earnings: 1350, hours: 48 },
    { month: 'May', earnings: 1100, hours: 42 },
    { month: 'Jun', earnings: 1680, hours: 58 },
    { month: 'Jul', earnings: 1920, hours: 62 },
    { month: 'Ago', earnings: 850, hours: 32 },
    { month: 'Sep', earnings: 1240, hours: 46 },
    { month: 'Oct', earnings: 1580, hours: 54 },
    { month: 'Nov', earnings: 2100, hours: 68 },
    { month: 'Dic', earnings: 1800, hours: 60 }
  ];

  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

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
            <p className="text-2xl font-bold mb-1">${userStats.totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-white/80">Total Ganado</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold mb-1">${Math.round(userStats.totalEarnings / 12).toLocaleString()}</p>
            <p className="text-xs text-white/80">Promedio Mensual</p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Ingresos 2024
            </h3>
          </div>

          <div className="space-y-3">
            {monthlyData.map((m) => {
              const percentage = (m.earnings / maxEarnings) * 100;

              return (
                <div key={m.month} className="space-y-1">
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
        </div>
      </div>
    </div>
  );
};

export default FinancesSectionMobile;