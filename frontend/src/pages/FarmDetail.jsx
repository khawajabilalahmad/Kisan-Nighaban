import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Thermometer, Wind, AlertTriangle, Trash2, Edit2, Activity } from 'lucide-react';

export default function FarmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Dummy data based on ID
  const farm = {
    id,
    name: id === '1' ? 'North Field' : 'River Side',
    crop: id === '1' ? 'Wheat' : 'Cotton',
    area: id === '1' ? '5 Acres' : '12 Acres',
    score: id === '1' ? 92 : 78,
    lastScanned: '2 days ago',
  };

  const weather = { temp: '32°C', humidity: '45%', wind: '12 km/h' };

  const handleDelete = () => {
    // Simulate delete
    navigate('/farms');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative bg-transparent font-sans">
      
      {/* Dynamic Header */}
      <div className="sticky top-0 z-40 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-6 py-4 flex items-center justify-between transition-colors duration-500">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/farms')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{farm.name}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{farm.crop} • {farm.area}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <Edit2 size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24">
        
        {/* Satellite Map Placeholder Card */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 overflow-hidden relative group">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 relative w-full overflow-hidden">
            {/* Simulated Map SVG */}
            <svg className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M0,50 Q100,100 200,50 T400,50 L400,200 L0,200 Z" fill="#4ade80" />
              <path d="M0,150 Q150,50 250,150 T400,150 L400,200 L0,200 Z" fill="#22c55e" />
              <circle cx="200" cy="100" r="150" fill="url(#grad1)" opacity="0.3" />
              <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white font-bold tracking-wide shadow-sm">NDVI Index</p>
                  <p className="text-white/80 text-sm font-medium shadow-sm">Updated 4 hours ago</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${farm.score > 80 ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-white'}`}>
                  Score: {farm.score}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Climate Analysis) */}
        <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-5 shadow-lg shadow-primary/30 flex items-center justify-between group transition-transform hover:scale-[1.02] active:scale-95">
          <div className="flex flex-col items-start text-left">
            <span className="font-black text-lg tracking-tight">Run Climate Analysis</span>
            <span className="text-sm text-white/80 font-medium">Get precise weather & crop predictions</span>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <Activity size={24} />
          </div>
        </button>

        {/* Weather & Conditions Grid */}
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight pl-1">Local Conditions</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <Thermometer size={24} className="text-red-500 mb-2" />
            <span className="font-bold text-slate-800 dark:text-white">{weather.temp}</span>
          </div>
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <Droplets size={24} className="text-blue-500 mb-2" />
            <span className="font-bold text-slate-800 dark:text-white">{weather.humidity}</span>
          </div>
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <Wind size={24} className="text-teal-500 mb-2" />
            <span className="font-bold text-slate-800 dark:text-white">{weather.wind}</span>
          </div>
        </div>

        {/* AI Recommendations */}
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight pl-1 mt-6">Apna Kisaan Recommendations</h3>
        <div className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur-md p-5 rounded-3xl border border-green-200 dark:border-green-800/50">
          <div className="flex gap-3 mb-2">
            <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-green-900 dark:text-green-300">Action Required</h4>
              <p className="text-sm font-medium text-green-800 dark:text-green-400 mt-1 leading-relaxed">
                Soil moisture is dropping rapidly in the western sector. Recommend irrigating within the next 24 hours to prevent stress.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal (Glassmorphism) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-grow-leaf">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">Delete Farm?</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 font-medium mb-6">Are you sure you want to delete {farm.name}? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
