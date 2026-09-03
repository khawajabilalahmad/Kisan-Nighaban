import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Droplets, MapPin, Plus, Wind, CloudRain, Sun, Calendar, Thermometer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { weatherAPI, analysisAPI, farmsAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getInitialGreeting } = useLanguage();
  const { t } = useTranslation();
  
  // Real data state
  const [farmsList, setFarmsList] = useState([]);
  const [activeFarm, setActiveFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // First, get the user's farms
      const fetchedFarms = await farmsAPI.getFarms();
      if (fetchedFarms && fetchedFarms.length > 0) {
        setFarmsList(fetchedFarms);
        setActiveFarm(fetchedFarms[0]);
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
      
      {/* Header Content (Transparent to show global background) */}
      <div className="w-full flex flex-col justify-between mb-8 mt-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white drop-shadow-md">{t('dashboard.greeting')}, {user?.full_name?.split(' ')[0] || 'Kisan'}</h2>
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-6">
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md px-5 py-4 rounded-3xl border border-white/50 dark:border-white/10 text-slate-800 dark:text-white shadow-lg">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{t('dashboard.total_farms')}</p>
            <p className="text-4xl font-black leading-none">{farmsList.length}</p>
          </div>
        </div>
      </div>

      {/* Farms Quick Access */}
      {farmsList.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">{t('dashboard.your_farms')}</h3>
            <button onClick={() => navigate('/farms')} className="text-sm font-bold text-primary hover:underline">{t('dashboard.view_all')}</button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            {farmsList.map(farm => (
              <button 
                key={farm.id}
                onClick={() => navigate(`/farms/${farm.id}`)}
                className="min-w-[160px] bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/50 dark:border-white/10 flex flex-col justify-between shadow-sm hover:scale-[1.02] active:scale-95 transition-transform snap-center text-left"
              >
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                  <MapPin size={20} />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white truncate w-full">{farm.name}</h4>
                <p className="text-xs font-medium text-slate-500 truncate w-full">{farm.crop_type} • {farm.district}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">{t('dashboard.quick_actions')}</h3>
        <button onClick={() => navigate('/farms')} className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 dark:border-white/10 flex items-center gap-4 shadow-sm hover:scale-[1.02] active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <Plus size={24} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-lg">{t('dashboard.add_farm')}</span>
            <span className="text-sm text-slate-500 font-medium">Start monitoring a new field</span>
          </div>
        </button>
      </div>

    </div>
  );
}
