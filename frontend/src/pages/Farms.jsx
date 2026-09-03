import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, ChevronRight } from 'lucide-react';

export default function Farms() {
  const navigate = useNavigate();
  const dummyFarms = [
    { id: 1, name: 'North Field', crop: 'Wheat', area: '5 Acres', status: 'Healthy', score: 92 },
    { id: 2, name: 'River Side', crop: 'Cotton', area: '12 Acres', status: 'Needs Water', score: 78 },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">My Farms</h2>
        <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors">
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {dummyFarms.map((farm) => (
          <button key={farm.id} onClick={() => navigate(`/farms/${farm.id}`)} className="w-full text-left bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-transform duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-4 group">
            
            <div className="w-14 h-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Map size={24} className="text-primary dark:text-primary-light" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">{farm.name}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{farm.crop} • {farm.area}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${farm.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                {farm.status}
              </span>
              <div className="flex items-center text-slate-400">
                <span className="font-bold text-lg text-slate-800 dark:text-white mr-1">{farm.score}</span>
                <ChevronRight size={16} />
              </div>
            </div>

          </button>
        ))}
      </div>

      {/* Empty State / Info */}
      {dummyFarms.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-60">
          <Map size={48} className="text-slate-400 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't added any farms yet.<br/>Click the + button to add one.</p>
        </div>
      )}
    </div>
  );
}
