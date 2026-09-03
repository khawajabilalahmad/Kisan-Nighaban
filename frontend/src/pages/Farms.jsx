import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, ChevronRight, X, Navigation, MapPin } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import { farmsAPI } from '../services/api';

export default function Farms() {
  const navigate = useNavigate();
  
  // Farm List State
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add Farm Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    sowing_date: new Date().toISOString().split('T')[0],
    area: '',
    water_source: 'canal',
    soil_type: 'loamy'
  });
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const data = await farmsAPI.getFarms();
      setFarms(data);
    } catch (error) {
      console.error("Failed to fetch farms", error);
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
          alert("Could not get your location. Please check browser permissions.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  const handleChooseFromMap = () => {
    setShowMapModal(true);
  };

  const handleConfirmMapLocation = (position) => {
    if (position) {
      setCoordinates(position);
      setLocationName(`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)} (Map)`);
    }
    setShowMapModal(false);
  };

  const handleSaveFarm = async () => {
    if (!formData.name || !formData.crop_type) {
      alert("Please fill all required fields");
      return;
    }
    if (!coordinates) {
      alert("Please select a location");
      return;
    }
    setSaving(true);
    try {
      await farmsAPI.createFarm({
        name: formData.name,
        crop_type: formData.crop_type,
        soil_type: formData.soil_type,
        water_source: formData.water_source,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        sowing_date: formData.sowing_date,
        district: "Unknown" // Can be enhanced with reverse geocoding
      });
      setShowAddModal(false);
      setFormData({ name: '', crop_type: '', sowing_date: new Date().toISOString().split('T')[0], area: '', water_source: 'canal', soil_type: 'loamy' });
      setCoordinates(null);
      setLocationName('');
      fetchFarms();
    } catch (error) {
      console.error("Failed to save farm", error);
      alert("Failed to save farm.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto pb-24">
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
            
            <div className="p-6 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5 shrink-0">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Add New Farm</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. South Field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Crop Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Wheat" 
                    value={formData.crop_type}
                    onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sowing Date</label>
                  <input 
                    type="date" 
                    value={formData.sowing_date}
                    onChange={(e) => setFormData({...formData, sowing_date: e.target.value})}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Area (Acres)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5" 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Water Source</label>
                  <select 
                    value={formData.water_source}
                    onChange={(e) => setFormData({...formData, water_source: e.target.value})}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="canal">Canal</option>
                    <option value="tube_well">Tube Well</option>
                    <option value="rain_fed">Rain-fed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Soil Type</label>
                  <select 
                    value={formData.soil_type}
                    onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                    className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="loamy">Loam</option>
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="silt">Silt</option>
                  </select>
                </div>
              </div>
              
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

            <div className="p-6 pt-4 border-t border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/50 dark:bg-black/20">
              <button onClick={handleSaveFarm} disabled={saving} className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3 transition-colors disabled:opacity-70">
                {saving ? 'Saving...' : 'Save Farm'}
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
        {loading ? (
          <div className="text-center py-10 opacity-60 font-medium">Loading farms...</div>
        ) : farms.length > 0 ? (
          farms.map((farm) => (
            <button key={farm.id} onClick={() => navigate(`/farms/${farm.id}`)} className="w-full text-left bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-transform duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-4 group">
              
              <div className="w-14 h-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Map size={24} className="text-primary dark:text-primary-light" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">{farm.name}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{farm.crop_type} • {farm.water_source}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-green-500">
                  HEALTHY
                </span>
                <div className="flex items-center text-slate-400">
                  <span className="font-bold text-lg text-slate-800 dark:text-white mr-1">90</span>
                  <ChevronRight size={16} />
                </div>
              </div>

            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-60">
            <Map size={48} className="text-slate-400 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't added any farms yet.<br/>Click the + button to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
