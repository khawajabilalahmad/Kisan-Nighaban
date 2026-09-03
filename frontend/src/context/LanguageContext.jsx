import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const updateDocumentLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    if (lang === 'ur') {
      document.body.classList.add('urdu-font');
    } else {
      document.body.classList.remove('urdu-font');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('kisan_lang');
    if (saved) {
      setLanguage(saved);
      i18n.changeLanguage(saved);
      updateDocumentLanguage(saved);
    } else {
      updateDocumentLanguage('en');
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('kisan_lang', lang);
    i18n.changeLanguage(lang);
    updateDocumentLanguage(lang);
  };

  const getInitialGreeting = () => {
    switch (language) {
      case 'ur':
        return 'السلام علیکم! میں آپ کا ڈیجیٹل کسان بھائی ہوں۔ آج کھیت کا کیا حال ہے؟';
      case 'ru':
        return 'Asalam o Alaikum! Mai aapka Digital Kisaan Bhai hon. Aaj khet ka haal kaisa hai?';
      case 'en':
      default:
        return 'Hello! I am your Digital Farmer Assistant. How is your farm today?';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, getInitialGreeting }}>
      {children}
    </LanguageContext.Provider>
  );
};
