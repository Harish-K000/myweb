"use client";

import * as React from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Pointer-driven 3D tilt: rotateX/rotateY follow the pointer position within
 * the element, plus a radial glare that tracks the same point. Disabled for
 * touch input (no hover) and prefers-reduced-motion.
 */
export function useTilt(intensity = 10) {
    const ref = React.useRef<HTMLElement>(null);
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        setEnabled(!reduced && !coarse);
    }, []);

    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const lift = useMotionValue(0);
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);
    const glareOpacity = useMotionValue(0);

    const spring = { stiffness: 220, damping: 22, mass: 0.5 };
    const srx = useSpring(rx, spring);
    const sry = useSpring(ry, spring);
    const slift = useSpring(lift, spring);
    const sGlareOpacity = useSpring(glareOpacity, { stiffness: 220, damping: 26 });

    const glareBackground = useTransform(
        [glareX, glareY],
        (values: number[]) => `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(214,168,79,0.2), transparent 60%)`
    );

    const handlers = {
        onPointerMove: (event: React.PointerEvent) => {
            if (!enabled || !ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            ry.set((px - 0.5) * intensity);
            rx.set((0.5 - py) * intensity);
            glareX.set(px * 100);
            glareY.set(py * 100);
        },
        onPointerEnter: () => {
            if (!enabled) return;
            lift.set(-8);
            glareOpacity.set(1);
        },
        onPointerLeave: () => {
            rx.set(0);
            ry.set(0);
            lift.set(0);
            glareOpacity.set(0);
        },
    };

    const style = {
        rotateX: srx,
        rotateY: sry,
        y: slift,
        transformPerspective: 900,
        transformStyle: "preserve-3d" as const,
        willChange: "transform",
    };

    return { ref, handlers, style, glareBackground, glareOpacity: sGlareOpacity };
}
