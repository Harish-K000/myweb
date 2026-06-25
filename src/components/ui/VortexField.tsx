"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { SHAPE_GENERATORS, type ShapeKey } from "./vortexShapes";

const SECTION_SHAPES: { id: string; shape: ShapeKey }[] = [
    { id: "hero-section", shape: "castle" },
    { id: "rift", shape: "chaos" },
    { id: "forge", shape: "anvil" },
    { id: "path", shape: "road" },
    { id: "grimoire", shape: "book" },
];

const PARTICLE_COUNT = 220;

type Particle = {
    x: number;
    y: number;
    tx: number;
    ty: number;
    hue: number;
};

export default function VortexField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resize();

        const noise3D = createNoise3D();

        const SHAPE_BOX: Record<ShapeKey, () => { x: number; y: number; w: number; h: number }> = {
            chaos: () => ({ x: 0, y: 0, w: width, h: height }),
            castle: () => ({ x: width * 0.48, y: height * 0.08, w: width * 0.46, h: height * 0.58 }),
            anvil: () => ({ x: width * 0.28, y: height * 0.42, w: width * 0.44, h: height * 0.42 }),
            road: () => ({ x: width * 0.08, y: height * 0.28, w: width * 0.84, h: height * 0.5 }),
            book: () => ({ x: width * 0.3, y: height * 0.08, w: width * 0.4, h: height * 0.38 }),
        };

        const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            tx: Math.random(),
            ty: Math.random(),
            hue: 12 + Math.random() * 38,
        }));

        let currentShape: ShapeKey = "chaos";

        const retarget = (shape: ShapeKey) => {
            const points = SHAPE_GENERATORS[shape](particles.length);
            particles.forEach((particle, i) => {
                const point = points[i] ?? { x: Math.random(), y: Math.random() };
                particle.tx = point.x;
                particle.ty = point.y;
            });
        };
        retarget(currentShape);

        let scrollTicking = false;
        const updateActiveShape = () => {
            scrollTicking = false;
            const viewportCenter = window.scrollY + height * 0.5;
            let active: ShapeKey = "chaos";
            for (const { id, shape } of SECTION_SHAPES) {
                const el = document.getElementById(id);
                if (!el) continue;
                const top = el.getBoundingClientRect().top + window.scrollY;
                const bottom = top + el.offsetHeight;
                if (viewportCenter >= top && viewportCenter <= bottom) {
                    active = shape;
                    break;
                }
            }
            if (active !== currentShape) {
                currentShape = active;
                retarget(active);
            }
        };
        updateActiveShape();

        const onScroll = () => {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(updateActiveShape);
        };
        const onResize = () => {
            resize();
            updateActiveShape();
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        let raf = 0;
        let tick = 0;

        const draw = () => {
            tick++;
            ctx.clearRect(0, 0, width, height);
            const box = SHAPE_BOX[currentShape]();
            const isChaos = currentShape === "chaos";
            const pullStrength = isChaos ? 0.012 : 0.07;
            const jitterScale = isChaos ? 1.5 : 0.22;

            for (const particle of particles) {
                const targetX = box.x + particle.tx * box.w;
                const targetY = box.y + particle.ty * box.h;

                const n = noise3D(particle.x * 0.002, particle.y * 0.002, tick * 0.0012) * Math.PI * 2;
                const jitterX = Math.cos(n) * jitterScale;
                const jitterY = Math.sin(n) * jitterScale;

                const prevX = particle.x;
                const prevY = particle.y;
                particle.x += (targetX - particle.x) * pullStrength + jitterX;
                particle.y += (targetY - particle.y) * pullStrength + jitterY;

                ctx.beginPath();
                ctx.strokeStyle = `hsla(${particle.hue}, 95%, 68%, 0.85)`;
                ctx.lineWidth = isChaos ? 1.6 : 2.4;
                ctx.lineCap = "round";
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(particle.x, particle.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = `hsla(${particle.hue}, 95%, 75%, 0.9)`;
                ctx.arc(particle.x, particle.y, isChaos ? 1.1 : 1.6, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.save();
            ctx.filter = "blur(4px) brightness(220%)";
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(canvas, 0, 0);
            ctx.restore();

            raf = window.requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            window.cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[15]"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
