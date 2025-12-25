// src/components/Mobile/components/MobileSettings/NotificationComponents/NotificationTypeItem.jsx
import { useState } from 'react';

const NotificationTypeItem = ({ emoji, title, subtitle, enabled, isLast = false }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = (e) => {
    setIsEnabled(e.target.checked);
    // Aquí podrías guardar la preferencia en el store si lo necesitas
    console.log(`${title} notification:`, e.target.checked);
  };

  return (
    <div className={`px-4 py-3 ${!isLast ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl flex-shrink-0">{emoji}</div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isEnabled}
            onChange={handleToggle}
          />
          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 shadow-inner"></div>
        </label>
      </div>
    </div>
  );
};

export default NotificationTypeItem;