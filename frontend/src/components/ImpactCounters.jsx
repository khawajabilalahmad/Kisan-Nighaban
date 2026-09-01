import React, { useState, useEffect, useRef } from 'react';
import { Target, Leaf, Activity, CloudSun } from 'lucide-react';
import './LandingPage.css';

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [inView, setInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = Math.floor(ease * target);
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={elementRef}>{count}</span>;
};

const stats = [
  { label: 'Crops Supported', target: 5, prefix: '', suffix: '', icon: <Leaf size={24} color="var(--primary)" /> },
  { label: 'Extreme Threats', target: 4, prefix: '', suffix: '', icon: <CloudSun size={24} color="var(--secondary)" /> }, // Heat, drought, flood, wind
  { label: 'AI Monitoring', target: 24, prefix: '', suffix: '/7', icon: <Activity size={24} color="var(--accent)" /> },
  { label: 'Accuracy Goal', target: 99, prefix: '', suffix: '%', icon: <Target size={24} color="var(--primary-dark)" /> }
];

export default function ImpactCounters() {
  return (
    <section className="impact-section animate-fade-in-up" style={{ 
      margin: '0rem 0 -2rem 0',
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      padding: '0'
    }}>
      <div className="animated-stripes-container">
        <div className="impact-inner-bar">
          {stats.map((stat, i) => (
            <div key={i} className="impact-stat-item">
              <div className="impact-icon-wrapper" style={{ animationDelay: `${i * 0.5}s` }}>
                {stat.icon}
              </div>
              <div className="impact-text-wrapper">
                <div className="impact-number">
                  {stat.prefix}<Counter target={stat.target} />{stat.suffix}
                </div>
                <div className="impact-label">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animated-stripes-container {
          position: relative;
          border-radius: 0;
          padding: 6px 0; /* Slightly thicker top and bottom moving border */
          background: repeating-linear-gradient(
            45deg,
            var(--primary) 0,
            var(--primary) 20px,
            var(--secondary) 20px,
            var(--secondary) 40px,
            var(--accent) 40px,
            var(--accent) 60px
          );
          background-size: 85px 85px;
          animation: moveStripes 2s linear infinite;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
        }

        @keyframes moveStripes {
          0% { background-position: 0 0; }
          100% { background-position: 85px 0; } /* 85px is approx 60 * sqrt(2) */
        }

        .impact-inner-bar {
          background: var(--bg);
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          flex-wrap: wrap;
          padding: 0.5rem 2rem; /* Significantly reduced vertical padding */
          gap: 1rem;
        }

        .impact-stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .impact-icon-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0,0,0,0.03);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
          50% { transform: scale(1.15); box-shadow: 0 0 15px currentColor; background: rgba(255,255,255,0.8); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
        }

        /* Set currentColor for the wrapper based on the child icon so the glow matches */
        .impact-stat-item:nth-child(1) .impact-icon-wrapper { color: var(--primary); }
        .impact-stat-item:nth-child(2) .impact-icon-wrapper { color: var(--secondary); }
        .impact-stat-item:nth-child(3) .impact-icon-wrapper { color: var(--accent); }
        .impact-stat-item:nth-child(4) .impact-icon-wrapper { color: var(--primary-dark); }

        .impact-text-wrapper {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .impact-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
        }

        .impact-label {
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .animated-stripes-container {
            border-radius: 24px;
          }
          .impact-inner-bar {
            border-radius: 20px;
            flex-direction: column;
            align-items: flex-start;
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
