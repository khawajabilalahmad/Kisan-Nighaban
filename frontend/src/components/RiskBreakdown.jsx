import { ThermometerSun, SunDim, Waves, Wind } from 'lucide-react';

export default function RiskBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const categories = [
    { key: 'heat_stress', label: 'Heat Stress', icon: <ThermometerSun size={16} /> },
    { key: 'drought', label: 'Drought', icon: <SunDim size={16} /> },
    { key: 'flooding', label: 'Flooding', icon: <Waves size={16} /> },
    { key: 'wind_damage', label: 'Wind Damage', icon: <Wind size={16} /> },
  ];

  function getColor(value) {
    if (value >= 70) return 'var(--risk-critical)';
    if (value >= 50) return 'var(--risk-high)';
    if (value >= 30) return 'var(--risk-moderate)';
    return 'var(--risk-low)';
  }

  return (
    <div className="risk-breakdown">
      <h3>Risk Breakdown</h3>
      <div className="breakdown-list">
        {categories.map(({ key, label, icon }) => {
          const value = breakdown[key] ?? 0;
          return (
            <div key={key} className="breakdown-item">
              <div className="breakdown-label">
                <span className="breakdown-icon">{icon}</span>
                <span>{label}</span>
                <span className="breakdown-value">{value}</span>
              </div>
              <div className="breakdown-bar-bg">
                <div
                  className="breakdown-bar-fill"
                  style={{
                    width: `${value}%`,
                    backgroundColor: getColor(value),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
