import React, { Suspense, useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import {
  PerspectiveCamera,
  Environment,
  MeshDistortMaterial,
} from '@react-three/drei'
import gsap from 'gsap'

function Scene() {
  const [mousePos, setPosition] = useState({ x: 0, y: 0 })

  // convert number to specific range of values
  const convertRange = (
    value: number,
    min1: number,
    max2: number,
    min3: number,
    max4: number
  ) => {
    return ((value - min1) * (max4 - min3)) / (max2 - min1) + min3
  }

  useEffect(() => {
    const MouseEventHandler = (e: MouseEvent) => {
      const x = convertRange(e.clientX, 0, window.screen.width, -1.2, 1.2)
      const y = convertRange(e.clientY, 0, window.screen.height, 0, -1.2)
      setPosition({ x: x, y: y })
    }
    window.addEventListener('mousemove', MouseEventHandler)

    return () => window.removeEventListener('mousemove', MouseEventHandler)
  }, [])

  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHover] = useState(false)

  useEffect(() => {
    if (ref.current == null) return

    gsap.to(ref.current.position, {
      x: mousePos.x,
      y: mousePos.y,
      duration: 3,
      delay: 0.1,
    })
  }, [mousePos])

  const glassMaterial = {
    color: hovered ? '#cf3bb4' : '#3d7190',
    transmission: 0.6,
    roughness: 0.1,
    envMapIntensity: 1,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    metalness: 0.2,
    speed: 2,
    distort: 0.25,
  }

  return (
    <Suspense fallback={null}>
      <mesh
        ref={ref}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereBufferGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial {...glassMaterial} />
      </mesh>
      <Environment preset="lobby" resolution={32} />
    </Suspense>
  )
}

export default function CreatorBubble() {
  const [screenWide, setScreenWide] = useState(1440)
  useEffect(() => {
    setScreenWide(window.screen.width)

    const handleResize = () => {
      setScreenWide(window.screen.width)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Canvas id="bubble-creator" className="canvas" dpr={[1, 2]}>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 2]}
        fov={(1.6 / screenWide) * 10 ** 5}
      >
        <ambientLight intensity={1.2} />
      </PerspectiveCamera>
      <Scene />
    </Canvas>
  )
}
