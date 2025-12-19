// /components/Profile/components/ProgressBar.jsx

import React from 'react';

const ProgressBar = ({ label, current, total, color = "blue" }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{current}/{total}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;