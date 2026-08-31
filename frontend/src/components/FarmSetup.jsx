import { useState, useEffect } from 'react';
import { PAKISTANI_CITIES, CROPS } from '../services/cities';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../services/api';
import { Globe, Droplets, TrendingUp, Cloud, Sun, Sprout, Wind, MapPin, Calendar, Navigation, Edit2, Trash2 } from 'lucide-react';

export default function FarmSetup({ onFarmSaved }) {
  const [farms, setFarms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    crop_type: 'wheat',
    sowing_date: '',
    district: '',
    latitude: '',
    longitude: '',
  });

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
  }

  async function handleDelete(farmId) {
    if (!confirm('Delete this farm?')) return;
    try {
      await deleteFarm(farmId);
      await loadFarms();
      setSuccess('Farm deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelEdit() {
    setForm({ name: '', crop_type: 'wheat', sowing_date: '', district: '', latitude: '', longitude: '' });
    setEditingId(null);
  }

  return (
    <div className="farm-setup" style={{ position: 'relative', overflow: 'hidden', padding: '20px 0' }}>
      {/* Floating Background Shapes */}
      <div className="bg-icon icon-1"><Cloud size={400} strokeWidth={1.2} /></div>
      <div className="bg-icon icon-2"><Sun size={500} strokeWidth={1.2} /></div>
      <div className="bg-icon icon-3"><Sprout size={350} strokeWidth={1.2} /></div>
      <div className="bg-icon icon-4"><Wind size={450} strokeWidth={1.2} /></div>

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

      <div className="value-props-container animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3>Why use Kisan Nighaban?</h3>
        <div className="value-props-grid">
          <div className="value-prop-card">
            <div className="vp-icon"><Globe size={36} color="var(--primary)" /></div>
            <h4>Real-Time Climate Tracking</h4>
            <p>Monitor localized weather patterns and stay ahead of extreme conditions.</p>
          </div>
          <div className="value-prop-card">
            <div className="vp-icon"><Droplets size={36} color="var(--secondary)" /></div>
            <h4>Drought & Flood Alerts</h4>
            <p>Receive early warnings based on AI-driven risk models.</p>
          </div>
          <div className="value-prop-card">
            <div className="vp-icon"><TrendingUp size={36} color="var(--accent)" /></div>
            <h4>Yield Protection Advice</h4>
            <p>Get actionable recommendations to protect your specific crop type.</p>
          </div>
        </div>
      </div>

      {farms.length > 0 && (
        <div className="farms-list animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3>Registered Farms</h3>
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
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(farm.id)} title="Delete">
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
    </div>
  );
}
