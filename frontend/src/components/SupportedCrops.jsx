import React from 'react';
import { Wheat, Sprout, Leaf, Sun, Trees } from 'lucide-react';
import './LandingPage.css';

const crops = [
  { name: 'Wheat', icon: <Wheat size={36} />, color: 'var(--primary)', desc: 'Optimized risk thresholds for heat stress during flowering stages.' },
  { name: 'Cotton', icon: <Sprout size={36} />, color: 'var(--secondary)', desc: 'Advanced monitoring for heavy rainfall and late-season flooding.' },
  { name: 'Rice', icon: <Leaf size={36} />, color: 'var(--accent)', desc: 'Drought and water scarcity alerts specifically calibrated for paddy fields.' },
  { name: 'Maize', icon: <Sun size={36} />, color: '#F59E0B', desc: 'Wind damage and high temperature risk profiling.' },
  { name: 'Sugarcane', icon: <Trees size={36} />, color: 'var(--primary-dark)', desc: 'Long-term water stress tracking across the entire growing season.' },
];

export default function SupportedCrops() {
  return (
    <section className="supported-crops-section animate-fade-in-up" style={{ marginTop: '4rem', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="section-title">Supported Crops</h2>
        <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Our AI understands the unique climate vulnerabilities of Pakistan's major crops.</p>
      </div>
      
      <div className="crops-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {crops.map((crop) => (
          <div key={crop.name} className="crop-card glass-panel" style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="crop-icon glowing-crop-icon" style={{ 
              color: crop.color, 
              background: 'rgba(255,255,255,0.8)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              '--glow-color': crop.color
            }}>
              {crop.icon}
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>{crop.name}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{crop.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
