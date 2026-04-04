"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  Points, 
  PointMaterial, 
  PerspectiveCamera,
  Preload,
  ScrollControls,
  useScroll,
  MeshWobbleMaterial,
  Text,
  Html,
  useProgress
} from "@react-three/drei";
import * as THREE from "three";
import { random } from "maath";

// --- Color Configuration (Synchronized with web app design system) ---
const COLORS = {
  PRIMARY: "#ff4625",    // Fireship Orange
  SECONDARY: "#00d8ff",  // React.gg Cyan
  ACCENT: "#ffc800",     // Fireship Yellow
  BACKGROUND: "#0d0d0d", // Synced with /web
  SURFACE: "#141414"     // Synced with /web
};

// --- Custom Loader ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 min-w-[200px]">
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
          Initializing Station {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

// --- Background Data Grid (Scroll-Driven) ---
function DataGrid() {
  const gridRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame(() => {
    if (!gridRef.current) return;
    // Hyperspace traversal velocity
    gridRef.current.position.z = (scroll.offset * 15) % 4;
    gridRef.current.position.y = -2;
  });

  return (
    <group ref={gridRef}>
      <gridHelper 
        args={[100, 40, COLORS.PRIMARY, "#1a1a2e"]} 
        position={[0, -2, 0]} 
        onUpdate={(self) => { self.material.transparent = true; self.material.opacity = 0.15; }}
      />
      <gridHelper 
        args={[100, 20, COLORS.SECONDARY, "#1a1a2e"]} 
        rotation={[Math.PI, 0, 0]} 
        position={[0, 8, 0]} 
        onUpdate={(self) => { self.material.transparent = true; self.material.opacity = 0.08; }}
      />
    </group>
  );
}

// --- Floating Particle Field ---
function ParticleField({ count = 800 }) {
  const points = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => random.inSphere(new Float32Array(count * 3), { radius: 12 }) as Float32Array);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.x -= delta / 40;
    points.current.rotation.y -= delta / 50;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={points} positions={sphere} stride={3} frustumCulled={true}>
        <PointMaterial
          transparent
          color={COLORS.SECONDARY}
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

// --- The Sovereign Protection Core ---
function ShieldCore() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const secondaryRingRef = useRef<THREE.Mesh>(null!);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!coreRef.current || !outerRef.current || !secondaryRingRef.current) return;
    
    const t = state.clock.getElapsedTime();
    const s = scroll.offset;

    // Rotation logic
    coreRef.current.rotation.x = t * 0.2 + s * 4;
    coreRef.current.rotation.y = t * 0.3 + s * 2;
    
    // Pulse scale based on hover/time
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    coreRef.current.scale.setScalar(pulse);

    outerRef.current.rotation.z = -t * 0.15 - s * 6;
    secondaryRingRef.current.rotation.y = t * 0.4 + s * 3;
    
    // Smooth vertical hover (offset for top-right placement)
    coreRef.current.parent!.position.y = 3.5 + Math.sin(t) * 0.15;
  });

  return (
    <group position={[3.2, 3.5, 0]} scale={0.35}>
      {/* Central Icosahedron (The Logic Engine) */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={COLORS.PRIMARY}
          emissive={COLORS.PRIMARY}
          emissiveIntensity={0.8}
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={1}
        />
      </mesh>

      {/* Internal Wireframe Structure */}
      <mesh scale={0.9}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={COLORS.SECONDARY} wireframe transparent opacity={0.2} />
      </mesh>

      {/* Orbital Ring 01 - Performance Node */}
      <mesh ref={outerRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.008, 12, 64]} />
        <meshStandardMaterial 
          color={COLORS.PRIMARY} 
          emissive={COLORS.PRIMARY} 
          emissiveIntensity={2} 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* Orbital Ring 02 - Security Node */}
      <mesh ref={secondaryRingRef} rotation={[0, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.005, 8, 80]} />
        <meshStandardMaterial 
          color={COLORS.SECONDARY} 
          emissive={COLORS.SECONDARY} 
          emissiveIntensity={1.5} 
          transparent 
          opacity={0.5} 
        />
      </mesh>

      {/* Glow Aura */}
      <mesh scale={[4, 4, 4]}>
         <sphereGeometry args={[1, 32, 32]} />
         <meshBasicMaterial color={COLORS.PRIMARY} transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// --- Interactive View Rig ---
function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  return useFrame(() => {
    // Smoother lerp for mission-critical feeling
    camera.position.lerp(vec.set(mouse.x * 0.5, mouse.y * 0.5, 6), 0.05);
    camera.lookAt(0, 0, 0);
  });
}

// --- Reusable Bento 3D Component (Fixed Context) ---
function BentoMesh({ type, color, opacity }: { type: string; color: string; opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      {type === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {type === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
      {type === "torus" && <torusGeometry args={[0.8, 0.02, 12, 48]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

export function Bento3D({ type = "icosahedron", color = COLORS.PRIMARY, opacity = 0.2 }) {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <Canvas dpr={1} camera={{ position: [0, 0, 2], fov: 40 }} gl={{ antialias: false }}>
        <ambientLight intensity={1} />
        <BentoMesh type={type} color={color} opacity={opacity} />
      </Canvas>
    </div>
  );
}

interface HeroSceneProps {
  scrollProgress?: number;
}

export default function HeroScene({ scrollProgress = 0 }: HeroSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="absolute inset-0 bg-[#0d0d0d]" />;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden h-screen bg-[#0d0d0d]">
      <Canvas 
        dpr={1} 
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: false, 
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
      >
        <color attach="background" args={[COLORS.BACKGROUND]} />
        <fog attach="fog" args={[COLORS.BACKGROUND, 5, 15]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color={COLORS.SECONDARY} />
        <pointLight position={[-10, -10, 10]} intensity={1.5} color={COLORS.PRIMARY} />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.2} penumbra={1} color={COLORS.ACCENT} />

        <Suspense fallback={<Loader />}>
          <ScrollControls pages={3} damping={0.2}>
            <ShieldCore />
            <DataGrid />
            <ParticleField />
            <Rig />
          </ScrollControls>
          <Preload all />
        </Suspense>
      </Canvas>
      
      {/* Overlay Gradients for depth */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#0a0a12] to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a12_90%)] opacity-60 z-10 pointer-events-none" />
    </div>
  );
}

