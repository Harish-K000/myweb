"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A small ink-blot mascot that trails the cursor with spring physics and
 * "blinks" when idle — a lightweight anime-sticker touch that makes the
 * page feel alive without needing a full character rig.
 */
export default function CursorMascot() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const springX = useSpring(x, { damping: 18, stiffness: 180, mass: 0.4 });
    const springY = useSpring(y, { damping: 18, stiffness: 180, mass: 0.4 });
    const [visible, setVisible] = React.useState(false);
    const [blink, setBlink] = React.useState(false);

    React.useEffect(() => {
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        if (isTouch) return;

        const onMove = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
            if (!visible) setVisible(true);
        };
        window.addEventListener("mousemove", onMove);

        const blinkInterval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 140);
        }, 3200);

        return () => {
            window.removeEventListener("mousemove", onMove);
            clearInterval(blinkInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!visible) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block"
            style={{ x: springX, y: springY, translateX: "16px", translateY: "16px" }}
        >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="11" fill="#0a0a0a" stroke="#f7f7f5" strokeWidth="1.5" />
                <ellipse cx="9" cy="12" rx="1.6" ry={blink ? 0.3 : 1.6} fill="#f7f7f5" />
                <ellipse cx="17" cy="12" rx="1.6" ry={blink ? 0.3 : 1.6} fill="#f7f7f5" />
                <path d="M9 17c1.2 1 3.8 1 5.6 0" stroke="#ff3b30" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        </motion.div>
    );
}
