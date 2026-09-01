import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// Biosphere / Terrarium Component
// ----------------------------------------------------
function Biosphere() {
  const groupRef = useRef();
  
  // Rain particles ref
  const rainRef = useRef();
  // Lightning ref
  const lightningRef = useRef();
  // Heat wave ref
  const heatWaveRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Slowly rotate the entire scene
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
    }

    // Animate Rain falling
    if (rainRef.current) {
      rainRef.current.position.y -= 0.05;
      if (rainRef.current.position.y < -1) {
        rainRef.current.position.y = 1;
      }
    }

    // Simulate Lightning Flashes (Random fast flickering)
    if (lightningRef.current) {
      if (Math.random() > 0.95) {
        lightningRef.current.material.opacity = 1;
        lightningRef.current.material.emissiveIntensity = 4;
      } else {
        lightningRef.current.material.opacity = 0;
        lightningRef.current.material.emissiveIntensity = 0;
      }
    }

    // Simulate pulsing heat wave
    if (heatWaveRef.current) {
      const scale = 1 + Math.sin(time * 3) * 0.1;
      heatWaveRef.current.scale.set(scale, scale, scale);
      heatWaveRef.current.material.opacity = 0.4 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      
      {/* -------------------- THE BIOSPHERE (Safe Zone) -------------------- */}
      {/* High-Tech Base Pedestal */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.4, 64]} />
        <meshStandardMaterial color="#866ABF" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.0, 2.2, 0.1, 64]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.5} />
      </mesh>

      {/* Healthy Soil Inside */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.2, 64]} />
        <meshStandardMaterial color="#3E2723" roughness={1} />
      </mesh>

      {/* Healthy Crops Inside */}
      <group position={[0, 0.2, 0]}>
        {Array.from({ length: 25 }).map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const height = 0.3 + Math.random() * 0.4;
          
          return (
            <group key={`crop-${i}`} position={[x, 0, z]}>
              {/* Main Stalk */}
              <mesh position={[0, height / 2, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.04, height, 8]} />
                <meshStandardMaterial color="#22C55E" roughness={0.8} />
              </mesh>
              
              {/* Leaf 1 */}
              <mesh position={[-0.05, height * 0.4, 0]} rotation={[0, 0, 0.5]} scale={[1, 0.2, 0.5]} castShadow>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#4ADE80" roughness={0.6} />
              </mesh>
              
              {/* Leaf 2 */}
              <mesh position={[0.05, height * 0.7, 0.05]} rotation={[0.2, 0.5, -0.5]} scale={[1, 0.2, 0.5]} castShadow>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#4ADE80" roughness={0.6} />
              </mesh>

              {/* Top Bud / Wheat Head */}
              <mesh position={[0, height + 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
                <meshStandardMaterial color="#FDE047" roughness={0.7} />
              </mesh>
            </group>
          );
        })}
        {/* Glowing health aura inside */}
        <pointLight position={[0, 0.5, 0]} color="#4ADE80" intensity={1} distance={3} />
        <Sparkles count={40} scale={3} size={2} speed={0.4} opacity={0.5} color="#4ADE80" position={[0, 0.5, 0]} />
      </group>

      {/* The Protective Glass Dome */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          color="#BAE6FD" 
          transparent={true} 
          opacity={0.3} 
          transmission={0.9} 
          roughness={0.1} 
          metalness={0.1}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Hexagonal Shield Overlay Pattern (Simulated with wireframe) */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[2.02, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.15} />
      </mesh>

      {/* -------------------- EXTERNAL CLIMATE THREATS -------------------- */}

      {/* 1. Storm & Flood Threat (Left Side) */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-2.8, 2.5, 0]}>
          {/* Dark Storm Cloud */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <mesh position={[0.4, -0.2, 0.2]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <mesh position={[-0.4, -0.1, -0.2]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          
          {/* Rain */}
          <group ref={rainRef} position={[0, -0.8, 0]}>
            {Array.from({ length: 15 }).map((_, i) => (
              <mesh key={`rain-${i}`} position={[(Math.random() - 0.5), (Math.random() - 0.5) * 2, (Math.random() - 0.5)]}>
                <boxGeometry args={[0.02, 0.2, 0.02]} />
                <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>

          {/* Lightning Bolt */}
          <mesh ref={lightningRef} position={[0, -1, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.05, 0.01, 1.5, 4]} />
            <meshStandardMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={4} transparent opacity={0} />
          </mesh>
          <pointLight position={[0, -1, 0]} color="#FDE047" intensity={2} distance={4} />
        </group>
      </Float>

      {/* 2. Drought & Heat Threat (Right Side) */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <group position={[2.8, 1.5, 0]}>
          {/* Scorching Sun Core */}
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#DC2626" emissive="#EF4444" emissiveIntensity={3} />
          </mesh>
          
          {/* Blazing Sparkles (Red & Orange) - Slower burning effect */}
          <Sparkles count={50} scale={2} size={6} speed={0.3} opacity={0.8} color="#EF4444" />
          <Sparkles count={40} scale={2.5} size={8} speed={0.2} opacity={0.6} color="#F97316" />
          <Sparkles count={30} scale={1.5} size={4} speed={0.4} opacity={1} color="#FDE047" />
          
          <pointLight color="#EF4444" intensity={4} distance={6} />
        </group>
      </Float>
      
    </group>
  );
}

export default function BiosphereScene3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', background: 'transparent' }}>
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 45 }}>
        
        {/* Soft Ambient Light */}
        <ambientLight intensity={0.2} />
        
        {/* Main light simulating global tech illumination */}
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.3} color="#93C5FD" />

        <Biosphere />

        <OrbitControls 
          enableZoom={true}
          maxDistance={18}
          minDistance={6}
          enablePan={false}
          maxPolarAngle={Math.PI / 2} // Restrict below ground
          target={[0, 1, 0]}
        />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
