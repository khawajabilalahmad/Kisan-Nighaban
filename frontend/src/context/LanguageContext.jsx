import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const saved = localStorage.getItem('kisan_lang');
    if (saved) {
      setLanguage(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('kisan_lang', lang);
    i18n.changeLanguage(lang);
  };

  const getInitialGreeting = () => {
    switch (language) {
      case 'english':
        return 'Hello! I am your Digital Farmer Assistant. How is your farm today?';
      case 'urdu':
        return 'السلام علیکم! میں آپ کا ڈیجیٹل کسان بھائی ہوں۔ آج کھیت کا کیا حال ہے؟';
      case 'roman-urdu':
      default:
        return 'Asalam o Alaikum! Mai aapka Digital Kisaan Bhai hon. Aaj khet ka haal kaisa hai?';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, getInitialGreeting }}>
      {children}
    </LanguageContext.Provider>
  );
};
