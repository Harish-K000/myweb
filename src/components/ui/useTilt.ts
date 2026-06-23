"use client";

import * as React from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Cursor-driven 3D tilt: rotateX/rotateY follow the pointer position within
 * the element, plus a radial glare that tracks the same point. Disabled for
 * touch input (no hover) and prefers-reduced-motion.
 */
export function useTilt() {
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
        (values: number[]) => `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(56,189,248,0.18), transparent 60%)`
    );

    const handlers = {
        onMouseMove: (e: React.MouseEvent) => {
            if (!enabled || !ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            ry.set((px - 0.5) * 10);
            rx.set((0.5 - py) * 10);
            glareX.set(px * 100);
            glareY.set(py * 100);
        },
        onMouseEnter: () => {
            if (!enabled) return;
            lift.set(-8);
            glareOpacity.set(1);
        },
        onMouseLeave: () => {
            rx.set(0);
            ry.set(0);
            lift.set(0);
            glareOpacity.set(0);
        },
    };

    const style = { rotateX: srx, rotateY: sry, y: slift, transformPerspective: 800 };

    return { ref, handlers, style, glareBackground, glareOpacity: sGlareOpacity };
}
