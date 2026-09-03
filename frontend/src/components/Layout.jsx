import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Settings, Bell, Moon, Sun, User, Map } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-transparent">
      {/* Header - Glassmorphism */}
      <header className="flex-none relative z-50 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-500">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
            <span className="text-white font-bold text-lg -rotate-3">K</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-secondary-light dark:from-primary-light dark:to-secondary-light tracking-tight">Kisan Nighaban</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block">
            {isDarkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-slate-600" />}
          </button>
          <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Bell size={22} className="text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
          </button>
          <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow ml-1">
             <User size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 pb-20 relative">
        <Outlet />
      </main>

      {/* Bottom Navigation - Glassmorphism */}
      <nav className="fixed bottom-0 w-full bg-white/70 dark:bg-black/50 backdrop-blur-xl border-t border-white/20 dark:border-white/10 px-6 py-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50 transition-colors duration-500">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${path === '/' ? 'text-primary dark:text-primary-light scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105'}`}>
            <Home size={24} strokeWidth={path === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </Link>
          
          <Link to="/farms" className={`flex flex-col items-center gap-1 transition-all ${path === '/farms' ? 'text-primary dark:text-primary-light scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105'}`}>
            <Map size={24} strokeWidth={path === '/farms' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">Farms</span>
          </Link>
          
          <Link to="/chat" className={`flex flex-col items-center gap-1 transition-all ${path === '/chat' ? 'text-primary dark:text-primary-light scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105'}`}>
            <MessageCircle size={24} strokeWidth={path === '/chat' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">Chatbot</span>
          </Link>
          
          <Link to="/settings" className={`flex flex-col items-center gap-1 transition-all ${path === '/settings' ? 'text-primary dark:text-primary-light scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105'}`}>
            <Settings size={24} strokeWidth={path === '/settings' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
