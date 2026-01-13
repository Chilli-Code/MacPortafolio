// src/hooks/useTranslate.js

import { useAppSettingsStore } from '#store/appSettingsStore';
import { translations } from '#constants/translations';

export const useTranslate = () => {
  const language = useAppSettingsStore(state => state.language);

  const t = (key) => {
    return translations[language]?.[key] || translations['es'][key] || key;
  };

  return { t, language };
};