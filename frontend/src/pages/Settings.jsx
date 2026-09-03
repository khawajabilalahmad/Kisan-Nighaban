import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, ChevronRight, ChevronDown, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [showSupport, setShowSupport] = React.useState(false);
  
  // Manage dark mode state locally for UI reactivity
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    const nextState = !isDarkMode;
    setIsDarkMode(nextState);
    if (nextState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto pb-32">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">{t('settings.title')}</h2>

      {/* Language Settings Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <Globe size={20} className="text-primary dark:text-primary-light" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t('settings.app_language')}</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300">English</span>
            <input 
              type="radio" 
              name="language" 
              value="en" 
              checked={language === 'en'} 
              onChange={() => changeLanguage('en')}
              className="w-5 h-5 text-primary focus:ring-primary dark:border-slate-600"
            />
          </label>
          
          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300">Roman Urdu (Hinglish)</span>
            <input 
              type="radio" 
              name="language" 
              value="ru" 
              checked={language === 'ru'} 
              onChange={() => changeLanguage('ru')}
              className="w-5 h-5 text-primary focus:ring-primary dark:border-slate-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300 urdu-font text-lg">اردو</span>
            <input 
              type="radio" 
              name="language" 
              value="ur" 
              checked={language === 'ur'} 
              onChange={() => changeLanguage('ur')}
              className="w-5 h-5 text-primary focus:ring-primary dark:border-slate-600"
            />
          </label>
        </div>
      </div>

      {/* Appearance Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
            {isDarkMode ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-yellow-500" />}
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t('settings.appearance')}</h3>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="font-medium text-slate-700 dark:text-slate-300">{t('settings.dark_mode')}</span>
          <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${isDarkMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </button>
      </div>

      {/* Support Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500">
        <button 
          onClick={() => setShowSupport(!showSupport)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="font-medium text-slate-700 dark:text-slate-300">{t('settings.support')}</span>
          <ChevronDown size={20} className={`text-slate-400 transition-transform ${showSupport ? 'rotate-180' : ''}`} />
        </button>

        {showSupport && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <a href="mailto:support@kisan-nighaban.pk" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-primary dark:text-primary-light">
              <Mail size={18} />
              <span className="font-medium text-sm">{t('settings.contact')}</span>
            </a>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('settings.inquiries')}</p>
              <a href="mailto:contact@jshub.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline block mt-0.5">
                contact@jshub.com
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
