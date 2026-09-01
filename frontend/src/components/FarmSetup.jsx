import { useState, useEffect } from 'react';
import { PAKISTANI_CITIES, CROPS } from '../services/cities';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../services/api';
import { Globe, Droplets, TrendingUp, Sprout, MapPin, Calendar, Navigation, Edit2, Trash2, TriangleAlert } from 'lucide-react';
import BiosphereScene3D from './BiosphereScene3D';

export default function FarmSetup({ onFarmSaved }) {
  const [farms, setFarms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [farmToDelete, setFarmToDelete] = useState(null);

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
                <label htmlFor="city">Nearest City</label>
                <select
                  id="city"
                  value={form.district}
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  <option value="">— Select a city —</option>
                  {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Federal'].map((province) => (
                    <optgroup key={province} label={province}>
                      {PAKISTANI_CITIES.filter((c) => c.province === province).map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group floating">
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.0001"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    readOnly={!!form.district}
                  />
                  <label htmlFor="latitude">Latitude</label>
                </div>
                <div className="form-group floating">
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.0001"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    readOnly={!!form.district}
                  />
                  <label htmlFor="longitude">Longitude</label>
                </div>
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
    </>
  );
}
