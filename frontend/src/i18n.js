import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import urTranslations from './locales/ur.json';

const resources = {
  en: { translation: enTranslations },
  ru: { translation: ruTranslations },
  ur: { translation: urTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('kisan_lang') || 'en', // Get default from localStorage (LanguageContext)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
