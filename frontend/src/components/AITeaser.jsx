import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CloudRain, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ParticleNetwork = ({ phase }) => {
  const pointsRef = useRef();
  const brainRef = useRef();
  
  // Generate 800 particles in a wide ellipsoid to fill the container horizontally
  const count = 800;
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Wide spread: X can go much further than Y/Z
      const x = (Math.random() - 0.5) * 20; 
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 8;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;
    }
    return [pos, initPos];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate brain
    if (brainRef.current) {
      brainRef.current.rotation.y = time * 0.3;
      brainRef.current.rotation.x = time * 0.2;
      
      // Pulse intensely in phase 1
      const scale = phase === 1 ? 1.2 + Math.sin(time * 12) * 0.2 : 1;
      brainRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      
      const targetColor = new THREE.Color(
        phase === 0 ? '#06b6d4' : // cyan
        phase === 1 ? '#866ABF' : // purple
        '#ef4444' // red
      );
      brainRef.current.material.color.lerp(targetColor, 0.05);
      brainRef.current.material.emissive.lerp(targetColor, 0.05);
    }
    
    // Animate particles
    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];
        
        let tx = ix, ty = iy, tz = iz;
        
        if (phase === 0) {
          // Slowly drift/orbit in wide field
          const angle = time * 0.1 + (i * 0.01);
          tx = ix + Math.cos(angle) * 2;
          tz = iz + Math.sin(angle) * 2;
        } else if (phase === 1) {
          // Funnel rapidly inward toward the brain
          const speed = (time * 3 + i * 0.01) % (Math.PI * 2);
          const pull = (Math.sin(speed) + 1) * 0.5; // 0 to 1
          tx = ix * (0.1 + pull * 0.9);
          ty = iy * (0.1 + pull * 0.9);
          tz = iz * (0.1 + pull * 0.9);
        } else if (phase === 2) {
          // Explode aggressively outward horizontally
          const push = 1 + (Math.sin(time * 8 + i * 0.1) * 0.8);
          tx = ix * push * 2;
          ty = iy * push * 1.5;
          tz = iz * push * 1.5;
        }
        
        // Smooth transition
        positionsAttr.array[i3] += (tx - positionsAttr.array[i3]) * 0.1;
        positionsAttr.array[i3 + 1] += (ty - positionsAttr.array[i3 + 1]) * 0.1;
        positionsAttr.array[i3 + 2] += (tz - positionsAttr.array[i3 + 2]) * 0.1;
      }
      positionsAttr.needsUpdate = true;
      
      const targetColor = new THREE.Color(
        phase === 0 ? '#06b6d4' : 
        phase === 1 ? '#866ABF' : 
        '#ef4444' 
      );
      pointsRef.current.material.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <group>
      {/* AI Core */}
      <Icosahedron ref={brainRef} args={[1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#06b6d4" 
          emissive="#06b6d4" 
          emissiveIntensity={2} 
          wireframe={true} 
          transparent={true}
          opacity={0.8}
        />
      </Icosahedron>
      
      {/* Network Particles */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#06b6d4"
          size={0.15} /* Increased size significantly for huge glowing visibility */
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
};

export default function AITeaser() {
  const [phase, setPhase] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Setup Intersection Observer to trigger when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        } else {
          setInView(false); // Pause rendering when out of view
        }
      },
      { threshold: 0.1 } // Triggers when at least 10% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Run animation only when in view
  useEffect(() => {
    if (!inView) return; // Don't start timer until visible

    const interval = setInterval(() => {
      setPhase((prev) => {
        const nextPhase = (prev + 1) % 3;
        
        // Trigger glitch briefly when transitioning into Phase 2 (Threat Detected)
        if (nextPhase === 2) {
          setGlitching(true);
          setTimeout(() => setGlitching(false), 800); // Glitch lasts 800ms
        }
        
        return nextPhase;
      });
    }, 4000); // 4 seconds per phase
    
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={sectionRef} className="ai-teaser-section animate-fade-in-up" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <h2 className="section-title">See Kisan Nighaban in Action</h2>
      <p className="section-subtitle">Our AI works autonomously to protect your yield.</p>
      
      <div style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: '3rem',
        background: '#0F172A', // Deep dark blue
        position: 'relative',
        overflow: 'hidden',
        height: '600px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
      }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <Canvas frameloop={inView ? "always" : "never"} camera={{ position: [0, 0, 10], fov: 45 }}>
            <ParticleNetwork phase={phase} />
            <EffectComposer>
              <Bloom intensity={2.0} luminanceThreshold={0} luminanceSmoothing={0.9} />
              <Glitch active={glitching} delay={[0, 0]} duration={[0.1, 0.3]} strength={[0.3, 1.0]} mode="constant" />
            </EffectComposer>
          </Canvas>
        </div>

        {/* UI Overlay: Spread across the wide container */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row', /* Spread horizontally */
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4rem',
          color: 'white',
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0) 20%, rgba(15,23,42,0) 80%, rgba(15,23,42,0.8) 100%)'
        }}>
          
          {/* Left Panel: Phase Indicator & Text */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              width: '100%',
              maxWidth: '350px'
            }}>
              
              {/* Phase 1 Text */}
              <div style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: phase === 0 ? 1 : 0,
                left: phase === 0 ? '0' : '-40px'
              }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                }}>
                  <CloudRain size={28} color="#06b6d4" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>1. Scanning Weather</h3>
                <p style={{ color: '#94A3B8', fontSize: '1.1rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Ingesting real-time satellite telemetry for your exact coordinates...</p>
              </div>

              {/* Phase 2 Text */}
              <div style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: phase === 1 ? 1 : 0,
                left: phase === 1 ? '0' : '-40px'
              }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(134, 106, 191, 0.1)',
                  border: '1px solid rgba(134, 106, 191, 0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                  boxShadow: '0 0 20px rgba(134, 106, 191, 0.4)'
                }}>
                  <Brain size={28} color="#866ABF" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>2. AI Assessment</h3>
                <p style={{ color: '#94A3B8', fontSize: '1.1rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Correlating atmospheric variables with localized agronomic models...</p>
                <div style={{ marginTop: '1.5rem', width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#866ABF', width: phase === 1 ? '100%' : '0%', transition: 'width 3.5s linear' }}></div>
                </div>
              </div>

              {/* Phase 3 Text */}
              <div style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: phase === 2 ? 1 : 0,
                left: phase === 2 ? '0' : '-40px'
              }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
                }}>
                  <ShieldAlert size={28} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#ef4444', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>3. Threat Detected</h3>
                <p style={{ color: '#94A3B8', fontSize: '1.1rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Critical heat stress threshold breached for Wheat crop.</p>
              </div>
            </div>
          </div>

          {/* Right Panel: The Result Card (Only visible in Phase 3) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: phase === 2 ? 1 : 0,
              transform: phase === 2 ? 'translateX(0)' : 'translateX(40px)',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderLeft: '4px solid #ef4444',
              padding: '2rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              textAlign: 'left',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}>
              <CheckCircle2 color="var(--primary)" size={32} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1.2rem' }}>Action Recommended</strong>
                <span style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: '1.5' }}>Apply light irrigation tomorrow morning to lower canopy temperature during the extreme 2 PM heat spike.</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
