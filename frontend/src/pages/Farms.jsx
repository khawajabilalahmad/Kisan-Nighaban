import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, ChevronRight, X, Navigation, MapPin } from 'lucide-react';
import MapPicker from '../components/MapPicker';

export default function Farms() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    // Simulate API delay for Geocoding/GPS
    setTimeout(() => {
      setLocationName('Faisalabad, Punjab');
      setIsLocating(false);
    }, 1500);
  };

  const handleChooseFromMap = () => {
    setShowMapModal(true);
  };

  const handleConfirmMapLocation = (position) => {
    if (position) {
      // In a real app, you would use a geocoder here. For now we use the coordinates.
      setLocationName(`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
    }
    setShowMapModal(false);
  };
  const dummyFarms = [
    { id: 1, name: 'North Field', crop: 'Wheat', area: '5 Acres', status: 'Healthy', score: 92 },
    { id: 2, name: 'River Side', crop: 'Cotton', area: '12 Acres', status: 'Needs Water', score: 78 },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">My Farms</h2>
      </div>

      {/* Add Farm Button (Floating) */}
      <div className="fixed bottom-24 right-6 z-40">
        <button onClick={() => setShowAddModal(true)} className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-110 active:scale-95">
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[75vh] mb-20 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5 shrink-0">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Add New Farm</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Name</label>
                <input type="text" placeholder="e.g. South Field" className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Crop Type</label>
                <input type="text" placeholder="e.g. Wheat" className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Area (Acres)</label>
                <input type="number" placeholder="e.g. 5" className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Water Source</label>
                  <select className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                    <option value="canal">Canal</option>
                    <option value="tube_well">Tube Well</option>
                    <option value="rain_fed">Rain-fed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Soil Type</label>
                  <select className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                    <option value="loam">Loam</option>
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                  </select>
                </div>
              </div>
              
              {/* Location Picker Section */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Faisalabad, Punjab" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary mb-2" 
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

            {/* Modal Footer (Fixed) */}
            <div className="p-6 pt-4 border-t border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/50 dark:bg-black/20">
              <button onClick={() => setShowAddModal(false)} className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3 transition-colors">
                Save Farm
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
