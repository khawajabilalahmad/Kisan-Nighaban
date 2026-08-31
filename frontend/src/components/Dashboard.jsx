import { useState, useEffect } from 'react';
import { getFarm, getWeather, assessRisk, getLatestRisk } from '../services/api';
import RiskGauge from './RiskGauge';
import RiskBreakdown from './RiskBreakdown';
import Recommendations from './Recommendations';
import ForecastChart from './ForecastChart';
import { ArrowLeft, Sprout, MapPin, Thermometer, Droplets, CloudRain, Wind, Activity, RefreshCw } from 'lucide-react';

export default function Dashboard({ farmId, onBack }) {
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (farmId) loadDashboard();
  }, [farmId]);

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [farmData, weatherData] = await Promise.all([
        getFarm(farmId),
        getWeather(farmId),
      ]);
      setFarm(farmData);
      setWeather(weatherData);

      // Try to load latest risk assessment
      try {
        const latestRisk = await getLatestRisk(farmId);
        setRisk(latestRisk);
      } catch {
        // No risk assessment yet — that's fine
        setRisk(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssess() {
    setAssessing(true);
    setError('');
    try {
      const result = await assessRisk(farmId);
      setRisk(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setAssessing(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading farm data...</p>
        </div>
      </div>
    );
  }

  if (error && !farm) {
    return (
      <div className="dashboard">
        <div className="error-screen">
          <p>Failed to load dashboard: {error}</p>
          <button className="btn btn-primary" onClick={onBack}>
            Back to Farms
          </button>
        </div>
      </div>
    );
  }

  const currentWeather = weather?.weather?.current;
  const growthStage = weather?.current_growth_stage;

  return (
    <div className="dashboard">
      {/* Farm Header */}
      <div className="dashboard-header animate-fade-in-up">
        <button className="btn btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Farms
        </button>
        <div className="farm-info">
          <h2>
            {farm?.name} — <span className="crop-text">{farm?.crop_type}</span>
          </h2>
          <div className="farm-badges">
            {growthStage && (
              <span className="badge badge-stage">
                <Sprout size={14} color="var(--primary)" /> {growthStage.replace(/-/g, ' ')}
              </span>
            )}
            {farm?.district && (
              <span className="badge badge-location">
                <MapPin size={14} color="red" /> {farm.district}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Current Weather Summary */}
      {currentWeather && (
        <div className="current-weather glass-panel animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3>Current Conditions</h3>
          <div className="weather-stats">
            <div className="stat">
              <Thermometer className="stat-icon" size={28} color="#F97316" />
              <span className="stat-value">{Math.round(currentWeather.temperature_2m)}°C</span>
              <span className="stat-label">Temperature</span>
            </div>
            <div className="stat">
              <Droplets className="stat-icon" size={28} color="#3B82F6" />
              <span className="stat-value">{currentWeather.relative_humidity_2m}%</span>
              <span className="stat-label">Humidity</span>
            </div>
            <div className="stat">
              <CloudRain className="stat-icon" size={28} color="#0EA5E9" />
              <span className="stat-value">{currentWeather.precipitation} mm</span>
              <span className="stat-label">Precipitation</span>
            </div>
            <div className="stat">
              <Wind className="stat-icon" size={28} color="#94A3B8" />
              <span className="stat-value">{Math.round(currentWeather.wind_speed_10m)} km/h</span>
              <span className="stat-label">Wind Speed</span>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Section */}
      <div className="risk-section glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="risk-header">
          <h3><Activity size={20} color="var(--accent)" /> Climate Risk Assessment</h3>
          <button
            className="btn btn-primary"
            onClick={handleAssess}
            disabled={assessing}
          >
            {assessing ? (
              <>
                <span className="btn-spinner" /> Analyzing...
              </>
            ) : risk ? (
              <><RefreshCw size={16} /> Re-assess Risk</>
            ) : (
              <><Activity size={16} /> Run Risk Assessment</>
            )}
          </button>
        </div>

        {assessing && (
          <div className="assessing-state">
            <div className="spinner" />
            <p>Analyzing weather data and crop conditions...</p>
          </div>
        )}

        {risk && !assessing && (
          <div className="risk-content">
            <div className="risk-top">
              <div className="risk-gauge-container">
                <RiskGauge score={risk.risk_score} level={risk.risk_level} />
              </div>
              <div className="risk-breakdown-container">
                <RiskBreakdown breakdown={risk.risk_breakdown} />
              </div>
            </div>

            {risk.summary && (
              <div className="risk-summary">
                <p>{risk.summary}</p>
              </div>
            )}

            <Recommendations recommendations={risk.recommendations} />
          </div>
        )}

        {!risk && !assessing && (
          <div className="no-risk-state">
            <p>No risk assessment available yet.</p>
            <p className="subtext">Click "Run Risk Assessment" to analyze climate risks for your farm.</p>
          </div>
        )}
      </div>

      {/* 7-Day Forecast */}
      <ForecastChart weather={weather?.weather} />
    </div>
  );
}
