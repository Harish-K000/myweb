import * as React from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, MeshReflectorMaterial, RoundedBox, SoftShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "../../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

function Scene() {
    const { camera } = useThree();
    const hingeRef = React.useRef<THREE.Group>(null!);
    const screenGlowRef = React.useRef<THREE.Mesh>(null!);
    const iconRefs = React.useRef<THREE.Mesh[]>([]);
    iconRefs.current = [];

    React.useLayoutEffect(() => {
        // Initial Camera Pose (Closed State)
        camera.position.set(0.5, 0.4, 4.8);
        camera.lookAt(0, 0, 0);

        // Initial Object States
        if (hingeRef.current) {
            hingeRef.current.rotation.x = -Math.PI / 2; // Closed
        }

        // Hide icons initially
        iconRefs.current.forEach((m) => {
            if (!m) return;
            m.position.set(0, 0.05, 0);
            m.scale.setScalar(0);
            (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        });

        if (screenGlowRef.current) {
            (screenGlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.05;
        }

        // --- SCROLL ANIMATION ---
        // The timeline scrubs 0 to 1 based on the #hero-section scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            }
        });

        // 0.00-0.20: Closed, Calm (Camera drift handled by logic or slight movement)
        tl.to(camera.position, { x: 0.45, duration: 2 }, 0); // slight drift

        // 0.20-0.55: Laptop Opens
        tl.to(
            hingeRef.current.rotation,
            { x: -0.2, duration: 3.2, ease: "power2.inOut" },
            2 // Start at 0.2 (2s in 10s timeline for example, or normalized)
        );

        // 0.55-0.75: Camera Push + Yaw
        // Push in to focus on screen
        tl.to(
            camera.position,
            { x: 0.18, y: 0.32, z: 3.6, duration: 2, ease: "power2.inOut" },
            5.5
        );

        // Screen glow intensifies as the lid opens
        if (screenGlowRef.current) {
            tl.to(
                screenGlowRef.current.material as THREE.MeshStandardMaterial,
                { emissiveIntensity: 0.9, duration: 2.2, ease: "power2.out" },
                4.8
            );
        }

        // 0.60-0.85: Icons Pop Out
        const validIcons = iconRefs.current.filter(Boolean);

        // Staggered Scale Up
        tl.to(
            validIcons.map(m => m.scale),
            { x: 1, y: 1, z: 1, duration: 2.5, stagger: 0.1, ease: "back.out(1.7)" },
            6.0
        );

        // Move Forward (Pop out of screen)
        tl.to(
            validIcons.map(m => m.position),
            { z: 0.6, duration: 2.5, stagger: 0.1, ease: "power3.out" },
            6.0
        );

        // Light up
        tl.to(
            validIcons.map(m => (m.material as THREE.MeshStandardMaterial)),
            { emissiveIntensity: 0.6, duration: 1 },
            6.5
        );

        // 0.75-1.00: Arrange Grid/Orbit
        const totalWidth = 2.6; // wider spread
        const targets = PORTFOLIO_DATA.techStack.map((_, i) => {
            const len = PORTFOLIO_DATA.techStack.length;
            // Simple arc layout
            const step = totalWidth / (len - 1);
            const x = -totalWidth / 2 + (i * step);
            const y = 0.5 + Math.sin((i / (len - 1)) * Math.PI) * 0.3;
            const z = 0.5 + Math.random() * 0.2; // slight depth var
            return { x, y, z };
        });

        tl.to(
            validIcons.map(m => m.position),
            {
                x: (i) => targets[i].x,
                y: (i) => targets[i].y,
                z: (i) => targets[i].z,
                duration: 2.5,
                ease: "power2.inOut"
            },
            7.5
        );

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, [camera]);

    const BASE_WIDTH = 2.4;
    const BASE_DEPTH = 1.6;
    const BASE_THICKNESS = 0.12;
    const SCREEN_THICKNESS = 0.08;

    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight
                position={[-4, 6, 6]}
                intensity={1.1}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0002}
            />
            <directionalLight position={[6, 2, -6]} intensity={0.7} color="#38bdf8" />
            <spotLight
                position={[0, 4, 3]}
                angle={0.35}
                penumbra={0.6}
                intensity={0.9}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.00015}
            />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <MeshReflectorMaterial
                    blur={[220, 50]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={18}
                    roughness={0.55}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050814"
                    metalness={0.45}
                    mirror={0.35}
                />
            </mesh>
            <ContactShadows
                position={[0, -0.38, 0]}
                opacity={0.5}
                scale={10}
                blur={1.6}
                far={2.2}
            />

            {/* Laptop */}
            <group position={[0, -0.2, 0]}>
                {/* Base */}
                <RoundedBox args={[BASE_WIDTH, BASE_THICKNESS, BASE_DEPTH]} radius={0.04} smoothness={6} receiveShadow castShadow>
                    <meshPhysicalMaterial
                        color="#0b1220"
                        metalness={0.85}
                        roughness={0.25}
                        clearcoat={0.6}
                        clearcoatRoughness={0.15}
                    />
                </RoundedBox>

                {/* Hinge Group */}
                <group ref={hingeRef} position={[0, BASE_THICKNESS / 2, -BASE_DEPTH / 2 + 0.05]}>
                    {/* Screen */}
                    <RoundedBox args={[BASE_WIDTH, 1.5, SCREEN_THICKNESS]} radius={0.03} smoothness={6} position={[0, 0.75, 0]} castShadow>
                        <meshPhysicalMaterial
                            color="#0b1220"
                            metalness={0.65}
                            roughness={0.3}
                            clearcoat={0.5}
                            clearcoatRoughness={0.2}
                        />
                    </RoundedBox>
                    {/* Display Glow */}
                    <mesh ref={screenGlowRef} position={[0, 0.75, SCREEN_THICKNESS / 2 + 0.001]}>
                        <planeGeometry args={[BASE_WIDTH * 0.95, 1.4]} />
                        <meshStandardMaterial color="#060a12" emissive="#bfe9ff" emissiveIntensity={0.1} />
                    </mesh>
                </group>
            </group>

            {/* Icons */}
            <group>
                {PORTFOLIO_DATA.techStack.map((tech, i) => (
                    <mesh key={tech.key} ref={el => { if (el) iconRefs.current[i] = el; }} castShadow>
                        <boxGeometry args={[0.25, 0.25, 0.04]} />
                        <meshStandardMaterial
                            color="#1e293b"
                            emissive={tech.color}
                            emissiveIntensity={0}
                            metalness={0.8}
                        />
                    </mesh>
                ))}
            </group>

            <Environment preset="city" />
            <EffectComposer>
                <Bloom intensity={0.3} luminanceThreshold={0.4} mipmapBlur />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    );
}

export default function HeroScrollScene() {
    return (
        <Canvas
            dpr={[1, 1.25]}
            shadows
            camera={{ position: [0.5, 0.4, 4.8], fov: 40 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            onCreated={({ gl }) => {
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.toneMappingExposure = 1.05;
            }}
            className="pointer-events-none" // ensure clicks pass through to text
        >
            <SoftShadows size={10} samples={10} />
            <Scene />
        </Canvas>
    );
}
