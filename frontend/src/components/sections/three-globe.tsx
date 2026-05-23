"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function CountryNodes() {
  const points = [
    [0.3, 0.4, 0.8], // India
    [0.6, 0.2, 0.6], // Malaysia
    [-0.8, 0.3, 0.2], // USA
    [0.9, -0.3, -0.1] // Australia
  ];
  return (
    <>
      {points.map((point, idx) => (
        <mesh key={idx} position={new THREE.Vector3(point[0], point[1], point[2])}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.8} />
        </mesh>
      ))}
    </>
  );
}

function OrbitingBalls() {
  const orbitRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const speed = (Math.PI * 2) / 4; // 4 seconds per full rotation
  const radius = 0.5;
  const colors = ["#8B0000", "#004d00", "#00008B"] as const;

  useFrame((state, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.z += speed * delta;
    if (tiltRef.current) {
      tiltRef.current.rotation.y += 0.38 * delta;
      tiltRef.current.rotation.x = 0.78 + Math.sin(state.clock.elapsedTime * 0.65) * 0.08;
    }
  });

  return (
    <group ref={tiltRef} rotation={[0.78, 0.62, 0]}>
      <group ref={orbitRef}>
        {colors.map((color, idx) => {
          const angle = (idx / colors.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <mesh key={color} position={[x, y, 0]}>
              <sphereGeometry args={[0.1, 30, 30]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function RotatingGlobeCore({ chainFlash }: { chainFlash: boolean }) {
  const coreRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.45;
  });

  return (
    <group ref={coreRef}>
      <Sphere args={[1, 64, 64]}>
        <meshPhysicalMaterial
          color={chainFlash ? "#fca5a5" : "#fcd34d"}
          emissive={chainFlash ? "#7f1d1d" : "#fde047"}
          emissiveIntensity={chainFlash ? 1.5 : 1.15}
          metalness={0.88}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          wireframe
        />
      </Sphere>
      <OrbitingBalls />
      <CountryNodes />
    </group>
  );
}

export function ThreeGlobe() {
  const [chainFlash, setChainFlash] = useState(false);

  useEffect(() => {
    const onFlash = () => {
      setChainFlash(true);
      window.setTimeout(() => setChainFlash(false), 420);
    };
    window.addEventListener("iqmath:globe-chain-flash", onFlash);
    return () => window.removeEventListener("iqmath:globe-chain-flash", onFlash);
  }, []);

  return (
    <div className="hero-globe h-[360px] w-full rounded-3xl border border-white/10 bg-slate-950/40 [transform-style:preserve-3d]">
      <Canvas camera={{ position: [0, 0, 2.8] }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 2, 3]} intensity={2.4} color="#fef08a" />
        <directionalLight position={[-2, -1, 2]} intensity={1.35} color="#facc15" />
        <RotatingGlobeCore chainFlash={chainFlash} />
        <Stars radius={80} depth={60} count={3000} factor={4} />
        <OrbitControls
          enableZoom
          enableRotate
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          minDistance={0.55}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}
