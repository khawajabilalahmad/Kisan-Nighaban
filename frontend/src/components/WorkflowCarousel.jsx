import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, ShieldAlert, ListChecks, CalendarDays } from 'lucide-react';
import './WorkflowCarousel.css';

const steps = [
  {
    id: 1,
    title: 'Register Your Farm',
    description: 'Enter your farm details including crop type, sowing date, and city to start monitoring.',
    icon: <ClipboardList size={48} />,
    colorClass: 'color-primary' // Green
  },
  {
    id: 2,
    title: 'Access Dashboard',
    description: 'View your customized dashboard showing your crop\'s current growth stage and localized real-time weather.',
    icon: <LayoutDashboard size={48} />,
    colorClass: 'color-secondary' // Cyan
  },
  {
    id: 3,
    title: 'Run AI Risk Assessment',
    description: 'Analyze climate threats like heat stress, drought, flooding, and wind specific to your crop.',
    icon: <ShieldAlert size={48} />,
    colorClass: 'color-accent' // Purple
  },
  {
    id: 4,
    title: 'Get Prioritized Actions',
    description: 'Receive actionable recommendations with urgency badges to protect your yield from identified risks.',
    icon: <ListChecks size={48} />,
    colorClass: 'color-primary' // Green
  },
  {
    id: 5,
    title: 'Monitor 7-Day Forecast',
    description: 'Track the upcoming week\'s weather with temperature ranges and rain indicators to plan ahead.',
    icon: <CalendarDays size={48} />,
    colorClass: 'color-secondary' // Cyan
  }
];

export default function WorkflowCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    setCurrentIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setCurrentIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  return (
    <section className="workflow-section animate-fade-in-up">
      <h2 className="section-title">App Walkthrough</h2>
      <p className="section-subtitle">Follow these simple steps to start protecting your harvest.</p>
      
      <div className="carousel-container">
        <button className="carousel-btn prev-btn" onClick={prevStep} aria-label="Previous step">
          <ChevronLeft size={28} />
        </button>
        
        <div className="carousel-content">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`carousel-card glass-panel ${index === currentIndex ? 'active' : 'hidden'} ${step.colorClass}`}
            >
              <div className="step-number">Step {step.id} of {steps.length}</div>
              <div className="step-icon-wrapper">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <button className="carousel-btn next-btn" onClick={nextStep} aria-label="Next step">
          <ChevronRight size={28} />
        </button>
      </div>
      
      <div className="carousel-dots">
        {steps.map((_, index) => (
          <div 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
