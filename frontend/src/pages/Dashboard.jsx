import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CloudRain, Wind, Plus, BellRing, CloudLightning, Droplets, Thermometer, ChevronRight, Activity, MapPin } from 'lucide-react';
import SunflowerMascot from '../components/SunflowerMascot';
import { useAuth } from '../context/AuthContext';
import { weatherAPI, analysisAPI, farmsAPI } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [mascotState, setMascotState] = useState('idle'); // idle, alert
  const [alertMsg, setAlertMsg] = useState('');
  
  // Real data state
  const [weatherData, setWeatherData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeFarm, setActiveFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // First, get the user's farms
      const farms = await farmsAPI.getFarms();
      
      if (farms && farms.length > 0) {
        const primaryFarm = farms[0];
        setActiveFarm(primaryFarm);
        const primaryFarmId = primaryFarm.id;
        
        // Fetch weather and analysis for the first farm
        try {
          const wData = await weatherAPI.getWeather(primaryFarmId);
          setWeatherData(wData);
        } catch (e) {
          console.error("No weather data", e);
        }
        
        try {
          const aData = await analysisAPI.getLatestAnalysis(primaryFarmId);
          setAnalysisData(aData);
        } catch (e) {
          console.error("No analysis data", e);
        }
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ask for notification permissions on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-8 pb-32">
      
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Salam, {user?.full_name?.split(' ')[0] || 'Kisan'} 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Here is your farm overview today.</p>
      </div>

      {/* Global Weather Widget */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(34,197,94,0.3)] dark:shadow-[0_8px_30px_rgb(34,197,94,0.15)] relative overflow-hidden transition-transform hover:scale-[1.02] duration-300">
        
        {/* Background Sun Graphic */}
        <div className="absolute right-2 bottom-2 text-white/20">
          <Sun size={96} />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full min-h-[100px]">
          <h3 className="font-bold text-green-100 mb-1 tracking-wide">
            Welcome to
          </h3>
          <div className="text-3xl font-black tracking-tighter text-white">
            Apka Apna Nighaban
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Quick Actions</h3>
        <button onClick={() => navigate('/farms')} className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 dark:border-white/10 flex items-center gap-4 shadow-sm hover:scale-[1.02] active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <Plus size={24} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-lg">Add New Farm</span>
            <span className="text-sm text-slate-500 font-medium">Start monitoring a new field</span>
          </div>
        </button>
      </div>

      {/* Original Sunflower Mascot Companion */}
      <div className="fixed bottom-[64px] right-2 z-50 scale-[0.65] origin-bottom-right" onClick={() => setMascotState('idle')}>
        <SunflowerMascot />
        
        {/* Simple Alert Bubble layered over the mascot */}
        {mascotState === 'alert' && alertMsg && (
          <div className="absolute bottom-[90%] right-[30%] mb-2 animate-bounce bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-br-none shadow-lg border border-red-100 dark:border-red-900/30 z-[60] pointer-events-none whitespace-nowrap">
            <p className="font-bold text-red-600 dark:text-red-400 text-lg">Action Needed!</p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-red-100 dark:border-red-900/30"></div>
          </div>
        )}
      </div>

    </div>
  );
}
