import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

// Crop generation
const cropsData = [];
const cols = [
  { x: -1.5, type: 'wheat' },
  { x: -0.5, type: 'wheat' },
  { x: 0.5, type: 'tomato' },
  { x: 1.5, type: 'tomato' },
  { x: 2.5, type: 'indigo' },
  { x: 3.5, type: 'indigo' },
  { x: 4.5, type: 'veg' },
];

cols.forEach(col => {
  // Plant along the z-axis
  for (let z = -3.5; z <= 3.5; z += 1.2) {
    cropsData.push({ x: col.x - 1.5, z, type: col.type });
  }
});

function Crop({ x, z, type }) {
  // Add a slight random scale and rotation for an organic feel
  const scale = 0.8 + Math.random() * 0.4;
  const rotationY = Math.random() * Math.PI;

  if (type === 'wheat') {
    return (
      <group position={[x, 0.2, z]} scale={scale} rotation={[0, rotationY, 0]}>
        {/* Stalk */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#EAB308" />
        </mesh>
        {/* Leaves at base */}
        <mesh position={[0.05, 0.1, 0]} rotation={[0, 0, Math.PI / 4]} scale={[1, 0.2, 0.5]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#A3E635" />
        </mesh>
        <mesh position={[-0.05, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]} scale={[1, 0.2, 0.5]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#A3E635" />
        </mesh>
        {/* Wheat Head (Grain cluster) */}
        <group position={[0, 0.45, 0]}>
          <mesh position={[0, 0, 0]} scale={[0.5, 2, 0.5]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FDE047" />
          </mesh>
          <mesh position={[0.03, 0.05, 0]} scale={[0.5, 2, 0.5]} rotation={[0, 0, -0.2]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FDE047" />
          </mesh>
          <mesh position={[-0.03, 0.05, 0]} scale={[0.5, 2, 0.5]} rotation={[0, 0, 0.2]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FDE047" />
          </mesh>
        </group>
      </group>
    );
  }

  if (type === 'tomato') {
    return (
      <group position={[x, 0.25, z]} scale={scale} rotation={[0, rotationY, 0]}>
        {/* Bumpy organic bush made of 3 overlapping spheres */}
        <mesh position={[0, 0.1, 0]} scale={[1, 0.8, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#22C55E" />
        </mesh>
        <mesh position={[0.15, 0, 0.1]} scale={[1, 0.8, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#16A34A" />
        </mesh>
        <mesh position={[-0.15, 0, -0.1]} scale={[1, 0.8, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#16A34A" />
        </mesh>
        {/* Tomatoes on the surface */}
        <mesh position={[0.2, 0.1, 0.15]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.4} />
        </mesh>
        <mesh position={[-0.1, 0.15, 0.2]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, -0.15]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  if (type === 'indigo') {
    return (
      <group position={[x, 0.2, z]} scale={scale} rotation={[0, rotationY, 0]}>
        {/* Stalk */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#15803D" />
        </mesh>
        {/* Leaves */}
        <mesh position={[0.1, 0.1, 0]} rotation={[0, 0, Math.PI / 3]} scale={[1, 0.2, 0.6]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#16A34A" />
        </mesh>
        <mesh position={[-0.1, 0.15, 0.1]} rotation={[Math.PI / 6, 0, -Math.PI / 3]} scale={[1, 0.2, 0.6]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#16A34A" />
        </mesh>
        <mesh position={[0, 0.2, -0.1]} rotation={[-Math.PI / 4, 0, 0]} scale={[1, 0.2, 0.6]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#16A34A" />
        </mesh>
        {/* Purple flower cluster */}
        <mesh position={[0, 0.4, 0]} scale={[0.5, 1.5, 0.5]} castShadow>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#9333EA" />
        </mesh>
      </group>
    );
  }

  // Veg (Cabbage/Lettuce)
  return (
    <group position={[x, 0.1, z]} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Center head */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#86EFAC" />
      </mesh>
      {/* Outer leaves (flattened spheres arranged in a circle) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh position={[0.1, 0.05, 0]} rotation={[0, 0, Math.PI / 4]} scale={[1, 0.2, 0.8]} castShadow>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial color="#22C55E" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Weather Systems

function RainSystem() {
  const rainRef = useRef();
  const raindrops = new Array(150).fill().map(() => ({
    x: (Math.random() - 0.5) * 8,
    y: Math.random() * 8,
    z: (Math.random() - 0.5) * 8,
    speed: 0.1 + Math.random() * 0.1
  }));

  useFrame(() => {
    if (rainRef.current) {
      const children = rainRef.current.children;
      children.forEach((drop, i) => {
        drop.position.y -= raindrops[i].speed;
        if (drop.position.y < 0) {
          drop.position.y = 8;
        }
      });
    }
  });

  return (
    <group ref={rainRef}>
      {raindrops.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <cylinderGeometry args={[0.01, 0.01, 0.3]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function HeatSystem() {
  const heatRef = useRef();
  useFrame(({ clock }) => {
    if (heatRef.current) {
      // Pulsating heat wave effect
      heatRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <group>
      <pointLight ref={heatRef} position={[0, 4, 0]} color="#EF4444" intensity={2} distance={10} />
      {/* Tiny embers floating up */}
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 8, Math.random() * 4, (Math.random() - 0.5) * 8]}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function DroughtSystem() {
  const dustRef = useRef();
  const dust = new Array(100).fill().map(() => ({
    x: (Math.random() - 0.5) * 8,
    y: Math.random() * 3,
    z: (Math.random() - 0.5) * 8,
    speedX: (Math.random() - 0.5) * 0.01,
    speedY: 0.01 + Math.random() * 0.01
  }));

  useFrame(() => {
    if (dustRef.current) {
      dustRef.current.children.forEach((particle, i) => {
        particle.position.y += dust[i].speedY;
        particle.position.x += dust[i].speedX;
        if (particle.position.y > 4) {
          particle.position.y = 0;
          particle.position.x = dust[i].x;
        }
      });
    }
  });

  return (
    <group ref={dustRef}>
      {dust.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.04, 4, 4]} />
          <meshBasicMaterial color="#D97706" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function WindSystem() {
  const windRef = useRef();
  const lines = new Array(20).fill().map(() => ({
    x: -5 + Math.random() * 10,
    y: 0.5 + Math.random() * 3,
    z: (Math.random() - 0.5) * 8,
    speed: 0.2 + Math.random() * 0.2
  }));

  useFrame(() => {
    if (windRef.current) {
      windRef.current.children.forEach((line, i) => {
        line.position.x += lines[i].speed;
        if (line.position.x > 5) {
          line.position.x = -5;
        }
      });
    }
  });

  return (
    <group ref={windRef}>
      {lines.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshBasicMaterial color="#E2E8F0" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Farm({ activeWeather }) {
  const farmRef = useRef();

  useFrame(() => {
    // Slow auto-rotation for premium feel
    if (farmRef.current) {
      farmRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Weather Systems rendered OUTSIDE the farm rotation so they don't spin with it */}
      {activeWeather === 'flood' && <RainSystem />}
      {activeWeather === 'heat' && <HeatSystem />}
      {activeWeather === 'drought' && <DroughtSystem />}
      {activeWeather === 'wind' && <WindSystem />}

      <group ref={farmRef}>
        {/* Raised Dirt Bed */}
        <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
          <boxGeometry args={[8, 0.5, 9]} />
          <meshStandardMaterial color="#78350F" /> {/* Woody Earth Brown */}
        </mesh>

        {/* Tilled soil lines to give texture */}
        {[...Array(7)].map((_, i) => (
          <mesh key={i} position={[-2.5 + i, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.1, 8.5]} />
            <meshStandardMaterial color="#451A03" opacity={0.6} transparent />
          </mesh>
        ))}

        {/* Render Crops */}
        {cropsData.map((crop, i) => (
          <Crop key={i} x={crop.x} z={crop.z} type={crop.type} />
        ))}
      </group>
    </group>
  );
}

export default function FarmScene3D({ activeWeather }) {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>

        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Farm activeWeather={activeWeather} />

        {/* OrbitControls allow the user to drag, zoom, and rotate the scene */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1} // Stop user from looking underneath the soil
          minDistance={5}
          maxDistance={25}
        />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
