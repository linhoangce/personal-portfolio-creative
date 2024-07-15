'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Shapes() {
    return (
        <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas className="z-0" shadows gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}>
                <Suspense callback={null}>
                    <Geometries />
                    <ContactShadows
                        position={[0, -3.5, 0]}
                        opacity={0.65}
                        scale={40}
                        blue={1}
                        far={9}
                    />
                    <Environment preset="studio" />
                </Suspense>
            </Canvas>
        </div>
    );
}

function Geometries() {
    const geometries = [
        {
            position: [0,0,0],
            r: 0.3,
            geometry: new THREE.IcosahedronGeometry(3) // Gem
        },
        {
            position: [1, -0.75, 4],
            r: 0.4,
            geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16) // Pill
        },
        {
            position: [-1.4, 2, -4],
            r: 0.6,
            geometry: new THREE.DodecahedronGeometry(1.5) // Soccer ball
        },
        {
            position: [-0.8, -0.75, 5],
            r: 0.5,
            geometry: new THREE.TorusGeometry(0.6, 0.25, 6, 32) // Donut
        },
        {
            position: [1.6, 1.6, -4],
            r: 0.7,
            geometry: new THREE.OctahedronGeometry(1.5) // Diamond
        },
    ];

    const soundEffects = [
        new Audio("/sound/forceField_000.ogg"),
        new Audio("/sound/jingles_STEEL05.ogg"),
        new Audio("/sound/laser3.ogg"),
    ];
    

    const materials = [
        new THREE.MeshNormalMaterial(),
        new THREE.MeshStandardMaterial({ color: 0xff9ff3, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: 0xfeca57, roughness: 1}),
        new THREE.MeshStandardMaterial({ color: 0x0abde3, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 1, metalness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x00d2d3, roughness: 1, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 1, metalness: 1 }),
        new THREE.MeshStandardMaterial({ color: 0xe1b12c, roughness: 1, metalness: 1 }),
    ];

    return geometries.map(({ position, r, geometry }) => (
        <Geometry 
            key={JSON.stringify(position)}
            position={position.map((p) => p * 2)}
            geometry={geometry}
            materials={materials}
            r={r}
            soundEffects={soundEffects}
        />
    ))

}

function Geometry({r, position, geometry, materials, soundEffects}) {
    const meshRef = useRef();
    
    const [visible, setVisible] = useState(false);

    const startingMaterial = getRandomMaterial();

    function getRandomMaterial() {
        return gsap.utils.random(materials);
    }

    function handleClick(event) {
        const mesh = event.object;

        gsap.utils.random(soundEffects).play();

        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0,2)}`,
            y: `+=${gsap.utils.random(0,2)}`,
            z: `+=${gsap.utils.random(0,2)}`,
            duration: 1.3,
            ease: "elastic.out(1, 0.3)",
            yoyo: true,
        });

        mesh.material = getRandomMaterial();
    }

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        document.body.style.cursor = "default";
    };

    useEffect(() => {
        let ctx = gsap.context(() => {
            setVisible(true);
            gsap.from(meshRef.current.scale,
                {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1,
                    ease: 'elastic.out(1,0.3)',
                    delay: 0.3,
                }
            )
        });

        return () => ctx.revert();
    },[]);

    return (
        <group position={position} ref={meshRef}>
            <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                <mesh
                    geometry={geometry}
                    onClick={handleClick}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    visible={visible}
                    material={startingMaterial}
                />
            </Float>
        </group>
    )
}