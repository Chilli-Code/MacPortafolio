import { useState, useEffect } from 'react';
import { Moon, Sun, Check } from '#assets/icons';
import  MobileNav from '#Mobile/MobileNav';


const AppearanceSettingsMobile = ({ onBack }) => {
  const [theme, setTheme] = useState('light');
 

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
   
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };


  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <MobileNav title="Apariencia" onBack={onBack} showCancel={false} />

      <div className="flex-1 overflow-y-auto">
        {/* Theme Selector */}
        <div className="mt-6">
          <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Tema
          </h3>
          
          <div className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleThemeChange('light')}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Sun className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Claro
                </span>
              </div>
              {theme === 'light' && <Check className="w-5 h-5 text-blue-500" />}
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-100 dark:active:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Moon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Oscuro
                </span>
              </div>
              {theme === 'dark' && <Check className="w-5 h-5 text-blue-500" />}
            </button>
          </div>
        </div>


        </div>
      </div>
 
  );
};

export default AppearanceSettingsMobile;