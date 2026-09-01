import React, { useState } from 'react';
import { Leaf, CloudRain, Brain, LineChart, ArrowRight, Sun, Droplets, Waves, Wind } from 'lucide-react';
import FarmScene3D from './FarmScene3D';
import WorkflowTimeline from './WorkflowTimeline';
import ImpactCounters from './ImpactCounters';
import AITeaser from './AITeaser';
import SupportedCrops from './SupportedCrops';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
  const [hoveredRisk, setHoveredRisk] = useState(null);

  return (
    <div className="landing-container animate-fade-in-up">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Empowering Pakistan's Farmers against <span className="highlight">Climate Change</span>
          </h1>
          <p className="hero-subtitle">
            Kisan Nighaban is your intelligent climate risk guardian. Protect your harvest with AI-driven insights, localized weather forecasts, and historical risk tracking.
          </p>
          <button className="btn btn-primary hero-btn" onClick={onGetStarted}>
            Register Your Farm <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="hero-visual">
          <div className="hero-image-container">
            <FarmScene3D activeWeather={hoveredRisk} />
            
            <div 
              className="glass-card risk-card risk-heat"
              onMouseEnter={() => setHoveredRisk('heat')}
              onMouseLeave={() => setHoveredRisk(null)}
            >
              <Sun className="risk-icon heat-icon" size={20} />
              <div className="risk-text">
                <span>Risk Alert</span>
                <strong>Heat Stress</strong>
              </div>
            </div>

            <div 
              className="glass-card risk-card risk-drought"
              onMouseEnter={() => setHoveredRisk('drought')}
              onMouseLeave={() => setHoveredRisk(null)}
            >
              <Droplets className="risk-icon drought-icon" size={20} />
              <div className="risk-text">
                <span>Risk Alert</span>
                <strong>Drought</strong>
              </div>
            </div>

            <div 
              className="glass-card risk-card risk-flood"
              onMouseEnter={() => setHoveredRisk('flood')}
              onMouseLeave={() => setHoveredRisk(null)}
            >
              <Waves className="risk-icon flood-icon" size={20} />
              <div className="risk-text">
                <span>Risk Alert</span>
                <strong>Flooding</strong>
              </div>
            </div>

            <div 
              className="glass-card risk-card risk-wind"
              onMouseEnter={() => setHoveredRisk('wind')}
              onMouseLeave={() => setHoveredRisk(null)}
            >
              <Wind className="risk-icon wind-icon" size={20} />
              <div className="risk-text">
                <span>Risk Alert</span>
                <strong>Wind Damage</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counters (Stats) */}
      <ImpactCounters />

      {/* App Walkthrough / Sticky Workflow Timeline Section */}
      <WorkflowTimeline />

      {/* Animated AI Workflow Teaser */}
      <AITeaser />

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Use Kisan Nighaban?</h2>
        <div className="features-grid">
          
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper icon-weather">
              <CloudRain className="feature-icon" size={32} />
            </div>
            <h3>Localized Weather</h3>
            <p>Get real-time weather forecasts including temperature, humidity, precipitation, and wind speed specific to your farm's coordinates.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper icon-ai">
              <Brain className="feature-icon" size={32} />
            </div>
            <h3>AI Risk Assessment</h3>
            <p>Our intelligent system evaluates climate risks based on your crop and its growth stage, providing actionable recommendations to protect your yield.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper icon-tracking">
              <LineChart className="feature-icon" size={32} />
            </div>
            <h3>Historical Risk Tracking</h3>
            <p>Monitor risk trends over the past 7 days to understand changing climate patterns and make informed long-term agricultural decisions.</p>
          </div>

        </div>
      </section>

      {/* Supported Crops Grid */}
      <SupportedCrops />

      {/* Bottom CTA */}
      <section className="cta-section glass-panel">
        <h2>Ready to protect your crops?</h2>
        <p>Join farmers across Pakistan who are using AI to secure their harvests.</p>
        <button className="btn btn-primary cta-btn" onClick={onGetStarted}>
          Get Started Now <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}
