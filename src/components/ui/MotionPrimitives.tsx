"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 42, rotateX: 7, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: reduceMotion ? 0.25 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
            style={{ transformPerspective: 1000, transformOrigin: "center top" }}
        >
            {children}
        </motion.div>
    );
}
