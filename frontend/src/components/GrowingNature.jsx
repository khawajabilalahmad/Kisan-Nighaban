import React from 'react';

export default function GrowingNature() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-end">
      
      {/* Floating Fireflies / Ambient Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-20 left-10 w-2 h-2 bg-yellow-300 rounded-full blur-[1px] animate-pulse shadow-[0_0_10px_rgba(253,224,71,0.8)]" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 right-12 w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px] animate-pulse shadow-[0_0_8px_rgba(253,224,71,0.8)]" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-60 left-1/4 w-2 h-2 bg-yellow-400 rounded-full blur-[1px] animate-pulse shadow-[0_0_12px_rgba(253,224,71,0.8)]" style={{ animationDuration: '2.5s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-1/4 w-3 h-3 bg-primary-light rounded-full blur-[2px] animate-pulse opacity-50 shadow-[0_0_15px_rgba(74,222,128,0.5)]" style={{ animationDuration: '5s' }}></div>
      </div>

      {/* Animated Wheat Stalks & Leaves */}
      <div className="relative w-full max-w-sm mx-auto h-48 animate-sway origin-bottom z-10 opacity-90 dark:opacity-70">
        
        {/* Left Stalk */}
        <svg className="absolute bottom-0 left-4 w-16 h-32 text-primary opacity-0 animate-grow-leaf drop-shadow-md" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }} viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 200 Q20 100 40 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 150 Q10 130 5 100 Q30 110 42 140" fill="currentColor" />
          <path d="M43 90 Q15 60 10 30 Q35 45 42 80" fill="currentColor" />
          <path d="M42 30 Q25 10 20 -10 Q40 5 42 25" fill="currentColor" />
        </svg>

        {/* Right Stalk */}
        <svg className="absolute bottom-0 right-4 w-20 h-40 text-secondary opacity-0 animate-grow-leaf drop-shadow-md" style={{ animationDelay: '0.4s', animationDuration: '1.8s' }} viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 200 Q80 100 60 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M52 160 Q90 140 95 110 Q70 120 58 150" fill="currentColor" />
          <path d="M57 100 Q85 70 90 40 Q65 55 58 90" fill="currentColor" />
          <path d="M58 40 Q75 20 80 0 Q60 15 58 35" fill="currentColor" />
        </svg>

        {/* Center Small Leaves */}
        <svg className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-12 h-24 text-primary-light opacity-0 animate-grow-leaf drop-shadow-md" style={{ animationDelay: '0.6s' }} viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 100 Q25 50 25 0" stroke="currentColor" strokeWidth="2" />
          <path d="M25 70 Q5 60 0 40 Q15 45 25 65" fill="currentColor" />
          <path d="M25 40 Q45 30 50 10 Q35 15 25 35" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
