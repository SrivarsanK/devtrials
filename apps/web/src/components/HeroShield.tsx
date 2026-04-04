"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function GeometricShield({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  const { size } = useThree();
  const responsiveScale = Math.min(Math.max(size.width / 1100, 0.8), 1.4);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth magnetic interpolation based on mouse
    const targetRotationX = mouse.current[1] * 0.3;
    const targetRotationY = mouse.current[0] * 0.3;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    
    // Self-rotation
    meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    meshRef.current.rotation.y += delta * 0.2;
    outerRef.current.rotation.y -= delta * 0.15;
    
    // Breathing scale effect
    const bounce = Math.sin(t * 1.5) * 0.05 + 1;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, responsiveScale * bounce, 0.1));
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        {/* Core - The Kinetic Energy Hub */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2, 12]} />
          <MeshDistortMaterial 
            color="#ff4625" 
            speed={3} 
            distort={0.45} 
            radius={1}
            roughness={0.1}
            metalness={0.9}
            emissive="#ff1e00"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* Outer Kinetic Shield Shell */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.8, 2]} />
          <meshPhongMaterial 
            color="#00d8ff" 
            wireframe 
            transparent 
            opacity={0.15} 
            shininess={100}
            emissive="#00d8ff"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Orbiting Tech Particles */}
        <group rotation={[Math.PI / 4, 0, 0]}>
          <mesh position={[4, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00d8ff" />
          </mesh>
          <mesh position={[-4, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ff4625" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Scene({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={150} color="#ff4625" />
      <pointLight position={[-10, -10, -10]} intensity={100} color="#00d8ff" />
      <GeometricShield mouse={mouse} />
    </>
  );
}

export default function HeroShield() {
  const mouse = useRef<[number, number]>([0, 0]);

  const onMouseMove = (e: React.MouseEvent) => {
    // Map mouse position to -1 to 1 range
    mouse.current = [
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    ];
  };

  return (
    <div 
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
      onMouseMove={onMouseMove}
    >
      <Canvas shadows camera={{ position: [0, 0, 11], fov: 35 }} resize={{ debounce: 0 }}>
        <Scene mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
