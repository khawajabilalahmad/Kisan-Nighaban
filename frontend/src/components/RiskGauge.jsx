import { useState, useEffect } from 'react';

export default function RiskGauge({ score, level }) {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    setDisplayedScore(0);
    
    let startTime;
    const duration = 1200; // 1.2s animation
    const targetScore = Math.min(100, Math.max(0, score));

    function animate(time) {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setDisplayedScore(Math.round(easeProgress * targetScore));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayedScore(targetScore);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  const clampedScore = displayedScore;
  const angle = -90 + (clampedScore / 100) * 180;

  const colorMap = {
    low: 'var(--risk-low)',
    moderate: 'var(--risk-moderate)',
    high: 'var(--risk-high)',
    critical: 'var(--risk-critical)',
  };
  const color = colorMap[level] || colorMap.low;

  // SVG arc for the gauge background
  const cx = 120, cy = 110, r = 90;
  const startAngle = -180;
  const endAngle = 0;

  function polarToCartesian(angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(start, end) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  // Colored arc segments
  const segments = [
    { start: -180, end: -135, color: 'var(--risk-low)' },
    { start: -135, end: -90, color: 'var(--risk-moderate)' },
    { start: -90, end: -45, color: 'var(--risk-high)' },
    { start: -45, end: 0, color: 'var(--risk-critical)' },
  ];

  // Needle position
  const needleAngle = (-180 + (clampedScore / 100) * 180) * (Math.PI / 180);
  const needleLen = 70;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy + needleLen * Math.sin(needleAngle);

  return (
    <div className="risk-gauge">
      <svg viewBox="0 0 240 140" width="240" height="140">
        {/* Background arc segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(seg.start, seg.end)}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeLinecap="round"
            opacity={0.25}
          />
        ))}

        {/* Active arc — filled portion */}
        {segments.map((seg, i) => {
          const segStart = seg.start;
          const segEnd = seg.end;
          const activeEnd = -180 + (clampedScore / 100) * 180;
          if (segStart >= activeEnd) return null;
          const clampedEnd = Math.min(segEnd, activeEnd);
          return (
            <path
              key={`active-${i}`}
              d={describeArc(segStart, clampedEnd)}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill={color} />

        {/* Score text */}
        <text x={cx} y={cy + 30} textAnchor="middle" className="gauge-score" fill={color} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}>
          {clampedScore}
        </text>
        <text x={cx} y={cy + 46} textAnchor="middle" className="gauge-level" fill="var(--text-muted)">
          {(level || 'unknown').toUpperCase()}
        </text>

        {/* Scale labels */}
        <text x="20" y="130" textAnchor="middle" className="gauge-label" fill="var(--text-light)">0</text>
        <text x={cx} y="14" textAnchor="middle" className="gauge-label" fill="var(--text-light)">50</text>
        <text x="220" y="130" textAnchor="middle" className="gauge-label" fill="var(--text-light)">100</text>
      </svg>
    </div>
  );
}
