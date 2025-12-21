// /components/Profile/ProfileSidebar.jsx

import React from 'react';
import clsx from 'clsx';

const ProfileSidebar = ({ items, activeItem, onItemClick }) => {
  return (
    <div className="w-40 bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2">
        Secciones
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => onItemClick(item)}
            className={clsx(
              "flex items-center text-gray-900 dark:text-white gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all",
              item.id === activeItem.id
                ? "bg-blue-100 !text-blue-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <img src={item.icon} draggable="false" className="w-4" alt={item.title} />
            <p className="text-sm font-medium truncate">{item.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileSidebar;