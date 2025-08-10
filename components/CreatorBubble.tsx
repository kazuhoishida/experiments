import React, { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import gsap from 'gsap';

function Scene() {
    const [mousePos, setPosition] = useState({ x: 0, y: 0 });

    const convertRange = (value: number, min1: number, max2: number, min3: number, max4: number) => {
        return ((value - min1) * (max4 - min3)) / (max2 - min1) + min3;
    };

    useEffect(() => {
        const MouseEventHandler = (e: MouseEvent) => {
            if (typeof window !== 'undefined') {
                const x = convertRange(e.clientX, 0, window.innerWidth, -1.2, 1.2);
                const y = convertRange(e.clientY, 0, window.innerHeight, 0, -1.2);
                setPosition({ x: x, y: y });
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', MouseEventHandler);
            return () => window.removeEventListener('mousemove', MouseEventHandler);
        }
    }, []);

    const ref = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useEffect(() => {
        if (ref.current == null) return;

        gsap.to(ref.current.position, {
            x: mousePos.x,
            y: mousePos.y,
            duration: 3,
            delay: 0.1,
        });
    }, [mousePos]);

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
    };

    return (
        <Suspense fallback={null}>
            <mesh ref={ref} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial {...glassMaterial} />
            </mesh>
            <Environment preset="lobby" resolution={32} />
        </Suspense>
    );
}

export default function CreatorBubble() {
    const [screenWide, setScreenWide] = useState(1440);

    useEffect(() => {
        const updateScreenWidth = () => {
            if (typeof window !== 'undefined') {
                setScreenWide(window.innerWidth);
            }
        };

        updateScreenWidth();

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', updateScreenWidth);
            return () => window.removeEventListener('resize', updateScreenWidth);
        }
    }, []);

    return (
        <Canvas id="bubble-creator" className="canvas" dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={(1.6 / screenWide) * 10 ** 5}>
                <ambientLight intensity={1.2} />
            </PerspectiveCamera>
            <Scene />
        </Canvas>
    );
}
