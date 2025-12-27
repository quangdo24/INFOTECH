import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, PerspectiveCamera, CatmullRomLine, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';

// --- Assets & Components ---

interface BlinkingLightProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  isMobile?: boolean;
}

const BlinkingLight: React.FC<BlinkingLightProps> = ({ position, color, speed = 1, isMobile = false }) => {
  const ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset;
      // Steady, realistic network link light blinking - moderate pace
      const blinkRate = 1.5 + (speed * 0.2); // Steady rate, slightly varied by speed
      const isOn = Math.sin(t * blinkRate) > 0;
      const intensity = isOn ? 1.0 : 0.15; // Clear on/off but not too dim when off
      
      // Subtle scale change
      const scale = isOn ? 1.2 : 0.9;
      ref.current.scale.setScalar(scale);
      
      // Update material opacity and color intensity
      if (ref.current.material instanceof THREE.MeshBasicMaterial) {
        ref.current.material.opacity = intensity;
        // Make color brighter when on
        const colorObj = new THREE.Color(color);
        if (isOn) {
          colorObj.multiplyScalar(1.3);
        }
        ref.current.material.color = colorObj;
      }
      
      // Update point light intensity only if not mobile (performance optimization)
      if (lightRef.current && !isMobile) {
        lightRef.current.intensity = isOn ? 1.2 : 0.15;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color={color} transparent toneMapped={false} />
      </mesh>
      {/* Only render point light on desktop for performance */}
      {!isMobile && <pointLight ref={lightRef} color={color} distance={0.5} intensity={1.5} />}
    </group>
  );
};

interface ServerBladeProps {
  position: [number, number, number];
  width: number;
  depth: number;
  color: string;
  isDarkMode: boolean;
  isMobile?: boolean;
}

const ServerBlade: React.FC<ServerBladeProps> = ({ 
  position, 
  width, 
  depth, 
  color, 
  isDarkMode,
  isMobile = false
}) => {
  // Generate consistent light pattern per blade - slower, steady speeds
  const lightOffset = useMemo(() => Math.random() * 100, []);
  const greenLightSpeed = useMemo(() => 0.8 + Math.random() * 0.4, []); // Slower, steady
  const amberLightSpeed = useMemo(() => 0.8 + Math.random() * 0.4, []); // Slower, steady
  
  // Green and Amber colors for link lights
  const greenColor = isDarkMode ? "#00ff88" : "#10b981"; 
  const amberColor = isDarkMode ? "#ffaa00" : "#f59e0b"; 

  return (
    <group position={position}>
      {/* Chassis Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.10, depth]} />
        <meshStandardMaterial 
            color={isDarkMode ? "#1a1a1a" : "#f1f5f9"} 
            roughness={0.5} 
            metalness={0.7} 
        />
      </mesh>

      {/* Front Face Plate (Darker) */}
      <mesh position={[0, 0, depth/2 + 0.005]}>
         <boxGeometry args={[width - 0.02, 0.08, 0.01]} />
         <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>

      {/* Handles (Left & Right) - Makes it look like a slide-out unit */}
      <mesh position={[-width/2 + 0.06, 0, depth/2 + 0.04]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
         <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[width/2 - 0.06, 0, depth/2 + 0.04]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
         <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Vent Grills (Visual Texture via Geometry) */}
      <group position={[0, 0, depth/2 + 0.015]}>
         <mesh position={[0.2, 0.015, 0]}>
             <planeGeometry args={[0.4, 0.005]} />
             <meshBasicMaterial color="#000" />
         </mesh>
         <mesh position={[0.2, -0.015, 0]}>
             <planeGeometry args={[0.4, 0.005]} />
             <meshBasicMaterial color="#000" />
         </mesh>
      </group>

      {/* Link Lights - Green and Amber, always visible */}
      <group position={[-0.25, 0, depth / 2 + 0.02]}>
        {/* Green link light */}
        <BlinkingLight position={[0, 0, 0]} color={greenColor} speed={greenLightSpeed} isMobile={isMobile} />
        {/* Amber link light */}
        <BlinkingLight position={[0.08, 0, 0]} color={amberColor} speed={amberLightSpeed} isMobile={isMobile} />
      </group>
    </group>
  );
};

const CableBundle = ({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) => {
    // A bundle of 3 wires slightly offset
    return (
        <group>
            <QuadraticBezierLine start={start} end={end} mid={[start[0], start[1] + 1, (start[2] + end[2])/2]} color={color} lineWidth={2} />
            <QuadraticBezierLine start={[start[0]+0.05, start[1], start[2]]} end={[end[0]+0.05, end[1], end[2]]} mid={[start[0], start[1] + 1.1, (start[2] + end[2])/2]} color={color} lineWidth={1.5} opacity={0.7} transparent />
            <QuadraticBezierLine start={[start[0]-0.05, start[1], start[2]]} end={[end[0]-0.05, end[1], end[2]]} mid={[start[0], start[1] + 0.9, (start[2] + end[2])/2]} color={color} lineWidth={1.5} opacity={0.7} transparent />
        </group>
    )
}

const CrashCart = ({ 
    position, 
    rotation = [0, 0, 0], 
    isDarkMode 
  }: { 
    position: [number, number, number], 
    rotation?: [number, number, number], 
    isDarkMode: boolean 
  }) => {
    const metalColor = isDarkMode ? "#333333" : "#a0a0a0";
    const darkPlastic = "#1a1a1a";
    // Changed screen color to Green (#10b981) for light mode
    const screenColor = isDarkMode ? "#00ff88" : "#10b981";
  
    return (
      <group position={position} rotation={new THREE.Euler(...rotation)}>
        {/* Base with Wheels */}
        <group position={[0, 0.1, 0]}>
           <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
              <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.8} />
           </mesh>
           {/* Vertical Pole */}
           <mesh position={[0, 0.5, -0.2]} castShadow>
               <boxGeometry args={[0.05, 1.2, 0.05]} />
               <meshStandardMaterial color={metalColor} />
           </mesh>
        </group>
  
        {/* Wheels */}
        {[[-0.2, 0.2], [0.2, 0.2], [-0.2, -0.2], [0.2, -0.2]].map((pos, i) => (
            <mesh key={i} position={[pos[0], 0.05, pos[1]]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
               <meshStandardMaterial color="#111" />
            </mesh>
        ))}
  
        {/* Main Tray/Table Surface */}
        <group position={[0, 0.9, 0]}>
           <mesh castShadow receiveShadow>
               <boxGeometry args={[0.7, 0.02, 0.5]} />
               <meshStandardMaterial color={metalColor} roughness={0.5} />
           </mesh>
           
           {/* Keyboard */}
           <mesh position={[0, 0.02, 0.1]} receiveShadow>
               <boxGeometry args={[0.4, 0.015, 0.15]} />
               <meshStandardMaterial color={darkPlastic} />
           </mesh>
           
           {/* Mouse */}
           <mesh position={[0.25, 0.02, 0.1]} receiveShadow>
               <boxGeometry args={[0.06, 0.015, 0.1]} />
               <meshStandardMaterial color={darkPlastic} />
           </mesh>
        </group>
  
        {/* Monitor Arm */}
        <mesh position={[0, 1.05, -0.2]}>
            <boxGeometry args={[0.1, 0.3, 0.05]} />
            <meshStandardMaterial color={darkPlastic} />
        </mesh>
  
        {/* Monitor Screen */}
        <group position={[0, 1.25, -0.15]} rotation={[0.1, 0, 0]}>
            <mesh castShadow>
               <boxGeometry args={[0.55, 0.35, 0.03]} />
               <meshStandardMaterial color={darkPlastic} roughness={0.2} />
            </mesh>
            {/* Glowing Display */}
            <mesh position={[0, 0, 0.016]}>
               <planeGeometry args={[0.51, 0.31]} />
               <meshBasicMaterial color={screenColor} toneMapped={false} opacity={0.8} transparent />
            </mesh>
            
            {/* Fake text lines on screen */}
            {/* Adjusted position to be more centered/inset to prevent hanging off edge */}
            <group position={[-0.12, 0.08, 0.02]}>
               <mesh position={[0, 0, 0]}> <planeGeometry args={[0.15, 0.01]} /> <meshBasicMaterial color="#fff" /> </mesh>
               <mesh position={[0, -0.03, 0]}> <planeGeometry args={[0.10, 0.01]} /> <meshBasicMaterial color="#fff" /> </mesh>
               <mesh position={[0, -0.06, 0]}> <planeGeometry args={[0.20, 0.01]} /> <meshBasicMaterial color="#fff" /> </mesh>
            </group>

            <pointLight color={screenColor} intensity={0.5} distance={1} position={[0, 0, 0.2]} />
        </group>
      </group>
    );
};

const ServerRack = ({ 
  position, 
  rotation = [0, 0, 0], 
  isDarkMode,
  isMobile = false
}: { 
  position: [number, number, number], 
  rotation?: [number, number, number], 
  isDarkMode: boolean,
  isMobile?: boolean
}) => {
  const height = 3.5;
  const width = 1.2;
  const depth = 1.2;
  
  const blades = useMemo(() => new Array(20).fill(0).map((_, i) => ({ y: -height/2 + 0.2 + (i * 0.15) })), [height]);

  const frameColor = isDarkMode ? "#111111" : "#e0e0e0";
  // Changed glow to Green (#10b981) for light mode
  const glowColor = isDarkMode ? "#00ff88" : "#10b981";
  const cableColor = isDarkMode ? "#333" : "#999";

  return (
    <group position={position} rotation={new THREE.Euler(...rotation)}>
      
      {/* Cabling going up to ceiling */}
      <CableBundle start={[0, height/2, -depth/2 + 0.2]} end={[0, height + 2, -depth/2 - 2]} color={cableColor} />

      {/* Internal Glow */}
      <pointLight 
        position={[0, 0, depth/2 + 0.5]} 
        intensity={isDarkMode ? 2 : 1} 
        distance={3}
        color={glowColor}
      />

      {/* Frame Geometry */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.1} metalness={0.1} transparent opacity={0.05} />
      </mesh>
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color={isDarkMode ? "#333" : "#ccc"} />
      </lineSegments>

      {/* Rack Rails (Visual Detail) */}
      <mesh position={[-width/2 + 0.05, 0, depth/2 - 0.05]}>
         <boxGeometry args={[0.05, height, 0.05]} />
         <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[width/2 - 0.05, 0, depth/2 - 0.05]}>
         <boxGeometry args={[0.05, height, 0.05]} />
         <meshStandardMaterial color="#444" />
      </mesh>

      {/* Blades */}
      <group position={[0, 0, 0]}>
        {blades.map((blade, i) => (
          <ServerBlade 
            key={i} 
            position={[0, blade.y, 0]} 
            width={width - 0.1} 
            depth={depth - 0.1} 
            color={isDarkMode ? "#222" : "#fff"}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
          />
        ))}
      </group>
    </group>
  );
};

// --- Floor Pulse Effect ---

interface PulsePacketProps {
    pathStart: THREE.Vector3;
    pathEnd: THREE.Vector3;
    color: string;
    speed: number;
    offset: number;
}

const PulsePacket: React.FC<PulsePacketProps> = ({ pathStart, pathEnd, color, speed, offset }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            const t = (state.clock.elapsedTime * speed + offset) % 1;
            ref.current.position.lerpVectors(pathStart, pathEnd, t);
            // Fade out near end
            const opacity = t > 0.8 ? (1 - t) * 5 : 1;
             if (ref.current.material instanceof THREE.MeshBasicMaterial) {
                ref.current.material.opacity = opacity;
             }
        }
    });

    return (
        <mesh ref={ref}>
            <boxGeometry args={[0.05, 0.02, 0.3]} />
            <meshBasicMaterial color={color} transparent />
        </mesh>
    );
};

const CircuitFloor = ({ isDarkMode }: { isDarkMode: boolean }) => {
    // Define paths for "electricity" to travel to the racks
    // Racks are aligned at x = -1.25, 0, 1.25
    
    const paths = useMemo(() => {
        const p = [];
        const startZ = 6;
        const endZ = 1; // Near racks
        
        // Paths to center rack (x=0)
        for(let i=0; i<3; i++) p.push({ start: new THREE.Vector3(0 + (i*0.2 - 0.2), -1.24, startZ), end: new THREE.Vector3(0, -1.24, endZ) });
        // Paths to left rack (x=-1.25)
        for(let i=0; i<3; i++) p.push({ start: new THREE.Vector3(-1.25 + (i*0.2 - 0.2), -1.24, startZ), end: new THREE.Vector3(-1.25, -1.24, endZ) });
        // Paths to right rack (x=1.25)
        for(let i=0; i<3; i++) p.push({ start: new THREE.Vector3(1.25 + (i*0.2 - 0.2), -1.24, startZ), end: new THREE.Vector3(1.25, -1.24, endZ) });

        return p;
    }, []);

    // Changed pulse color to Green (#10b981) for light mode
    const pulseColor = isDarkMode ? "#00ff88" : "#10b981";
    const gridColor = isDarkMode ? "#222" : "#ddd";

    return (
        <group>
             {/* Floor Grid Lines */}
             <gridHelper position={[0, -1.24, 0]} args={[20, 20, gridColor, gridColor]} />
             
             {/* Base Reflection Plane */}
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial 
                    color={isDarkMode ? "#050505" : "#ffffff"} 
                    roughness={0.1} 
                    metalness={0.5}
                />
             </mesh>

             {/* Moving Pulses */}
             {paths.map((path, i) => (
                 <PulsePacket 
                    key={i} 
                    pathStart={path.start} 
                    pathEnd={path.end} 
                    color={pulseColor} 
                    speed={0.5 + Math.random() * 0.5} 
                    offset={Math.random() * 10} 
                 />
             ))}
        </group>
    )
}


// --- Main Composition ---

const Composition = ({ activeSection, isDarkMode, isMobile = false }: { activeSection: string, isDarkMode: boolean, isMobile?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating rotation for the whole assembly
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const cableColor = isDarkMode ? "#333" : "#777";

  return (
    <group ref={groupRef}>
      {/* Aligned Row of Servers */}
      <ServerRack position={[-1.25, 0.5, 0]} isDarkMode={isDarkMode} isMobile={isMobile} />
      <ServerRack position={[0, 0.5, 0]} isDarkMode={isDarkMode} isMobile={isMobile} />
      <ServerRack position={[1.25, 0.5, 0]} isDarkMode={isDarkMode} isMobile={isMobile} />
      
      {/* Crash Cart next to servers */}
      <CrashCart position={[2.5, -1.25, 1]} rotation={[0, -0.4, 0]} isDarkMode={isDarkMode} />

      {/* Cable connecting Cart to Rack */}
      <QuadraticBezierLine 
         start={[2.5, -0.3, 0.8]} 
         end={[1.8, -1.2, 0.5]} 
         mid={[2.2, -1.2, 1]} 
         color={cableColor} 
         lineWidth={2} 
      />
      
      <CircuitFloor isDarkMode={isDarkMode} />
    </group>
  );
};

export const ArchitectScene: React.FC<{ activeSection: string, isDarkMode: boolean }> = ({ activeSection, isDarkMode }) => {
  const bgColor = isDarkMode ? "#111111" : "#F0F0F0";
  const fogColor = isDarkMode ? "#111111" : "#F0F0F0";
  const shadowColor = isDarkMode ? "#000000" : "#888888";
  
  // Detect mobile device - check for touch capability or small screen width
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

  // Camera position - further out on mobile for better view
  const cameraPosition: [number, number, number] = isMobile ? [0, 2.5, 12] : [0, 2, 9];
  const cameraFov = isMobile ? 40 : 35;

  return (
    <Canvas 
      shadows={!isMobile} 
      dpr={isMobile ? [1, 1.5] : [1, 2]} 
      camera={{ position: cameraPosition, fov: cameraFov }} 
      style={{ width: '100%', height: '100%' }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 5, 30]} />

      <ambientLight intensity={isDarkMode ? 0.2 : 0.6} />
      
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={isDarkMode ? 0.5 : 1.2} 
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]} 
        shadow-bias={-0.0001}
      />
      
      <spotLight 
        position={[-5, 8, -5]} 
        intensity={isDarkMode ? 2 : 0.5} 
        color={isDarkMode ? "#00ff88" : "#93c5fd"} 
        distance={25}
        angle={0.5}
        penumbra={1}
      />

      <Suspense fallback={null}>
        <Environment preset={isDarkMode ? "city" : "warehouse"} blur={isMobile ? 0.5 : 0.8} />
      </Suspense>

      <Composition activeSection={activeSection} isDarkMode={isDarkMode} isMobile={isMobile} />

      {!isMobile && (
        <ContactShadows 
          resolution={512} 
          scale={40} 
          blur={2} 
          opacity={isDarkMode ? 0.5 : 0.4} 
          far={10} 
          color={shadowColor} 
        />
      )}

      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 2}
        autoRotate={true}
        autoRotateSpeed={isMobile ? 1.0 : 0.5}
      />
    </Canvas>
  );
};