import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, User, Home, Map, MessageCircle, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SunflowerMascot from './SunflowerMascot';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { t } = useTranslation();
  
  // Manage dark mode state locally for UI reactivity
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(path);

  const [bgHeight, setBgHeight] = useState('100vh');
  
  useEffect(() => {
    // Check initial dark mode preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
    // Lock background height to physical screen size to prevent keyboard squishing
    setBgHeight(`${window.innerHeight}px`);
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
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-gradient-to-b from-sky-200 to-sky-50 dark:from-indigo-950 dark:to-slate-900 transition-colors duration-500 relative">
      <style>{`
        @keyframes flyAcross {
          from { transform: translateX(-150px) translateY(20px); }
          to { transform: translateX(110vw) translateY(-20px); }
        }
        @keyframes flyAcrossReverse {
          from { transform: translateX(110vw) translateY(-10px) scaleX(-1); }
          to { transform: translateX(-150px) translateY(30px) scaleX(-1); }
        }
        .birds-lr-1 { animation: flyAcross 25s linear infinite; }
        .birds-lr-2 { animation: flyAcross 32s linear infinite -15s; }
        .birds-lr-3 { animation: flyAcross 28s linear infinite -8s; }
        .birds-rl-1 { animation: flyAcrossReverse 28s linear infinite -5s; }
        .birds-rl-2 { animation: flyAcrossReverse 35s linear infinite -20s; }
        .birds-rl-3 { animation: flyAcrossReverse 30s linear infinite -12s; }
      `}</style>
      
      {/* Immersive Farm Scene Background - Locked height to prevent keyboard squish */}
      <div 
        className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden z-0" 
        style={{ height: bgHeight }}
      >
        {/* Base Layer (Shows up on auth pages where there is no navbar) */}
        <div className="absolute inset-x-0 bottom-0 h-[64px] bg-[#1a4a2b] dark:bg-black z-0"></div>

        {/* Sun (Light Mode) */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-[2px] opacity-80 shadow-[0_0_60px_rgb(253,224,71)] dark:hidden transition-opacity duration-1000"></div>
        
        {/* Moon (Dark Mode) */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-slate-100 rounded-full blur-[1px] opacity-90 shadow-[0_0_40px_rgba(241,245,249,0.5)] hidden dark:block transition-opacity duration-1000">
          <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-slate-300 opacity-40"></div>
          <div className="absolute top-10 left-10 w-6 h-6 rounded-full bg-slate-300 opacity-30"></div>
          <div className="absolute top-8 left-3 w-3 h-3 rounded-full bg-slate-300 opacity-50"></div>
        </div>

        {/* Stars (Dark Mode Only) */}
        <div className="hidden dark:block absolute inset-0 transition-opacity duration-1000">
          <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]"></div>
          <div className="absolute top-[25%] left-[10%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_3px_white] opacity-60" style={{ animationDuration: '2s' }}></div>
          <div className="absolute top-[15%] left-[50%] w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_6px_white] opacity-80" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-[5%] left-[70%] w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_white] opacity-90" style={{ animationDuration: '1.5s' }}></div>
          <div className="absolute top-[30%] left-[85%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_3px_white] opacity-70" style={{ animationDuration: '2.5s' }}></div>
          <div className="absolute top-[20%] right-[15%] w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-[8%] right-[30%] w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_6px_white] opacity-90" style={{ animationDuration: '2s' }}></div>
          <div className="absolute top-[35%] left-[30%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_3px_white] opacity-50" style={{ animationDuration: '4s' }}></div>
        </div>
        
        {/* Clouds (Clustered on Left) */}
        <div className="absolute top-10 -left-10 opacity-80 drop-shadow-sm scale-125 origin-center blur-[1px]">
          <svg width="250" height="120" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.177 10.2023 17.8576 10.0159C17.3916 6.61907 14.4754 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2338 4.01148 11.4649 4.03387 11.6925C1.7828 12.2133 0 14.2818 0 16.5C0 19.3409 2.50294 21.603 5.4 21.4939L17.5 19Z" fill="white" opacity="0.9" />
            <path d="M15 16C17 16 19 14.5 19 12.5C19 10.5 17.5 8.5 15.5 8.5C15 6 12.5 4 10 4C7 4 4.5 6.5 4.5 9.5C4.5 9.8 4.5 10 4.6 10.3C3 10.8 1.5 12.5 1.5 14.5C1.5 16.8 3.5 18.5 6 18.5L15 16Z" fill="white" opacity="0.6" transform="translate(-1, 1)" />
          </svg>
        </div>

        <div className="absolute top-32 left-[15%] opacity-60 transform scale-110 blur-[2px]">
          <svg width="180" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.177 10.2023 17.8576 10.0159C17.3916 6.61907 14.4754 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2338 4.01148 11.4649 4.03387 11.6925C1.7828 12.2133 0 14.2818 0 16.5C0 19.3409 2.50294 21.603 5.4 21.4939L17.5 19Z" fill="white" opacity="0.8" />
          </svg>
        </div>

        <div className="absolute top-6 left-[30%] opacity-50 transform scale-75 blur-[2px]">
          <svg width="120" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 17C17.5 17 19.5 15 19.5 12.5C19.5 10.3 17.8 8.4 15.6 8.1C15.2 4.9 12.4 2.5 9 2.5C5.4 2.5 2.5 5.4 2.5 9C2.5 9.2 2.5 9.4 2.5 9.6C1 10.1 -0.5 12 -0.5 14C-0.5 16.7 1.8 18.8 4.5 18.7L15 17Z" fill="white" opacity="0.7" />
          </svg>
        </div>
        
        <div className="absolute top-48 left-[5%] opacity-40 transform scale-90 blur-[1px]">
          <svg width="160" height="70" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 17C17.5 17 19.5 15 19.5 12.5C19.5 10.3 17.8 8.4 15.6 8.1C15.2 4.9 12.4 2.5 9 2.5C5.4 2.5 2.5 5.4 2.5 9C2.5 9.2 2.5 9.4 2.5 9.6C1 10.1 -0.5 12 -0.5 14C-0.5 16.7 1.8 18.8 4.5 18.7L15 17Z" fill="white" opacity="0.7" />
          </svg>
        </div>

        {/* Lower Clouds (near Total Farms area) */}
        <div className="absolute top-[35vh] right-[10%] opacity-30 transform scale-75 blur-[2px]">
          <svg width="180" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.177 10.2023 17.8576 10.0159C17.3916 6.61907 14.4754 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2338 4.01148 11.4649 4.03387 11.6925C1.7828 12.2133 0 14.2818 0 16.5C0 19.3409 2.50294 21.603 5.4 21.4939L17.5 19Z" fill="white" opacity="0.8" />
          </svg>
        </div>
        
        <div className="absolute top-[45vh] left-[20%] opacity-20 transform scale-50 blur-[2px]">
          <svg width="150" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 17C17.5 17 19.5 15 19.5 12.5C19.5 10.3 17.8 8.4 15.6 8.1C15.2 4.9 12.4 2.5 9 2.5C5.4 2.5 2.5 5.4 2.5 9C2.5 9.2 2.5 9.4 2.5 9.6C1 10.1 -0.5 12 -0.5 14C-0.5 16.7 1.8 18.8 4.5 18.7L15 17Z" fill="white" opacity="0.7" />
          </svg>
        </div>

        {/* Scattered Flying Birds (In Groups of 2 or 3) */}
        {/* Left to right Group 1 */}
        <div className="absolute top-24 left-0 w-[90px] opacity-70 dark:hidden birds-lr-1">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 Q 20 40 30 50 Q 20 45 10 50 Z" fill="#334155"/>
            <path d="M30 60 Q 40 50 50 60 Q 40 55 30 60 Z" fill="#334155"/>
            <path d="M25 40 Q 35 30 45 40 Q 35 35 25 40 Z" fill="#334155"/>
          </svg>
        </div>

        {/* Left to right Group 2 */}
        <div className="absolute top-[35vh] left-0 w-[80px] opacity-50 dark:hidden birds-lr-2">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 30 Q 30 20 40 30 Q 30 25 20 30 Z" fill="#334155"/>
            <path d="M45 40 Q 55 30 65 40 Q 55 35 45 40 Z" fill="#334155"/>
          </svg>
        </div>

        {/* Left to right Group 3 */}
        <div className="absolute top-[15vh] left-0 w-[110px] opacity-60 dark:hidden birds-lr-3">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 40 Q 25 30 35 40 Q 25 35 15 40 Z" fill="#334155"/>
            <path d="M40 50 Q 50 40 60 50 Q 50 45 40 50 Z" fill="#334155"/>
            <path d="M30 30 Q 40 20 50 30 Q 40 25 30 30 Z" fill="#334155"/>
          </svg>
        </div>

        {/* Right to left Group 1 */}
        <div className="absolute top-32 right-0 w-[100px] opacity-60 dark:hidden birds-rl-1">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 Q 20 40 30 50 Q 20 45 10 50 Z" fill="#334155"/>
            <path d="M35 65 Q 45 55 55 65 Q 45 60 35 65 Z" fill="#334155"/>
          </svg>
        </div>
        
        {/* Right to left Group 2 */}
        <div className="absolute top-[25vh] right-0 w-[120px] opacity-50 dark:hidden birds-rl-2">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 40 Q 30 30 40 40 Q 30 35 20 40 Z" fill="#334155"/>
            <path d="M45 30 Q 55 20 65 30 Q 55 25 45 30 Z" fill="#334155"/>
            <path d="M35 20 Q 45 10 55 20 Q 45 15 35 20 Z" fill="#334155"/>
          </svg>
        </div>

        {/* Right to left Group 3 */}
        <div className="absolute top-[40vh] right-0 w-[70px] opacity-40 dark:hidden birds-rl-3">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 50 Q 40 40 50 50 Q 40 45 30 50 Z" fill="#334155"/>
            <path d="M60 40 Q 70 30 80 40 Q 70 35 60 40 Z" fill="#334155"/>
          </svg>
        </div>

        {/* Greenery / Hills at bottom (3 Layers) - Darker as requested */}
        <div className="absolute bottom-[60px] w-full h-[40vh] opacity-90 dark:opacity-40">
          <svg width="100%" height="100%" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Back Hill */}
            <path fill="#166534" fillOpacity="0.8" d="M0,200L48,180C96,160,192,120,288,130C384,140,480,200,576,210C672,220,768,180,864,160C960,140,1056,140,1152,150C1248,160,1344,180,1392,190L1440,200L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"></path>
            {/* Middle Hill */}
            <path fill="#15803d" fillOpacity="0.9" d="M0,250L60,230C120,210,240,170,360,180C480,190,600,250,720,260C840,270,960,230,1080,210C1200,190,1320,190,1380,190L1440,190L1440,400L1380,400C1320,400,1200,400,1080,400C960,400,840,400,720,400C600,400,480,400,360,400C240,400,120,400,60,400L0,400Z"></path>
            {/* Front Hill */}
            <path fill="#14532d" fillOpacity="1" d="M0,320L80,300C160,280,320,240,480,250C640,260,800,320,960,330C1120,340,1280,300,1360,280L1440,260L1440,400L1360,400C1280,400,1120,400,960,400C800,400,640,400,480,400C320,400,160,400,80,400L0,400Z"></path>
          </svg>
        </div>

        {/* Grass Patches on the hills (Restored and Improved) */}
        <div className="absolute bottom-[22vh] left-[15%] opacity-50 dark:opacity-20 transform scale-[0.9]">
          <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="30" rx="40" ry="10" fill="#064e3b" />
            <ellipse cx="80" cy="35" rx="30" ry="5" fill="#065f46" />
          </svg>
        </div>
        <div className="absolute bottom-[16vh] left-[65%] opacity-60 dark:opacity-30 transform scale-[1.2]">
          <svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="35" rx="60" ry="15" fill="#064e3b" />
            <ellipse cx="120" cy="40" rx="40" ry="10" fill="#065f46" />
            <ellipse cx="30" cy="45" rx="30" ry="8" fill="#047857" />
          </svg>
        </div>
        <div className="absolute bottom-[28vh] right-[25%] opacity-40 dark:opacity-15 transform scale-[0.7]">
          <svg width="100" height="30" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="20" rx="50" ry="10" fill="#064e3b" />
          </svg>
        </div>

        {/* Trees on the hills (Emoji version) */}
        {/* Distant trees on the hills */}
        <div className="absolute bottom-[18vh] right-[30%] text-[45px] leading-none transform scale-90 drop-shadow-sm select-none opacity-85 dark:opacity-65 z-0">
          🌲
        </div>
        <div className="absolute bottom-[11vh] right-[45%] text-[40px] leading-none transform scale-90 drop-shadow-sm select-none opacity-80 dark:opacity-60 z-0">
          🌳
        </div>

        {/* Background Flowers in foreground */}
        {!isAuthPage && (
          <>
            <div className="absolute bottom-[80px] left-[40%] opacity-30 dark:opacity-10 transform scale-[0.3]">
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="47" y="50" width="6" height="50" fill="#15803d" />
                <circle cx="50" cy="50" r="15" fill="#facc15" />
                <circle cx="50" cy="30" r="12" fill="#ef4444" />
                <circle cx="70" cy="50" r="12" fill="#ef4444" />
                <circle cx="50" cy="70" r="12" fill="#ef4444" />
                <circle cx="30" cy="50" r="12" fill="#ef4444" />
              </svg>
            </div>
            <div className="absolute bottom-[70px] left-[50%] opacity-30 dark:opacity-10 transform scale-[0.25]">
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="47" y="50" width="6" height="50" fill="#15803d" />
                <circle cx="50" cy="50" r="15" fill="#facc15" />
                <circle cx="50" cy="30" r="12" fill="#a855f7" />
              </svg>
            </div>
          </>
        )}

        {/* Cow SVG on the hill */}
        <div className="absolute bottom-[100px] left-[15%] opacity-40 dark:opacity-20 transform scale-[0.4] origin-bottom-left pointer-events-none z-0">
          <svg width="150" height="100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M464,256c-18.3,0-35.4,3.2-50.8,9.1c-14.9-20.7-33-35.2-46.7-41.9c-29.3-14.3-63.5-12.7-88.3-9.5c-48.4,6.2-76.4,27-90.8,42.8 c-10.4-3.6-21.7-5.5-33.5-5.5c-42,0-78.5,25.6-94,62.2C24.4,321.7,0,358.3,0,400c0,17.7,14.3,32,32,32h160c17.7,0,32-14.3,32-32 c0-21.6-9.1-41-23.7-54.8c12.2-13.9,35-30.8,75-35.9c13.7-1.8,32.7-2.3,55.5,5c7.8,2.5,18,7.9,30.3,18.4C375.4,345,392.3,352,416,352 c35.3,0,64-28.7,64-64S444.6,256,464,256z" fill="#475569"/>
            <circle cx="432" cy="272" r="8" fill="#1e293b"/>
            <path d="M464,224c-8.8,0-16,7.2-16,16v16c0,8.8,7.2,16,16,16s16-7.2,16-16v-16C480,231.2,472.8,224,464,224z" fill="#cbd5e1"/>
          </svg>
        </div>

        {/* Large Foreground Tree (Bottom Left, half off-screen) */}
        <div className="absolute bottom-[60px] -left-[20%] text-[240px] leading-none transform origin-bottom-left pointer-events-none z-0 drop-shadow-lg select-none opacity-100 dark:opacity-80">
          🌳
        </div>
      </div>

      {/* Header - Glassmorphism */}
      {!isAuthPage && (
        <header dir="ltr" className="flex-none relative z-50 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-500">
          <div className="flex items-center">
            <img src="/logo.png" alt="Kisan Nighaban" className="h-10 w-auto object-contain drop-shadow-sm transform scale-[1.7] origin-left" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block">
              {isDarkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-slate-600" />}
            </button>
            <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <Bell size={22} className="text-slate-600 dark:text-slate-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black animate-pulse"></span>
            </button>
            <button onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow ml-1">
               <User size={24} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 overflow-y-auto">
        <Outlet />
      </main>

      {/* Conditionally render SunflowerMascot exactly where it used to be at the root layer ONLY on Dashboard */}
      {path === '/' && (
        <div className="fixed bottom-[60px] right-2 z-[5] scale-[0.65] origin-bottom-right pointer-events-auto">
          <SunflowerMascot />
        </div>
      )}

      {/* Bottom Navigation - Glassmorphism */}
      {!isAuthPage && (
        <nav dir="ltr" className="h-[64px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex justify-around items-center px-2 shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe relative">
          <Link to="/" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${path === '/' ? 'text-primary' : 'text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary'}`}>
            <Home size={26} className={path === '/' ? 'fill-primary' : ''} />
            <span className="text-xs mt-1 font-semibold tracking-wide">{t('nav.home')}</span>
          </Link>
          <Link to="/farms" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${path === '/farms' ? 'text-primary' : 'text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary'}`}>
            <Map size={26} className={path === '/farms' ? 'fill-primary' : ''} />
            <span className="text-xs mt-1 font-semibold tracking-wide">{t('nav.farms')}</span>
          </Link>
          <Link to="/chat" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${path === '/chat' ? 'text-primary' : 'text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary'}`}>
            <MessageCircle size={26} className={path === '/chat' ? 'fill-primary' : ''} />
            <span className="text-xs mt-1 font-semibold tracking-wide">{t('nav.chatbot')}</span>
          </Link>
          <Link to="/settings" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${path === '/settings' ? 'text-primary' : 'text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary'}`}>
            <Settings size={26} className={path === '/settings' ? 'fill-primary' : ''} />
            <span className="text-xs mt-1 font-semibold tracking-wide">{t('nav.settings')}</span>
          </Link>
        </nav>
      )}

    </div>
  );
}
