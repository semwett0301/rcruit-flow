import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import nl from './locales/nl.json';

export const i18nResources = {
  EN: {
    translation: en,
  },
  NL: {
    translation: nl,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: i18nResources,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
