import * as React from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, MeshReflectorMaterial, SoftShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";

const ICONS = [
    { key: "React", color: "#38bdf8" },
    { key: "TypeScript", color: "#60a5fa" },
    { key: "AWS", color: "#f59e0b" },
    { key: "Java", color: "#fb7185" },
    { key: "Python", color: "#a78bfa" },
    { key: "Docker", color: "#22c55e" },
    { key: "Spring Boot", color: "#84cc16" },
];

function Scene() {
    const { camera } = useThree();

    const hingeRef = React.useRef<THREE.Group>(null!);
    const screenRef = React.useRef<THREE.Mesh>(null!);
    const iconRefs = React.useRef<THREE.Mesh[]>([]);
    iconRefs.current = [];

    React.useEffect(() => {
        // Initial camera: Cinematic angle
        camera.position.set(0.5, 0.4, 4.8);
        camera.lookAt(0, 0, 0);

        // Initial states
        if (hingeRef.current) {
            hingeRef.current.rotation.x = -Math.PI / 2; // Fully closed (flat)
        }

        // Icons: hidden inside/near
        iconRefs.current.forEach((m) => {
            if (!m) return;
            m.position.set(0, 0.05, 0);
            m.scale.setScalar(0.01);
            (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        });

        // Timeline Loop
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

        // 1. Hold Closed
        tl.to({}, { duration: 0.5 });

        // 2. Open Laptop (Hinge rotates up)
        tl.to(
            hingeRef.current.rotation,
            { x: -0.25, duration: 1.8, ease: "power3.inOut" }, // Opens to comfortable viewing angle
            0.5
        );

        // 3. Camera Move (Push in + Orbit)
        tl.to(
            camera.position,
            { x: 0.2, y: 0.3, z: 3.8, duration: 2.5, ease: "power2.inOut" },
            0.8
        );

        // 4. Icons Pop Out (Wave)
        const validIcons = iconRefs.current.filter(Boolean);

        // Scale up
        tl.to(
            validIcons.map(m => m.scale),
            { x: 1, y: 1, z: 1, duration: 0.8, stagger: 0.08, ease: "back.out(2)" },
            1.8
        );
        // Move forward out of screen
        tl.to(
            validIcons.map(m => m.position),
            { z: 0.5, duration: 1.2, stagger: 0.08, ease: "power3.out" },
            1.8
        );
        // Light up
        tl.to(
            validIcons.map(m => (m.material as THREE.MeshStandardMaterial)),
            { emissiveIntensity: 0.8, duration: 0.5 },
            1.8
        );

        // 5. Form Array (Arc)
        const totalWidth = 2.8;
        const targets = ICONS.map((_, i) => {
            const step = totalWidth / (ICONS.length - 1);
            const x = -totalWidth / 2 + (i * step);
            const y = 0.5 + Math.sin((i / (ICONS.length - 1)) * Math.PI) * 0.2; // Arc
            const z = 0.8;
            return { x, y, z };
        });

        tl.to(
            validIcons.map(m => m.position),
            {
                x: (i) => targets[i].x,
                y: (i) => targets[i].y,
                z: (i) => targets[i].z,
                duration: 1.2,
                ease: "power2.inOut"
            },
            2.5
        );

        // 6. Settle/Hold
        tl.to({}, { duration: 2.0 });

        // 7. Reset Sequence (Quick close)
        // 7. Reset Sequence (Quick close)
        tl.to(
            hingeRef.current.rotation,
            { x: -Math.PI / 2, duration: 1.0, ease: "power2.inOut" },
            ">-0.5"
        );
        tl.to(
            camera.position,
            { x: 0.5, y: 0.4, z: 4.8, duration: 1.2, ease: "power2.inOut" },
            "<"
        );
        // Hide icons
        tl.to(validIcons.map(m => m.scale), { x: 0, y: 0, z: 0, duration: 0.5 }, "<");

        return () => { tl.kill(); };
    }, [camera]);

    // Geometry constants
    const BASE_WIDTH = 2.4;
    const BASE_DEPTH = 1.6;
    const BASE_THICKNESS = 0.12;
    const SCREEN_THICKNESS = 0.08;

    return (
        <>
            <color attach="background" args={["#050814"]} />

            {/* --- LIGHTING RIG --- */}
            {/* Key Light (Front-Left, Cool White) */}
            <directionalLight position={[-4, 6, 6]} intensity={1.5} color="#ffffff" castShadow />

            {/* Rim Light (Back-Right, Cyan/Blue Accent) */}
            <directionalLight position={[6, 2, -6]} intensity={2.0} color="#38bdf8" />

            {/* Fill Light (Soft Ambience) */}
            <ambientLight intensity={0.2} />

            {/* --- ENVIRONMENT --- */}
            <Environment preset="city" />

            {/* Floor Reflection */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
                <planeGeometry args={[20, 20]} />
                <MeshReflectorMaterial
                    blur={[300, 60]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={0.7}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050814"
                    metalness={0.6}
                    mirror={0.5}
                />
            </mesh>

            {/* --- LAPTOP MODEL --- */}
            <group position={[0, -0.2, 0]}>

                {/* Base (Static) */}
                <mesh position={[0, 0, 0]} receiveShadow castShadow>
                    <boxGeometry args={[BASE_WIDTH, BASE_THICKNESS, BASE_DEPTH]} />
                    <meshStandardMaterial
                        color="#0b1220"
                        metalness={0.9}
                        roughness={0.2}
                    />
                </mesh>

                {/* Hinge Pivot Group (Rotates around back edge of base) */}
                {/* Base depth is 1.6, so back edge is at z = -0.8 */}
                <group ref={hingeRef} position={[0, BASE_THICKNESS / 2, -BASE_DEPTH / 2 + 0.05]}>

                    {/* Screen Mesh (Offset so pivot is at bottom) */}
                    {/* Screen height ~1.5, so center y is +0.75 */}
                    <mesh ref={screenRef} position={[0, 0.75, 0]}>
                        <boxGeometry args={[BASE_WIDTH, 1.5, SCREEN_THICKNESS]} />
                        <meshStandardMaterial
                            color="#080c14"
                            metalness={0.8}
                            roughness={0.2}
                            emissive="#0ea5e9"
                            emissiveIntensity={0.1} // Start dim
                        />
                    </mesh>

                    {/* Inner Screen Glow (The Display) */}
                    <mesh position={[0, 0.75, SCREEN_THICKNESS / 2 + 0.001]}>
                        <planeGeometry args={[BASE_WIDTH * 0.95, 1.4]} />
                        <meshStandardMaterial
                            color="#000000"
                            emissive="#ffffff"
                            emissiveIntensity={0.1}
                            roughness={0.2}
                        />
                    </mesh>
                </group>
            </group>

            {/* --- TECH ICONS --- */}
            <group position={[0, 0, 0]}>
                {ICONS.map((it, idx) => (
                    <mesh
                        key={it.key}
                        ref={(el: THREE.Mesh) => { if (el) iconRefs.current[idx] = el; }}
                        castShadow
                    >
                        <boxGeometry args={[0.25, 0.25, 0.04]} />
                        <meshStandardMaterial
                            color="#1e293b"
                            emissive={new THREE.Color(it.color)}
                            emissiveIntensity={0}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                ))}
            </group>

            {/* --- POST PROCESSING --- */}
            <EffectComposer>
                <Bloom
                    intensity={0.5}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    );
}

export default function HeroVideoLab() {
    return (
        <Canvas
            dpr={[1, 1.5]} // Cap quality for performance
            shadows
            camera={{ position: [0.5, 0.4, 4.8], fov: 40 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
            <SoftShadows size={10} samples={10} />
            <Scene />
        </Canvas>
    );
}
