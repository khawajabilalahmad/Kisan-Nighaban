import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import urTranslations from './locales/ur.json';

const resources = {
  english: { translation: enTranslations },
  'roman-urdu': { translation: ruTranslations },
  urdu: { translation: urTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('kisan_lang') || 'english', // Get default from localStorage (LanguageContext)
    fallbackLng: 'english',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
