"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import clsx from "clsx";

interface VortexProps {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    particleCount?: number;
    rangeY?: number;
    baseHue?: number;
    baseSpeed?: number;
    rangeSpeed?: number;
    baseRadius?: number;
    rangeRadius?: number;
    rangeHue?: number;
    backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number>(0);

    const particleCount = props.particleCount || 700;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = props.rangeY || 100;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = props.baseSpeed ?? 0.0;
    const rangeSpeed = props.rangeSpeed || 1.5;
    const baseRadius = props.baseRadius || 1;
    const rangeRadius = props.rangeRadius || 2;
    const baseHue = props.baseHue || 220;
    const rangeHue = props.rangeHue ?? 100;
    const noiseSteps = 3;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const backgroundColor = props.backgroundColor || "#000000";

    const tickRef = useRef(0);
    const noise3D = useRef(createNoise3D()).current;
    const particlePropsRef = useRef(new Float32Array(particlePropsLength));
    const centerRef = useRef<[number, number]>([0, 0]);

    const TAU = 2 * Math.PI;
    const rand = (n: number) => n * Math.random();
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => {
        const hm = 0.5 * m;
        return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const particleProps = particlePropsRef.current;

        const resize = () => {
            const { innerWidth, innerHeight } = window;
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            centerRef.current[0] = 0.5 * canvas.width;
            centerRef.current[1] = 0.5 * canvas.height;
        };

        const initParticle = (i: number) => {
            const x = rand(canvas.width);
            const y = centerRef.current[1] + randRange(rangeY);
            const vx = 0;
            const vy = 0;
            const life = 0;
            const ttl = baseTTL + rand(rangeTTL);
            const speed = baseSpeed + rand(rangeSpeed);
            const radius = baseRadius + rand(rangeRadius);
            const hue = baseHue + rand(rangeHue);

            particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
        };

        const initParticles = () => {
            tickRef.current = 0;
            particlePropsRef.current = new Float32Array(particlePropsLength);
            for (let i = 0; i < particlePropsLength; i += particlePropCount) {
                initParticle(i);
            }
        };

        const checkBounds = (x: number, y: number) => {
            return x > canvas.width || x < 0 || y > canvas.height || y < 0;
        };

        const drawParticle = (
            x: number,
            y: number,
            x2: number,
            y2: number,
            life: number,
            ttl: number,
            radius: number,
            hue: number
        ) => {
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineWidth = radius;
            ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${fadeInOut(life, ttl)})`;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        };

        const updateParticle = (i: number) => {
            const i2 = 1 + i;
            const i3 = 2 + i;
            const i4 = 3 + i;
            const i5 = 4 + i;
            const i6 = 5 + i;
            const i7 = 6 + i;
            const i8 = 7 + i;
            const i9 = 8 + i;

            const x = particleProps[i];
            const y = particleProps[i2];
            const n = noise3D(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU;
            const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
            const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
            let life = particleProps[i5];
            const ttl = particleProps[i6];
            const speed = particleProps[i7];
            const x2 = x + vx * speed;
            const y2 = y + vy * speed;
            const radius = particleProps[i8];
            const hue = particleProps[i9];

            drawParticle(x, y, x2, y2, life, ttl, radius, hue);

            life++;

            particleProps[i] = x2;
            particleProps[i2] = y2;
            particleProps[i3] = vx;
            particleProps[i4] = vy;
            particleProps[i5] = life;

            if (checkBounds(x2, y2) || life > ttl) {
                initParticle(i);
            }
        };

        const drawParticles = () => {
            for (let i = 0; i < particlePropsLength; i += particlePropCount) {
                updateParticle(i);
            }
        };

        const renderGlow = () => {
            ctx.save();
            ctx.filter = "blur(8px) brightness(200%)";
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(canvas, 0, 0);
            ctx.restore();

            ctx.save();
            ctx.filter = "blur(4px) brightness(200%)";
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(canvas, 0, 0);
            ctx.restore();
        };

        const draw = () => {
            tickRef.current++;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawParticles();
            renderGlow();

            animationFrameId.current = window.requestAnimationFrame(draw);
        };

        resize();
        initParticles();
        draw();

        const handleResize = () => resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.cancelAnimationFrame(animationFrameId.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={clsx("relative h-full w-full", props.containerClassName)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                ref={containerRef}
                className="absolute h-full w-full inset-0 z-0 bg-transparent"
            >
                <canvas ref={canvasRef} />
            </motion.div>

            <div className={clsx("relative z-10", props.className)}>{props.children}</div>
        </div>
    );
};
