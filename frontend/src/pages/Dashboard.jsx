import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CloudRain, Wind, Plus, BellRing, CloudLightning } from 'lucide-react';
import SunflowerMascot from '../components/SunflowerMascot';

export default function Dashboard() {
  const navigate = useNavigate();
  const [mascotState, setMascotState] = useState('idle'); // idle, alert
  const [alertMsg, setAlertMsg] = useState('');

  // Ask for notification permissions on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const simulateAlert = () => {
    setMascotState('alert');
    setAlertMsg('Sudden Downpour Detected at North Field! Soil moisture is spiking. Adjust your irrigation schedule.');
    
    // Simulate push notification via browser alert
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Kisan Nighaban Alert', {
        body: 'Sudden Downpour Detected at North Field! Adjust your irrigation schedule.',
      });
    }
  };

  const handleDismissAlert = () => {
    setMascotState('idle');
    setAlertMsg('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-8 pb-32">
      
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Salam, Ali 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Here is your farm overview today.</p>
      </div>

      {/* Global Weather Widget */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white shadow-[0_10px_40px_rgba(59,130,246,0.3)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform duration-700">
          <Sun size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-blue-100 mb-1 tracking-wide">Faisalabad, PK</h3>
          <div className="text-5xl font-black tracking-tighter mb-4">34°C</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <CloudRain size={16} /> <span className="font-bold text-sm">0%</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Wind size={16} /> <span className="font-bold text-sm">12 km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/farms')} className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 dark:border-white/10 flex flex-col items-center justify-center gap-3 shadow-sm hover:scale-105 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">Add Farm</span>
          </button>
          
          <button onClick={simulateAlert} className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col items-center justify-center gap-3 shadow-sm hover:scale-105 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center animate-pulse">
              <BellRing size={24} />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">Simulate Alert</span>
          </button>
        </div>
      </div>

      {/* Original Sunflower Mascot Companion */}
      <div className="fixed bottom-[64px] right-4 z-40 scale-50 origin-bottom-right" onClick={handleDismissAlert}>
        
        {/* Simple Alert Bubble layered over the mascot */}
        {mascotState === 'alert' && alertMsg && (
          <div className="absolute bottom-full right-20 mb-2 animate-bounce bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-br-none shadow-lg border border-red-100 dark:border-red-900/30 z-50 pointer-events-none whitespace-nowrap">
            <p className="font-bold text-red-600 dark:text-red-400 text-lg">Rain Detected!</p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-red-100 dark:border-red-900/30"></div>
          </div>
        )}

        <SunflowerMascot />
      </div>

    </div>
  );
}
