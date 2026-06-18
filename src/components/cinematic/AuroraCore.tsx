"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles, Trail } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "../../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

// A single orbiting node representing one technology in the stack.
function OrbitNode({ radius, speed, offset, color, tilt }: { radius: number; speed: number; offset: number; color: string; tilt: number }) {
    const ref = React.useRef<THREE.Mesh>(null!);
    const group = React.useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + offset;
        if (group.current) {
            group.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * 0.4, Math.sin(t) * radius);
        }
        if (ref.current) {
            ref.current.rotation.x += 0.01;
            ref.current.rotation.y += 0.015;
        }
    });

    return (
        <group ref={group} rotation={[tilt, 0, 0]}>
            <Trail width={1.4} length={3.5} color={color} attenuation={(t) => t * t}>
                <mesh ref={ref}>
                    <icosahedronGeometry args={[0.085, 0]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} roughness={0.25} metalness={0.4} />
                </mesh>
            </Trail>
        </group>
    );
}

function Core() {
    const coreRef = React.useRef<THREE.Mesh>(null!);
    const wireRef = React.useRef<THREE.Mesh>(null!);
    const groupRef = React.useRef<THREE.Group>(null!);
    const ringsRef = React.useRef<THREE.Group>(null!);
    const { camera } = useThree();

    useFrame((_, delta) => {
        if (coreRef.current) coreRef.current.rotation.y += delta * 0.18;
        if (wireRef.current) wireRef.current.rotation.y -= delta * 0.12;
        if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.05;
    });

    React.useLayoutEffect(() => {
        camera.position.set(0, 0.4, 7.5);
        camera.lookAt(0, 0, 0);

        gsap.set(groupRef.current.scale, { x: 0.001, y: 0.001, z: 0.001 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });

        // Materialize: the core resolves into focus
        tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out" }, 0);
        tl.to(groupRef.current.rotation, { y: Math.PI * 0.6, duration: 4, ease: "power1.inOut" }, 0);

        // Camera drifts in and rises slightly while the orbiting nodes spread out
        tl.to(camera.position, { z: 4.6, y: 0.9, duration: 4, ease: "power2.inOut" }, 1);

        if (ringsRef.current) {
            tl.to(ringsRef.current.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 4, ease: "power2.out" }, 1.2);
        }

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, [camera]);

    const techStack = PORTFOLIO_DATA.techStack;

    return (
        <group ref={groupRef}>
            <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
                {/* Inner glowing core */}
                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[0.95, 1]} />
                    <meshStandardMaterial
                        color="#0b1220"
                        emissive="#22d3ee"
                        emissiveIntensity={0.55}
                        roughness={0.15}
                        metalness={0.7}
                        flatShading
                    />
                </mesh>

                {/* Outer wireframe shell */}
                <mesh ref={wireRef}>
                    <icosahedronGeometry args={[1.35, 2]} />
                    <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.35} />
                </mesh>
            </Float>

            {/* Orbiting tech-stack nodes */}
            <group ref={ringsRef}>
                {techStack.map((tech, i) => (
                    <OrbitNode
                        key={tech.key}
                        radius={2.0 + (i % 3) * 0.55}
                        speed={0.18 + (i % 4) * 0.05}
                        offset={i * 1.3}
                        tilt={(i % 5) * 0.35 - 0.7}
                        color={tech.color}
                    />
                ))}
            </group>

            <Sparkles count={120} scale={6} size={1.5} speed={0.25} color="#bfe9ff" opacity={0.5} />
        </group>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[-4, 5, 5]} intensity={1.1} color="#bfe9ff" />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#22d3ee" distance={6} />
            <pointLight position={[3, -2, -3]} intensity={1.2} color="#a78bfa" distance={8} />

            <Core />

            <Environment preset="night" />
            <EffectComposer>
                <Bloom intensity={0.85} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
                <Vignette eskil={false} offset={0.15} darkness={1.05} />
            </EffectComposer>
        </>
    );
}

export default function AuroraCore() {
    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.4, 7.5], fov: 42 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            onCreated={({ gl }) => {
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.toneMappingExposure = 1.1;
            }}
            className="pointer-events-none"
        >
            <Scene />
        </Canvas>
    );
}
