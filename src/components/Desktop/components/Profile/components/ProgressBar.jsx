import { useState, useEffect } from 'react';

const ProgressBar = ({ 
  label,
  current,
  total,
  gradient,
  isLevelBar = false,
  showPercentage = true,
  showValues = true,
  height = 'h-2',
  animate = true,
  showLabel = true
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const value = total > 0 ? (current / total) * 100 : 0;
    const capped = Math.min(value, 100);

    if (!animate) {
      setPercentage(capped);
      return;
    }

    const timer = setTimeout(() => setPercentage(capped), 100);
    return () => clearTimeout(timer);
  }, [current, total, animate]);

  const gradientClass = gradient || 'from-blue-500 to-blue-400';

  const formatValue = (value) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString();

  const getTextColor = () => {
    if (percentage > 70) return 'text-green-600 dark:text-green-400';
    if (percentage > 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {label}
          </div>

          {showPercentage && (
            <div className="flex items-center gap-2">
              {showValues && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatValue(current)}/{formatValue(total)}
                </span>
              )}
              <span className={`text-xs font-semibold ${getTextColor()}`}>
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative`}>
        <div
          className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isLevelBar && percentage >= 100 && (
        <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-semibold animate-pulse">
          ¡Listo para subir de nivel! 🚀
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
