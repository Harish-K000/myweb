"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Piece = {
    key: string;
    left: number;
    top: number;
    width: number;
    height: number;
    from: { x: number; y: number; z: number; rotate: number; rotateX: number; rotateY: number };
    range: [number, number];
};

// Center piece + 4 corners — a deliberate partial partition, not a seamless
// 9-cell grid. The gaps between pieces show the dim full image underneath,
// so the effect reads as "sharp fragments settling over a hazy memory"
// rather than a jigsaw that must tile pixel-perfectly.
const PIECES: Piece[] = [
    { key: "center", left: 30, top: 30, width: 40, height: 40, from: { x: 0, y: -50, z: 130, rotate: -3, rotateX: 8, rotateY: 0 }, range: [0, 0.35] },
    { key: "tl", left: 0, top: 0, width: 30, height: 30, from: { x: -70, y: -70, z: -80, rotate: -14, rotateX: 9, rotateY: -12 }, range: [0.05, 0.45] },
    { key: "tr", left: 70, top: 0, width: 30, height: 30, from: { x: 70, y: -70, z: 70, rotate: 14, rotateX: 8, rotateY: 12 }, range: [0.1, 0.5] },
    { key: "bl", left: 0, top: 70, width: 30, height: 30, from: { x: -70, y: 70, z: 55, rotate: 14, rotateX: -9, rotateY: -10 }, range: [0.15, 0.55] },
    { key: "br", left: 70, top: 70, width: 30, height: 30, from: { x: 70, y: 70, z: -65, rotate: -14, rotateX: -8, rotateY: 10 }, range: [0.2, 0.6] },
];

function PieceLayer({
    src,
    alt,
    piece,
    progress,
    reduceMotion,
}: {
    src: string;
    alt: string;
    piece: Piece;
    progress: MotionValue<number>;
    reduceMotion: boolean;
}) {
    const x = useTransform(progress, piece.range, reduceMotion ? [0, 0] : [piece.from.x, 0]);
    const y = useTransform(progress, piece.range, reduceMotion ? [0, 0] : [piece.from.y, 0]);
    const z = useTransform(progress, piece.range, reduceMotion ? [0, 0] : [piece.from.z, 0]);
    const rotate = useTransform(progress, piece.range, reduceMotion ? [0, 0] : [piece.from.rotate, 0]);
    const rotateX = useTransform(progress, piece.range, reduceMotion ? [0, 0] : [piece.from.rotateX, 0]);
    const rotateY = useTransform(progress, piece.range, reduceMotion ? [0, 0] : [piece.from.rotateY, 0]);
    const opacity = useTransform(progress, piece.range, reduceMotion ? [1, 1] : [0, 1]);

    return (
        <motion.div
            className="absolute overflow-hidden rounded-md"
            style={{
                left: `${piece.left}%`,
                top: `${piece.top}%`,
                width: `${piece.width}%`,
                height: `${piece.height}%`,
                x,
                y,
                z,
                rotate,
                rotateX,
                rotateY,
                opacity,
                transformPerspective: 1100,
                transformStyle: "preserve-3d",
                boxShadow: "0 18px 40px -12px rgba(0,0,0,0.6)",
            }}
            aria-hidden="true"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                style={{
                    position: "absolute",
                    left: `${-(piece.left / piece.width) * 100}%`,
                    top: `${-(piece.top / piece.height) * 100}%`,
                    width: `${(100 / piece.width) * 100}%`,
                    height: `${(100 / piece.height) * 100}%`,
                    objectFit: "cover",
                }}
            />
        </motion.div>
    );
}

/**
 * Splits one illustration into a center piece + 4 corner pieces that fly
 * into their exact, pixel-aligned position as the section scrolls into
 * view — no scaling/zoom of the source image, ever. A dim, static copy of
 * the full image sits underneath so the gaps between pieces still read as
 * "this scene", not empty space.
 */
export default function SceneAssembly({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduceMotion = Boolean(useReducedMotion());
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] });
    const backgroundY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, -18]);
    const backgroundScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.05, 1]);

    return (
        <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`} style={{ perspective: 1100 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
                src={src}
                alt=""
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.28,
                    y: backgroundY,
                    scale: backgroundScale,
                }}
            />

            <div
                className="absolute glow-pulse"
                style={{
                    left: "50%",
                    top: "50%",
                    width: 460,
                    height: 460,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(circle, rgba(214,168,79,0.2), transparent 70%)",
                    filter: "blur(20px)",
                }}
                aria-hidden="true"
            />

            {PIECES.map((piece) => (
                <PieceLayer
                    key={piece.key}
                    src={src}
                    alt={alt}
                    piece={piece}
                    progress={scrollYProgress}
                    reduceMotion={reduceMotion}
                />
            ))}

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(8,6,5,0.15) 0%, rgba(8,6,5,0.85) 100%), linear-gradient(to bottom, rgba(8,6,5,1) 0%, rgba(8,6,5,0) 18%, rgba(8,6,5,0) 82%, rgba(8,6,5,1) 100%)",
                }}
            />
        </div>
    );
}
