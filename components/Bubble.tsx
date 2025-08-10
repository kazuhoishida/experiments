import React, { Suspense, useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import {
  PerspectiveCamera,
  Environment,
  MeshDistortMaterial,
} from '@react-three/drei'
import { useTexture } from '@react-three/drei'
import { BubbleAtom } from '../stores/BubbleAtom'
import { useAtomValue } from 'jotai'
import { easing } from 'maath'

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

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const materials = {
    map: customMap,
    envMapIntensity: 1,
    clearcoat: 0.2,
    clearcoatRoughness: 0.07,
    metalness: 0.6,
    speed: 1.8,
    distort: 0.3,
  }

  const sphereRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!sphereRef.current) return

    const time = clock.getElapsedTime()
    sphereRef.current!.position.y = Math.sin(time) * 0.2
    sphereRef.current!.position.x = Math.cos(time) * 0.2
  })

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 2]}
        fov={(10 / screenWide) * 10 ** 4}
      >
        <ambientLight intensity={0.5} />
      </PerspectiveCamera>
      <Suspense fallback={null}>
        <mesh rotation-y={Math.PI * -0.5} ref={sphereRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial {...materials} />
        </mesh>
        <Environment preset="warehouse" />
      </Suspense>
    </>
  )
}

function CameraRig(): null {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [(state.pointer.x * state.viewport.width) / 3, 1 + state.pointer.y, 2],
      0.2,
      delta
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Bubble() {
  return (
    <>
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <CameraRig />
      </Canvas>
      <Loader containerStyles={{ background: 'none' }} />
    </>
  )
}
