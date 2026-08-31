import { AlertOctagon, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations">
        <h3>Recommendations</h3>
        <p className="empty-state">No recommendations yet. Run a risk assessment first.</p>
      </div>
    );
  }

  const urgencyColors = {
    immediate: 'var(--risk-critical)',
    'within-48-hours': 'var(--risk-high)',
    'this-week': 'var(--risk-moderate)',
    routine: 'var(--risk-low)',
  };

  const priorityIcons = {
    1: <AlertOctagon size={18} color="var(--risk-critical)" />,
    2: <AlertTriangle size={18} color="var(--risk-high)" />,
    3: <AlertCircle size={18} color="var(--risk-moderate)" />,
    4: <CheckCircle size={18} color="var(--risk-low)" />,
  };

  return (
    <div className="recommendations">
      <h3>Recommendations</h3>
      <div className="rec-list">
        {recommendations
          .sort((a, b) => a.priority - b.priority)
          .map((rec, idx) => (
            <div 
              key={idx} 
              className="rec-card"
              style={{ borderLeft: `4px solid ${urgencyColors[rec.urgency] || 'var(--border)'}` }}
            >
              <div className="rec-header">
                <span className="rec-priority-icon">
                  {priorityIcons[rec.priority] || <CheckCircle size={18} color="var(--risk-low)" />}
                </span>
                <h4 className="rec-title">{rec.title}</h4>
                {rec.urgency && (
                  <span
                    className="urgency-badge"
                    style={{ backgroundColor: urgencyColors[rec.urgency] || '#6B7280' }}
                  >
                    {rec.urgency.replace(/-/g, ' ')}
                  </span>
                )}
              </div>
              <p className="rec-detail">{rec.detail}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
