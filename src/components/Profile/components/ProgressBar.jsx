// /components/Profile/components/ProgressBar.jsx

const ProgressBar = ({ label, current, total, color = "blue", showPercentage = true }) => {
  const percentage = (current / total) * 100;
  
  // Mapeo de colores a gradientes
  const colorGradients = {
    blue: 'from-blue-500 to-blue-400',
    purple: 'from-blue-500 via-purple-500 to-pink-500',
    green: 'from-green-500 to-green-400',
    red: 'from-red-500 to-red-400',
    yellow: 'from-yellow-500 to-yellow-400',
    orange: 'from-orange-500 to-orange-400',
    cyan: 'from-cyan-500 to-cyan-400',
    pink: 'from-pink-500 to-pink-400',
    gray: 'from-gray-500 to-gray-400',
    // Colores hex personalizados
    '61DAFB': 'from-blue-400 to-cyan-400', // React
    '68A063': 'from-green-600 to-green-400', // Node
    '3178C6': 'from-blue-600 to-blue-400', // TypeScript
    '3776AB': 'from-blue-700 to-blue-500', // Python
    '336791': 'from-blue-800 to-blue-600', // PostgreSQL
    '2496ED': 'from-blue-500 to-blue-400', // Docker
    'F05032': 'from-orange-600 to-red-500', // Git
    'FF6B6B': 'from-red-400 to-pink-400', // UI/UX
  };

  const gradientClass = colorGradients[color] || `from-${color}-500 to-${color}-400`;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-gray-500 dark:text-gray-400">
            {current}/{total}
          </span>
        )}
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-500 rounded-full relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Efecto de brillo animado */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;