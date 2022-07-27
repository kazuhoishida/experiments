import React, { Suspense, useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'

function Scene() {
  const [active, setActive] = useState(false)
  const [hovered, setHover] = useState(false)

  const meshRef = useRef<THREE.InstancedMesh>(null)
    const amount = 8 // box amount

    const position = useMemo(() => {
        const pos = [
          -1, -1, -1,
          1, -1, -1,
          -1, 1, -1,
          1, 1, -1,
          -1, -1, 1,
          1, -1, 1,
          -1, 1, 1,
          1, 1, 1,
        ]
        return pos
    }, [])

    useEffect(() => {
      if(meshRef.current == undefined) return

      const matrix = new THREE.Matrix4()

      for (let i = 0; i < amount; i++) {
        matrix.setPosition(position[i * 3], position[i * 3 + 1], position[i * 3 + 2])
        meshRef.current!.setMatrixAt(i, matrix)
      }

    }, [amount, position, active])


    useFrame(() => {
      if(meshRef.current == undefined) return

      meshRef.current.rotation.x += 0.008
      meshRef.current.rotation.y += 0.01
    })

    const cameraRef = useRef<THREE.PerspectiveCamera>(null)

    useEffect(() => {
      if(cameraRef.current == undefined) return

      if(hovered) {
        gsap.to(cameraRef.current.position, {duration: 0.2, x: 0, y: 0, z: 5.5})
      } else {
        gsap.to(cameraRef.current.position, {duration: 0.2, x: 0, y: 0, z: 6})
      }
    }, [hovered])

  return (
    <group
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={70} aspect={window.innerWidth / window.innerHeight} ref={cameraRef}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
      </PerspectiveCamera>
      <Suspense fallback={null}>
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, amount]}
          receiveShadow
          castShadow
          onClick={() => setActive(!active)}
        >
          <boxGeometry args={[1.7, 1.7, 1.7]}>
          </boxGeometry>
          <meshStandardMaterial color={active ? 'gray' : hovered ? 'gray' : 'white'} />
        </instancedMesh>
      </Suspense>
    </group>
  )
}

export default function CubeIcon() {

  return (
    <Canvas className="canvas" dpr={[1, 2]}>
      <Scene />
    </Canvas>
  )
}
