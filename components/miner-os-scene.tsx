'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'

function MiningRig() {
  const rig = useRef<Group>(null)

  useFrame((_, delta) => {
    if (rig.current) rig.current.rotation.y += delta * 0.18
  })

  return (
    <group ref={rig} rotation={[0.08, -0.35, 0]}>
      <mesh position={[0, -0.7, 0]} castShadow>
        <boxGeometry args={[3.7, 0.25, 2.15]} />
        <meshStandardMaterial color="#172033" metalness={0.8} roughness={0.28} />
      </mesh>
      {[-1.35, 0, 1.35].map((x) => (
        <group key={x} position={[x, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.95, 1.9, 1.55]} />
            <meshStandardMaterial color="#25324a" metalness={0.55} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0, 0.79]}>
            <boxGeometry args={[0.62, 0.95, 0.025]} />
            <meshStandardMaterial color="#07101e" emissive="#06b6d4" emissiveIntensity={0.28} />
          </mesh>
          {[-0.32, 0.32].map((y) => (
            <mesh key={y} position={[0, y, 0.82]}>
              <cylinderGeometry args={[0.13, 0.13, 0.035, 24]} />
              <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.8} />
            </mesh>
          ))}
        </group>
      ))}
      {[-1.65, 1.65].map((x) => (
        <mesh key={x} position={[x, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

export function MinerOsScene() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#07101e] sm:h-80" aria-label="Interactive 3D CloudMiner rig visualization" role="img"><span className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/10 bg-[#07101e]/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-200">Drag to inspect rig</span>
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[5.2, 3.1, 5.2]} fov={38} />
        <color attach="background" args={['#07101e']} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} color="#dbeafe" castShadow />
        <pointLight position={[0, 1, 2]} intensity={9} distance={7} color="#22d3ee" />
        <pointLight position={[-3, 0, -2]} intensity={7} distance={6} color="#8b5cf6" />
        <MiningRig />
        <OrbitControls enablePan={false} minDistance={4.5} maxDistance={8} autoRotate={false} />
      </Canvas>
    </div>
  )
}
