import React, { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei'
import { useTexture } from '@react-three/drei'
import { BubbleAtom } from "../stores/BubbleAtom"
import { useAtomValue } from 'jotai/utils'

function Scene() {
  const bubbleThumb = useAtomValue(BubbleAtom)

  const customMap: THREE.Texture = useTexture(bubbleThumb)

  const [screenWide, setScreenWide] = useState(1440)
  useEffect(() => {
    setScreenWide(window.screen.width)
    
    const handleResize = () => {
      setScreenWide(window.screen.width)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={1.4 / screenWide * (10 ** 5)} aspect={window.innerWidth / window.innerHeight}>
        <ambientLight intensity={0.5} />
      </PerspectiveCamera>
      <Suspense fallback={null}>
        <mesh rotation-y={Math.PI * -0.5}>
          <sphereBufferGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial map={customMap} envMapIntensity={1} clearcoat={0.4} clearcoatRoughness={0} metalness={0.8} speed={1} distort={0.3} />
        </mesh>
        <Environment preset="warehouse" />
      </Suspense>
    </>
  )
}

export default function Bubble() {

  return (
    <Canvas className="canvas" dpr={[1, 2]}>
      <Scene />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
    </Canvas>
  )
}
