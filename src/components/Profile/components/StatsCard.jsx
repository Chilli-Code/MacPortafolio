// /components/Profile/components/StatsCard.jsx

import React from 'react';

const StatsCard = ({ icon: Icon, value, label, iconColor, bgColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;