import React, { useEffect, useRef, useState } from 'react';
import { ClipboardList, LayoutDashboard, ShieldAlert, ListChecks, CalendarDays } from 'lucide-react';
import './WorkflowTimeline.css';

const steps = [
  {
    id: 1,
    title: 'Register Your Farm',
    description: 'Enter your farm details including crop type, sowing date, and city to start monitoring.',
    icon: <ClipboardList size={32} />,
    colorClass: 'color-primary'
  },
  {
    id: 2,
    title: 'Access Dashboard',
    description: 'View your customized dashboard showing your crop\'s current growth stage and localized real-time weather.',
    icon: <LayoutDashboard size={32} />,
    colorClass: 'color-secondary'
  },
  {
    id: 3,
    title: 'Run AI Risk Assessment',
    description: 'Analyze climate threats like heat stress, drought, flooding, and wind specific to your crop.',
    icon: <ShieldAlert size={32} />,
    colorClass: 'color-accent'
  },
  {
    id: 4,
    title: 'Get Prioritized Actions',
    description: 'Receive actionable recommendations with urgency badges to protect your yield from identified risks.',
    icon: <ListChecks size={32} />,
    colorClass: 'color-primary'
  },
  {
    id: 5,
    title: 'Monitor 7-Day Forecast',
    description: 'Track the upcoming week\'s weather with temperature ranges and rain indicators to plan ahead.',
    icon: <CalendarDays size={32} />,
    colorClass: 'color-secondary'
  }
];

// Abstract CSS UI Mockups for the phone screen
const UIMockup = ({ stepId }) => {
  return (
    <div className="ui-mockup-container">
      {/* Step 1: Form UI */}
      <div className={`mockup-screen ${stepId === 1 ? 'active' : ''}`}>
        <div className="m-header bg-primary"></div>
        <div className="m-body">
          <div className="m-title w-60"></div>
          <div className="m-input mt-4"></div>
          <div className="m-input mt-2"></div>
          <div className="m-input mt-2"></div>
          <div className="m-btn bg-primary mt-4"></div>
        </div>
      </div>

      {/* Step 2: Dashboard UI */}
      <div className={`mockup-screen ${stepId === 2 ? 'active' : ''}`}>
        <div className="m-header bg-secondary"></div>
        <div className="m-body">
          <div className="m-card-large bg-secondary-light">
            <div className="m-circle"></div>
            <div className="m-line w-40 mt-2 mx-auto"></div>
          </div>
          <div className="m-grid mt-4">
            <div className="m-card-small"></div>
            <div className="m-card-small"></div>
          </div>
        </div>
      </div>

      {/* Step 3: Risk Assessment UI */}
      <div className={`mockup-screen ${stepId === 3 ? 'active' : ''}`}>
        <div className="m-header bg-accent"></div>
        <div className="m-body">
          <div className="m-gauge-container">
            <div className="m-gauge-arc border-accent"></div>
            <div className="m-gauge-needle bg-accent"></div>
          </div>
          <div className="m-bar mt-4">
            <div className="m-bar-fill bg-accent w-80"></div>
          </div>
          <div className="m-bar mt-2">
            <div className="m-bar-fill bg-primary w-40"></div>
          </div>
          <div className="m-bar mt-2">
            <div className="m-bar-fill bg-secondary w-60"></div>
          </div>
        </div>
      </div>

      {/* Step 4: Recommendations UI */}
      <div className={`mockup-screen ${stepId === 4 ? 'active' : ''}`}>
        <div className="m-header bg-primary"></div>
        <div className="m-body bg-gray">
          <div className="m-list-card">
            <div className="m-badge bg-accent"></div>
            <div className="m-line w-80 mt-2"></div>
            <div className="m-line w-60 mt-1"></div>
          </div>
          <div className="m-list-card mt-2">
            <div className="m-badge bg-primary"></div>
            <div className="m-line w-70 mt-2"></div>
            <div className="m-line w-50 mt-1"></div>
          </div>
          <div className="m-list-card mt-2">
            <div className="m-badge bg-secondary"></div>
            <div className="m-line w-90 mt-2"></div>
            <div className="m-line w-60 mt-1"></div>
          </div>
        </div>
      </div>

      {/* Step 5: Weather Forecast UI */}
      <div className={`mockup-screen ${stepId === 5 ? 'active' : ''}`}>
        <div className="m-header bg-secondary"></div>
        <div className="m-body">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="m-weather-row mt-2">
              <div className="m-icon-small bg-secondary"></div>
              <div className="m-line w-20"></div>
              <div className="m-bar-small">
                <div className="m-bar-fill bg-secondary" style={{ width: `${40 + Math.random() * 40}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function WorkflowTimeline() {
  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when item is near the middle of the screen
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute('data-id'));
          setActiveStep(id);
        }
      });
    }, options);

    stepRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="workflow-timeline-section">
      <div className="timeline-header text-center animate-fade-in-up">
        <h2 className="section-title">App Walkthrough</h2>
        <p className="section-subtitle">A seamless journey to protect your harvest</p>
      </div>

      <div className="timeline-container">
        
        {/* Left Column: Vertical Timeline */}
        <div className="timeline-content">
          <div className="timeline-line">
            <div 
              className="timeline-progress" 
              style={{ height: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            return (
              <div 
                key={step.id} 
                className={`timeline-step ${isActive ? 'active' : ''}`}
                ref={el => stepRefs.current[index] = el}
                data-id={step.id}
              >
                <div className={`timeline-dot ${step.colorClass}`}>
                  {step.icon}
                </div>
                <div className={`timeline-card glass-panel ${step.colorClass}`}>
                  <div className="step-number">Step {step.id}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Device Mockup */}
        <div className="timeline-device-wrapper">
          <div className="sticky-device">
            <div className="phone-mockup">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <UIMockup stepId={activeStep} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
