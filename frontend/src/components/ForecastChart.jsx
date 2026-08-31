export default function ForecastChart({ weather }) {
  if (!weather || !weather.daily) {
    return (
      <div className="forecast-chart">
        <h3>7-Day Forecast</h3>
        <p className="empty-state">No forecast data available.</p>
      </div>
    );
  }

  const { daily } = weather;
  const days = daily.time || [];
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];
  const precipitation = daily.precipitation_sum || [];
  const windSpeed = daily.wind_speed_10m_max || [];

  // Find temperature range for scaling
  const allTemps = [...maxTemps, ...minTemps].filter((t) => t != null);
  const minT = Math.min(...allTemps);
  const maxT = Math.max(...allTemps);
  const range = maxT - minT || 1;

  function getWeatherIcon(precip, temp) {
    if (precip > 10) return '🌧️';
    if (precip > 2) return '🌦️';
    if (temp > 40) return '🔥';
    if (temp > 35) return '☀️';
    return '⛅';
  }

  function formatDay(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const barMaxHeight = 80;

  return (
    <div className="forecast-chart">
      <h3>7-Day Forecast</h3>
      <div className="forecast-grid">
        {days.map((day, i) => {
          const maxTemp = maxTemps[i];
          const minTemp = minTemps[i];
          const precip = precipitation[i];
          const wind = windSpeed[i];
          const barHeight = ((maxTemp - minT) / range) * barMaxHeight;
          const minBarHeight = ((minTemp - minT) / range) * barMaxHeight;

          return (
            <div key={day} className="forecast-day">
              <span className="forecast-weekday">{formatDay(day)}</span>
              <span className="forecast-date">{formatDate(day)}</span>
              <span className="forecast-icon">{getWeatherIcon(precip, maxTemp)}</span>

              <div className="temp-bar-container">
                <div className="temp-bar-wrapper" style={{ height: barMaxHeight + 'px' }}>
                  <div
                    className="temp-bar"
                    style={{
                      height: Math.max(barHeight - minBarHeight, 8) + 'px',
                      bottom: minBarHeight + 'px',
                    }}
                  />
                </div>
              </div>

              <div className="forecast-temps">
                <span className="temp-max">{Math.round(maxTemp)}°</span>
                <span className="temp-min">{Math.round(minTemp)}°</span>
              </div>

              {precip > 0 && (
                <span className="forecast-rain" title={`${precip}mm rain`}>
                  💧{Math.round(precip)}mm
                </span>
              )}
              <span className="forecast-wind" title={`${wind} km/h wind`}>
                💨{Math.round(wind)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
