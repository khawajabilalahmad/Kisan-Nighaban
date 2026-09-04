import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Thermometer, Wind, AlertTriangle, Trash2, Edit2, Activity, X, Navigation, MapPin, Sprout, CloudRain, Bot } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import { farmsAPI, weatherAPI, analysisAPI, activitiesAPI } from '../services/api';
import { reverseGeocode } from '../utils/geocoding';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function FarmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [farm, setFarm] = useState(null);
  const [activities, setActivities] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [weather, setWeather] = useState({ temp: '--°C', humidity: '--%', wind: '-- km/h' });
  const [dailyForecast, setDailyForecast] = useState(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  const [editData, setEditData] = useState({});
  const [activityData, setActivityData] = useState({ activity_type: 'Watering', description: '' });
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Generate historical data based on sowing date
  const generateMockData = () => {
    if (!analysisData || !farm) return [];
    
    const start = new Date(farm.sowing_date);
    const end = new Date();
    const data = [];
    
    // If farm was planted this exact month, pad with previous month = 0 to show a line
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
       const prevMonth = new Date(start);
       prevMonth.setMonth(prevMonth.getMonth() - 1);
       data.push({
         month: prevMonth.toLocaleString('default', { month: 'short' }),
         score: 0
       });
    }

    let current = new Date(start);
    while (current <= end || (current.getMonth() === end.getMonth() && current.getFullYear() === end.getFullYear())) {
      const isLast = current.getMonth() === end.getMonth() && current.getFullYear() === end.getFullYear();
      data.push({
        month: current.toLocaleString('default', { month: 'short' }),
        score: isLast ? analysisData.health_score : Math.max(0, analysisData.health_score - Math.floor(Math.random() * 20))
      });
      current.setMonth(current.getMonth() + 1);
      if (data.length > 12) break; // cap at 12 months
    }
    
    return data;
  };

  const mockHistoricalData = generateMockData();

  useEffect(() => {
    fetchFarmData();
  }, [id]);

  const fetchFarmData = async () => {
    try {
      const data = await farmsAPI.getFarm(id);
      setFarm(data);
      setEditData({
        name: data.name,
        crop_type: data.crop_type,
        area: data.area,
        water_source: data.water_source,
        soil_type: data.soil_type
      });
      setCoordinates({ lat: data.latitude, lng: data.longitude });
      
      reverseGeocode(data.latitude, data.longitude).then(addressName => {
        setLocationName(addressName);
      });
      
      // Simulate fetching weather
      // Fetch Weather Data
      try {
        const wData = await weatherAPI.getWeather(id);
        if (wData && wData.weather) {
          setWeather({
            temp: wData.weather.current?.temperature_2m + '°C' || '--°C',
            humidity: wData.weather.current?.relative_humidity_2m + '%' || '--%',
            wind: wData.weather.current?.wind_speed_10m + ' km/h' || '--'
          });
          if (wData.weather.daily) {
            setDailyForecast(wData.weather.daily);
          }
        }
      } catch (err) {
        console.error("No weather data", err);
      }
      // Fetch Activities
      try {
        const acts = await activitiesAPI.getActivities(id);
        setActivities(acts || []);
      } catch (err) {
        console.error("No activities", err);
      }

      // Fetch Analysis Data
      try {
        const aData = await analysisAPI.getLatestAnalysis(id);
        setAnalysisData(aData);
      } catch (err) {
        console.error("No analysis data", err);
      }
    } catch (error) {
      console.error("Failed to fetch farm details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)} (GPS)`);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error("Could not get your location");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("Geolocation not supported");
      setIsLocating(false);
    }
  };

  const handleChooseFromMap = () => {
    setShowMapModal(true);
  };

  const handleConfirmMapLocation = (position) => {
    if (position) {
      setLocationName(`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
      setCoordinates(position);
    }
    setShowMapModal(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await farmsAPI.deleteFarm(id);
      toast.success("Farm deleted successfully!");
      navigate('/farms');
    } catch (error) {
      console.error("Failed to delete farm", error);
      toast.error("Failed to delete farm");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await farmsAPI.updateFarm(id, {
        ...editData,
        area: editData.area ? parseFloat(editData.area) : 0,
        latitude: coordinates ? coordinates.lat : farm.latitude,
        longitude: coordinates ? coordinates.lng : farm.longitude,
        district: locationName.replace(' (GPS)', '')
      });
      setShowEditModal(false);
      toast.success("Farm updated successfully!");
      fetchFarmData();
    } catch (error) {
      console.error("Failed to update farm", error);
      toast.error("Failed to update farm");
    } finally {
      setSaving(false);
    }
  };

  const handleLogActivity = async () => {
    if (!activityData.activity_type) return;
    setSaving(true);
    try {
      await activitiesAPI.createActivity(id, activityData);
      setShowActivityModal(false);
      setActivityData({ activity_type: 'Watering', description: '' });
      toast.success("Activity logged successfully!");
      fetchFarmData(); // Refresh the list
    } catch (error) {
      console.error("Failed to log activity", error);
      toast.error("Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setAnalyzingStep(0);
      
      const steps = [
        "Gathering local weather data...",
        "Analyzing crop growth stage...",
        "Evaluating recent activities...",
        "Generating Apna Kisaan recommendations..."
      ];
      
      // Simulate steps progressing while the real API call happens
      let stepInterval = setInterval(() => {
        setAnalyzingStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500);

      await analysisAPI.requestNewAnalysis(id, i18n.language);
      
      clearInterval(stepInterval);
      setAnalyzingStep(4); // Final step
      toast.success("Climate analysis generated!");
      
      await fetchFarmData();
    } catch (error) {
      console.error("Failed to generate analysis", error);
      toast.error("Failed to generate analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center font-bold text-slate-500">{t('farm_detail.loading')}</div>;
  }

  if (!farm) {
    return <div className="flex-1 flex items-center justify-center font-bold text-slate-500">{t('farm_detail.not_found')}</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative font-sans">
      
      {/* Dynamic Header */}
      <div className="sticky top-0 z-40 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-6 py-4 flex items-center justify-between transition-colors duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/farms')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{farm.name}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">
              {farm.crop_type} 
              {farm.area ? ` • ${farm.area} Acres` : ' • Area not set'} 
              {farm.district && farm.district !== 'Unknown' ? ` • ${farm.district}` : ' • Location not set'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEditModal(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <Edit2 size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32">
        
        {/* Combined Farm Health Score & Trend Card */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 overflow-hidden relative group">
          <div className="relative w-full overflow-hidden transition-colors duration-500">
            {/* Background Gradient based on Health Score */}
            <div className={`absolute inset-0 opacity-80 dark:opacity-60 mix-blend-multiply dark:mix-blend-overlay ${
              !analysisData ? 'bg-slate-300 dark:bg-slate-700' :
              analysisData.health_score > 80 ? 'bg-gradient-to-tr from-green-400 to-emerald-600' :
              analysisData.health_score > 60 ? 'bg-gradient-to-tr from-yellow-400 to-amber-600' :
              'bg-gradient-to-tr from-orange-500 to-red-600'
            }`}></div>
            
            {/* Content overlay */}
            <div className="relative z-10 flex flex-col p-5 pb-2">
              
              {/* Header (Score and Info) */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white font-black tracking-wide shadow-sm text-xl mb-1">
                    {t('farm_detail.health_score')}
                  </p>
                  <p className="text-white/90 text-sm font-medium shadow-sm flex items-center gap-1.5">
                    <Activity size={14} />
                    {analysisData ? `${t('farm_detail.updated')} ${new Date(analysisData.assessed_at).toLocaleDateString()}` : t('farm_detail.run_analysis_score')}
                  </p>
                </div>
                {analysisData && (
                  <div className={`px-4 py-2 rounded-2xl text-lg font-black tracking-wider backdrop-blur-md border border-white/20 shadow-xl ${
                    analysisData.health_score > 80 ? 'bg-green-500/80 text-white' :
                    analysisData.health_score > 60 ? 'bg-yellow-500/80 text-white' :
                    'bg-red-500/80 text-white'
                  }`}>
                    {analysisData.health_score} / 100
                  </div>
                )}
              </div>

              {/* Chart */}
              {analysisData && (
                <div className="h-44 w-full mt-2" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHistoricalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                        itemStyle={{ fontWeight: 'bold', color: '#333' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#ffffff" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#ffffff', strokeWidth: 2, stroke: 'rgba(0,0,0,0.2)' }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowActivityModal(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-3xl p-4 shadow-lg shadow-blue-500/30 flex flex-col items-start justify-center group transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 transform group-hover:-rotate-12 transition-transform">
              <Droplets size={20} />
            </div>
            <span className="font-black text-base tracking-tight leading-tight">{t('farm_detail.save_activity')}</span>
          </button>

          <button 
            onClick={() => navigate('/chat', { state: { farmId: farm.id, autoMsg: true, farmName: farm.name } })}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-3xl p-4 shadow-lg shadow-teal-500/30 flex flex-col items-start justify-center group transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 transform group-hover:-rotate-12 transition-transform">
              <Bot size={22} />
            </div>
            <span className="font-black text-base tracking-tight leading-tight">{t('farm_detail.ask_ai')}</span>
          </button>
        </div>

        {/* 7-Day Weather Forecast */}
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight pl-1 mt-6">{t('farm_detail.weather')}</h3>
        {dailyForecast ? (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl p-5 border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
            {/* Horizontal Day Slider */}
            <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
              {dailyForecast.time.map((dateStr, idx) => {
                const date = new Date(dateStr);
                const dayName = idx === 0 ? t('farm_detail.today') : date.toLocaleDateString('en-US', { weekday: 'short' });
                const isSelected = selectedDayIdx === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`min-w-[80px] snap-center rounded-2xl p-3 flex flex-col items-center transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">{dayName}</span>
                    <span className="font-black text-lg mt-1">{Math.round(dailyForecast.temperature_2m_max[idx])}°</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Details */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <Thermometer size={20} className="text-orange-500 mb-1" />
                <span className="font-bold text-sm text-slate-800 dark:text-white">
                  {Math.round(dailyForecast.temperature_2m_max[selectedDayIdx])}° / {Math.round(dailyForecast.temperature_2m_min[selectedDayIdx])}°
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{t('farm_detail.high_low')}</span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <CloudRain size={20} className="text-blue-500 mb-1" />
                <span className="font-bold text-sm text-slate-800 dark:text-white">
                  {dailyForecast.precipitation_sum[selectedDayIdx]} mm
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{t('farm_detail.rain')}</span>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <Wind size={20} className="text-teal-500 mb-1" />
                <span className="font-bold text-sm text-slate-800 dark:text-white">
                  {dailyForecast.wind_speed_10m_max[selectedDayIdx]} km/h
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{t('farm_detail.max_wind')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-white/10 text-center">
            <span className="text-slate-500">{t('farm_detail.loading_forecast')}</span>
          </div>
        )}

        {/* Run Analysis Button (Moved Below Weather) */}
        <button 
          onClick={handleGenerateAnalysis}
          disabled={isAnalyzing}
          className={`w-full ${isAnalyzing ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95'} rounded-3xl p-5 flex items-center justify-between group transition-transform`}
        >
          <div className="flex flex-col items-start text-left">
            <span className="font-black text-lg tracking-tight">
              {isAnalyzing ? t('farm_detail.analyzing') : t('farm_detail.run_climate')}
            </span>
            <span className={`text-sm ${isAnalyzing ? 'text-slate-400 dark:text-slate-400' : 'text-white/80'} font-medium`}>
              {isAnalyzing 
                ? ["Gathering local weather data...", "Analyzing crop growth stage...", "Evaluating recent activities...", "Generating Apna Kisaan recommendations...", "Finalizing..."][analyzingStep] 
                : t('farm_detail.get_predictions')}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transform transition-transform ${isAnalyzing ? 'bg-slate-300/50 dark:bg-slate-600/50 animate-pulse' : 'bg-white/20 backdrop-blur-md group-hover:rotate-12'}`}>
            <Activity size={24} className={isAnalyzing ? 'animate-bounce' : ''} />
          </div>
        </button>

        {/* AI Recommendations */}
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight pl-1 mt-6">{t('farm_detail.kisaan_analysis')}</h3>
        
        {!analysisData ? (
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-700/50">
            <Activity size={32} className="text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{t('farm_detail.click_run')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recommendation */}
            <div className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur-md p-5 rounded-3xl border border-green-200 dark:border-green-800/50 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center shrink-0">
                  <Sprout size={20} className="text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-300">{t('farm_detail.action_required')}</h4>
                  <p className="text-sm font-medium text-green-800 dark:text-green-400 mt-1 leading-relaxed">
                    {analysisData.recommendations && analysisData.recommendations.length > 0 
                      ? analysisData.recommendations[0].detail 
                      : t('farm_detail.no_actions')}
                  </p>
                </div>
              </div>
            </div>

            {/* Climate Risk Breakdown */}
            <div className="bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-md p-5 rounded-3xl border border-orange-200 dark:border-orange-800/50 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-orange-700 dark:text-orange-300" />
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-orange-900 dark:text-orange-300">{t('farm_detail.climate_risks')}</h4>
                  {analysisData.analysis_breakdown ? (
                    <div className="mt-2 space-y-2">
                      {Object.entries(analysisData.analysis_breakdown).map(([risk, score]) => (
                        <div key={risk} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-800 dark:text-orange-400 capitalize">
                            {t(`farm_detail.${risk}`, risk.replace('_', ' '))}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-orange-200 dark:bg-orange-800/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-orange-500 rounded-full" 
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-orange-900 dark:text-orange-300 w-6 text-right">
                              {score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-400 mt-1 leading-relaxed">
                      Risk data pending.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mascot Tip */}
            <div className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-md p-5 rounded-3xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-700/30 text-blue-500">
                <Bot size={28} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm uppercase tracking-wider">{t('farm_detail.kisaan_tip')}</h4>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-400 mt-0.5 italic">
                  "{analysisData.mascot_daily_tip?.en || 'Have a great farming day!'}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log */}
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight pl-1 mt-6">{t('farm_detail.recent_activities')}</h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center p-6 text-slate-400 bg-white/60 dark:bg-black/40 rounded-3xl border border-white/50 dark:border-white/10">
              {t('farm_detail.no_activities')}
            </div>
          ) : (
            activities.map(act => (
              <div key={act.id} className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/50 dark:border-white/10 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  {act.activity_type.toLowerCase().includes('water') ? <Droplets size={18} /> : <Activity size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{act.activity_type}</h4>
                  {act.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{act.description}</p>}
                  <p className="text-xs text-slate-400 font-medium mt-1">{new Date(act.date_logged).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-grow-leaf">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">{t('farm_detail.delete_farm')}</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 font-medium mb-6">{t('farm_detail.delete_confirm')} {farm.name}?</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t('farm_detail.cancel')}
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors disabled:opacity-70"
              >
                {deleting ? t('farm_detail.deleting') : t('farm_detail.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Farm Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[75vh] mb-20 overflow-hidden">
            
            <div className="p-6 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5 shrink-0">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t('farm_detail.edit_farm')}</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Name</label>
                <input 
                  type="text" 
                  value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Crop Type</label>
                <select 
                  value={editData.crop_type} 
                  onChange={(e) => setEditData({...editData, crop_type: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="wheat">{t('crops.wheat')}</option>
                  <option value="rice">{t('crops.rice')}</option>
                  <option value="cotton">{t('crops.cotton')}</option>
                  <option value="maize">{t('crops.maize')}</option>
                  <option value="other">{t('crops.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Area</label>
                <input 
                  type="number" 
                  value={editData.area || ''} 
                  onChange={(e) => setEditData({...editData, area: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Water Source</label>
                  <select 
                    value={editData.water_source} 
                    onChange={(e) => setEditData({...editData, water_source: e.target.value})}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="canal">{t('water_sources.canal')}</option>
                    <option value="tube_well">{t('water_sources.tube_well')}</option>
                    <option value="rain_fed">{t('water_sources.rain_fed')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Soil Type</label>
                  <select 
                    value={editData.soil_type} 
                    onChange={(e) => setEditData({...editData, soil_type: e.target.value})}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="loamy">{t('soil_types.loamy')}</option>
                    <option value="clay">{t('soil_types.clay')}</option>
                    <option value="sandy">{t('soil_types.sandy')}</option>
                    <option value="silt">{t('soil_types.silt')}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Location</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary mb-2" 
                />
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-lg text-xs font-bold transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50"
                  >
                    <Navigation size={14} className={isLocating ? 'animate-spin' : ''} />
                    {isLocating ? 'Locating...' : 'Current Location'}
                  </button>
                  <button 
                    onClick={handleChooseFromMap}
                    disabled={isLocating}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold transition-colors hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    <MapPin size={14} />
                    Choose on Map
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/50 dark:bg-black/20">
              <button onClick={handleSaveEdit} disabled={saving} className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3 transition-colors disabled:opacity-70">
                {saving ? t('farm_detail.saving') : t('farm_detail.save_changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white">Pin Location</h3>
              <button onClick={() => setShowMapModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <MapPicker onConfirm={handleConfirmMapLocation} />
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-slate-50 dark:bg-slate-800 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-900">
              <h2 className="text-xl font-black text-slate-800 dark:text-white">Save Activity</h2>
              <button onClick={() => setShowActivityModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Activity Type</label>
                <select 
                  value={activityData.activity_type}
                  onChange={(e) => setActivityData({...activityData, activity_type: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none" 
                >
                  <option value="Watering">💧 Watering / Irrigation</option>
                  <option value="Fertilizing">🌱 Fertilizing</option>
                  <option value="Pesticide">🐛 Pesticide Spray</option>
                  <option value="Harvesting">🌾 Harvesting</option>
                  <option value="Other">📌 Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details (Optional)</label>
                <textarea 
                  placeholder="e.g. Watered field for 2 hours via tubewell"
                  value={activityData.description}
                  onChange={(e) => setActivityData({...activityData, description: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none" 
                />
              </div>

              <button 
                onClick={handleLogActivity}
                disabled={saving}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-transform active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Activity'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
