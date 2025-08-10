import React, { Suspense, useEffect, useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useCursor, RoundedBox } from '@react-three/drei';
import gsap from 'gsap';

function Scene() {
    const [hovered, setHover] = useState(false);

    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (meshRef.current == undefined) return;

        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.015;
    });

    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    useEffect(() => {
        if (cameraRef.current == undefined) return;

        if (hovered) {
            gsap.to(cameraRef.current.position, {
                duration: 0.5,
                x: 0,
                y: 0,
                z: 5.3,
            });
        } else {
            gsap.to(cameraRef.current.position, {
                duration: 0.5,
                x: 0,
                y: 0,
                z: 6.5,
            });
        }
    }, [hovered]);

    useCursor(hovered);

    // calc position
    const calcPosition = (i: number) => {
        const pos = [
            [-1, -1, -1],
            [1, -1, -1],
            [-1, 1, -1],
            [1, 1, -1],
            [-1, -1, 1],
            [1, -1, 1],
            [-1, 1, 1],
            [1, 1, 1],
        ];
        return { position: pos[i] as [number, number, number] };
    };

    const objectMaterial = new THREE.MeshPhysicalMaterial({
        transmission: 1.0,
        roughness: 0.1,
    });

    return (
        <group onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <PerspectiveCamera makeDefault fov={75} aspect={window.innerWidth / window.innerHeight} ref={cameraRef}>
                <ambientLight intensity={0.05} castShadow />
                <pointLight position={[30, 20, 30]} intensity={1.8} castShadow shadow-mapSize-height={1024} />
            </PerspectiveCamera>
            <Suspense fallback={null}>
                <group ref={meshRef}>
                    {[...Array(8)].map((_, i) => (
                        <RoundedBox
                            key={i}
                            args={[1.9, 1.9, 1.9]}
                            radius={0.1}
                            {...calcPosition(i)}
                            castShadow
                            receiveShadow
                        >
                            <meshStandardMaterial {...objectMaterial} color={hovered ? '#525252' : 'white'} />
                        </RoundedBox>
                    ))}
                </group>
            </Suspense>
        </group>
    );
}

export default function CubeIcon() {
    return (
        <Canvas dpr={[1, 2]}>
            <Scene />
        </Canvas>
    );
}
