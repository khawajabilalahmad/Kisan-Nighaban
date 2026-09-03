import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Moon, Sun, ChevronRight } from 'lucide-react';

export default function Settings() {
  const { language, changeLanguage } = useLanguage();
  
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
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Settings</h2>

      {/* Language Settings Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <Globe size={20} className="text-primary dark:text-primary-light" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">App Language</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300">English</span>
            <input 
              type="radio" 
              name="language" 
              value="english" 
              checked={language === 'english'} 
              onChange={() => changeLanguage('english')}
              className="w-5 h-5 text-primary focus:ring-primary dark:border-slate-600"
            />
          </label>
          
          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300">Roman Urdu (Hinglish)</span>
            <input 
              type="radio" 
              name="language" 
              value="roman-urdu" 
              checked={language === 'roman-urdu'} 
              onChange={() => changeLanguage('roman-urdu')}
              className="w-5 h-5 text-primary focus:ring-primary dark:border-slate-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300 urdu-font text-lg">اردو</span>
            <input 
              type="radio" 
              name="language" 
              value="urdu" 
              checked={language === 'urdu'} 
              onChange={() => changeLanguage('urdu')}
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
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Appearance</h3>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
          <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${isDarkMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </button>
      </div>

      {/* Support Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500">
        <button className="w-full flex items-center justify-between p-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">Help & Support</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
      </div>

    </div>
  );
}
