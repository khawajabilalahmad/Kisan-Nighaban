import { useState, useEffect } from 'react';
import { PAKISTANI_CITIES, CROPS } from '../services/cities';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../services/api';
import { Globe, Droplets, TrendingUp, Sprout, MapPin, Calendar, Navigation, Edit2, Trash2, TriangleAlert } from 'lucide-react';
import BiosphereScene3D from './BiosphereScene3D';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function FarmSetup({ onFarmSaved }) {
  const [farms, setFarms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [farmToDelete, setFarmToDelete] = useState(null);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [form, setForm] = useState({
    name: '',
    crop_type: 'wheat',
    sowing_date: '',
    district: '',
    latitude: '',
    longitude: '',
  });

  // Ensure the page starts at the top when navigating from the bottom CTA
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadFarms();
  }, []);

  async function loadFarms() {
    try {
      const data = await getFarms();
      setFarms(data);
    } catch (err) {
      setError('Failed to load farms');
    }
  }

  function handleCityChange(cityName) {
    const city = PAKISTANI_CITIES.find((c) => c.name === cityName);
    if (city) {
      setForm((prev) => ({
        ...prev,
        district: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));
    }
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setTempLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return tempLocation ? <Marker position={[tempLocation.lat, tempLocation.lng]} /> : null;
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setTempLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSaveLocation() {
    if (!tempLocation) {
      setIsMapOpen(false);
      return;
    }
    
    // Attempt reverse geocoding to get a name for the district/address
    let locationName = '';
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${tempLocation.lat}&lon=${tempLocation.lng}`);
      const data = await res.json();
      if (data && data.address) {
        locationName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || 'Selected Location';
      }
    } catch (err) {
      console.error("Reverse geocoding error", err);
    }

    setForm(prev => ({
      ...prev,
      latitude: tempLocation.lat.toFixed(4),
      longitude: tempLocation.lng.toFixed(4),
      district: locationName || 'Selected Location'
    }));
    setIsMapOpen(false);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      };

      if (editingId) {
        await updateFarm(editingId, payload);
        setSuccess('Farm updated successfully!');
      } else {
        await createFarm(payload);
        setSuccess('Farm registered successfully!');
      }

      setForm({ name: '', crop_type: 'wheat', sowing_date: '', district: '', latitude: '', longitude: '' });
      setEditingId(null);
      await loadFarms();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(farm) {
    setForm({
      name: farm.name,
      crop_type: farm.crop_type,
      sowing_date: farm.sowing_date,
      district: farm.district || '',
      latitude: String(farm.latitude),
      longitude: String(farm.longitude),
    });
    setEditingId(farm.id);
    setError('');
    setSuccess('');
    // Scroll to the top where the form is located
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function executeDelete() {
    if (!farmToDelete) return;
    try {
      await deleteFarm(farmToDelete.id);
      await loadFarms();
      setSuccess('Farm deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setFarmToDelete(null);
    }
  }

  function cancelEdit() {
    setForm({ name: '', crop_type: 'wheat', sowing_date: '', district: '', latitude: '', longitude: '' });
    setEditingId(null);
  }

  return (
    <>
      <div className="setup-split-layout">
        
        {/* Left Pane: Forms */}
        <div className="setup-left-pane">
          <div className="form-card glass-panel animate-fade-in-up">
            <h2>{editingId ? 'Edit Farm' : 'Register Your Farm'}</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group floating">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  autoComplete="off"
                />
                <label htmlFor="name">Farm Name</label>
              </div>

              <div className="form-group">
                <label htmlFor="crop_type">Crop Type</label>
                <select id="crop_type" name="crop_type" value={form.crop_type} onChange={handleChange} required>
                  {CROPS.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group floating">
                <input
                  id="sowing_date"
                  name="sowing_date"
                  type="date"
                  value={form.sowing_date}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="sowing_date">Sowing Date</label>
              </div>

              <div className="form-group">
                <label>Farm Location</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setTempLocation(form.latitude && form.longitude ? { lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) } : { lat: 30.3753, lng: 69.3451 });
                      setIsMapOpen(true);
                    }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <MapPin size={18} />
                    {form.latitude ? 'Change Location' : 'Select Farm Location'}
                  </button>
                </div>
                {form.latitude && (
                  <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} />
                      <strong>{form.district || 'Selected Location'}</strong>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '20px' }}>
                      {parseFloat(form.latitude).toFixed(4)}°N, {parseFloat(form.longitude).toFixed(4)}°E
                    </span>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Farm' : 'Save Farm'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Pane: 3D Climate Biosphere */}
        <div className="setup-right-pane animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <BiosphereScene3D />
        </div>
      </div>
      {farms.length > 0 && (
        <div className="farms-list animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginTop: '2rem' }}>Registered Farms</h2>
          <div className="farms-grid">
            {farms.map((farm) => (
              <div key={farm.id} className="farm-card glass-panel">
                <div className="farm-card-header">
                  <div className="farm-title-group">
                    <h4>{farm.name}</h4>
                    <span className="crop-badge"><Sprout size={12} /> {farm.crop_type}</span>
                  </div>
                  <div className="farm-card-actions-top">
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(farm)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => setFarmToDelete(farm)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="farm-card-body">
                  <div className="farm-meta-item">
                    <MapPin size={16} className="meta-icon location-icon" />
                    <span>{farm.district || 'No district'}</span>
                  </div>
                  <div className="farm-meta-item">
                    <Calendar size={16} className="meta-icon calendar-icon" />
                    <span>Sown {farm.sowing_date}</span>
                  </div>
                  <div className="farm-meta-item">
                    <Navigation size={16} className="meta-icon nav-icon" />
                    <span>{farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E</span>
                  </div>
                </div>

                {onFarmSaved && (
                  <div className="farm-card-footer">
                    <button className="btn btn-primary btn-small" onClick={() => onFarmSaved(farm.id)}>
                      View Dashboard
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {farmToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            padding: '2.5rem', borderRadius: '24px', maxWidth: '400px', width: '90%',
            textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
              margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
            }}>
              <TriangleAlert size={40} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text)' }}>Delete Farm?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{farmToDelete.name}</strong>? This action cannot be undone and all historical climate data will be lost.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setFarmToDelete(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={executeDelete} style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444', color: 'white' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade-in-up" style={{
            padding: '1.5rem', borderRadius: '24px', maxWidth: '800px', width: '95%',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>Select Farm Location</h3>
              <button type="button" onClick={() => setIsMapOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '2rem', lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location (e.g. Lahore, Punjab)..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }}
              />
              <button type="submit" className="btn btn-primary" disabled={isSearching} style={{ padding: '10px 24px' }}>
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>

            <div style={{ height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MapContainer 
                center={tempLocation && tempLocation.lat ? [tempLocation.lat, tempLocation.lng] : [30.3753, 69.3451]} 
                zoom={tempLocation && tempLocation.lat ? 10 : 5} 
                style={{ height: '100%', width: '100%', zIndex: 1 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
              </MapContainer>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsMapOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveLocation} disabled={!tempLocation}>
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
