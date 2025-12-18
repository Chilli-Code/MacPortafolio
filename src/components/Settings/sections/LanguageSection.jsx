// src/components/Settings/sections/LanguageSection.jsx

import { Check, Languages } from 'lucide-react';
import { useAppSettingsStore } from '#store/notificationStore';
import { useTranslate } from '#hoc/useTranslate';
import clsx from 'clsx';

const LanguageSection = () => {
  const { language, setLanguage } = useAppSettingsStore();
  const { t } = useTranslate();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const handleLanguageChange = (code) => {
    setLanguage(code);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-black dark:text-white text-2xl font-semibold mb-2 flex items-center gap-2">
          <Languages className="w-6 h-6 text-blue-500" />
          {t('language')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('select_language')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {languages.map((lang) => (
          <div
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={clsx(
              "p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02]",
              language === lang.code
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {lang.name}
                </span>
              </div>
              {language === lang.code && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info adicional */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 {t('language_info')}
        </p>
      </div>
    </div>
  );
};

export default LanguageSection;