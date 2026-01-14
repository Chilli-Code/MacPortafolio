// src/components/Settings/sections/GeneralConfig.jsx - ACTUALIZADO

import { Check, Settings, Palette } from '#assets/icons';
import { useAppSettingsStore } from '#store/appSettingsStore';
import { useTranslate } from '#hoc/useTranslate';
import clsx from 'clsx';
import FontSizeSection from '../FontSizeSection';
import DockPositionControl from '#components/Desktop/components/Settings/DockPositionControl'; // 🆕 Import

const GeneralConfig = () => {
  const { language, setLanguage } = useAppSettingsStore();
  const { t } = useTranslate();

  return (
    <div className="space-y-6">
      <h2 className="text-black dark:text-white text-2xl font-semibold mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2b7fff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 text-blue-500"
          aria-hidden="true">

          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="9" cy="6" r="2" fill="currentColor" />

          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="15" cy="12" r="2" fill="currentColor" />

          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="11" cy="18" r="2" fill="currentColor" />
        </svg>

        General
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ajustes Generales
      </p>

      <FontSizeSection />

      {/* 🆕 AGREGAR AQUÍ el control de posición del Dock */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
        <DockPositionControl />
      </div>
    </div>
  );
};

export default GeneralConfig;