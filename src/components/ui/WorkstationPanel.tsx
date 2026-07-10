"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

interface WorkstationPanelProps {
    className?: string;
    delay?: number;
    /** 0→1 scroll progress through the hero — drives which boot-sequence frame is shown, Apple-product-page style. */
    scrollProgress: MotionValue<number>;
}

const FRAME_COUNT = 11;
const FRAME_SRCS = Array.from(
    { length: FRAME_COUNT },
    (_, i) => `/images/workstation-sequence/frame-${String(i + 1).padStart(2, "0")}.webp`
);

// Draws `img` into the canvas using CSS object-fit:cover math, optionally
// blended over whatever is already on the canvas via globalAlpha — this is
// what makes scrubbing between just 11 sparse frames read as continuous
// motion instead of a slideshow.
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, alpha: number) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (imgRatio > boxRatio) {
        sw = img.naturalHeight * boxRatio;
        sx = (img.naturalWidth - sw) / 2;
    } else {
        sh = img.naturalWidth / boxRatio;
        sy = (img.naturalHeight - sh) / 2;
    }
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    ctx.globalAlpha = 1;
}

export default function WorkstationPanel({ className = "", delay = 0, scrollProgress }: WorkstationPanelProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [booted, setBooted] = useState(false);
    const [framesReady, setFramesReady] = useState(false);
    const reduceMotion = useReducedMotion();

    const frameValue = useTransform(scrollProgress, [0, 0.85], [0, FRAME_COUNT - 1]);

    const handlePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(() => {});
    };

    const handleOpenEnded = () => setBooted(true);

    const drawFrame = (value: number) => {
        const canvas = canvasRef.current;
        const images = imagesRef.current;
        if (!canvas || images.length < FRAME_COUNT) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const clamped = Math.min(Math.max(value, 0), FRAME_COUNT - 1);
        const floor = Math.floor(clamped);
        const frac = clamped - floor;
        const { width, height } = canvas;
        drawCover(ctx, images[floor], width, height, 1);
        if (frac > 0.001 && floor + 1 < FRAME_COUNT) {
            drawCover(ctx, images[floor + 1], width, height, frac);
        }
    };

    useMotionValueEvent(frameValue, "change", (latest) => drawFrame(latest));

    // Preload every frame once so scrubbing never hits a blank/loading image.
    useEffect(() => {
        let loaded = 0;
        const images = FRAME_SRCS.map((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loaded += 1;
                if (loaded === FRAME_COUNT) setFramesReady(true);
            };
            return img;
        });
        imagesRef.current = images;
    }, []);

    // Size the canvas to its box (with DPR) and keep it in sync on resize.
    useEffect(() => {
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrapper || !canvas) return;

        const resize = () => {
            const rect = wrapper.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            drawFrame(frameValue.get());
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(wrapper);
        return () => observer.disconnect();
        // frameValue is a stable MotionValue identity; no need to re-run on change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [framesReady]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.3 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={handlePlay}
            className={`portal-frame ${className}`}
            style={{
                boxShadow: "-10px -10px 28px var(--neu-shadow-light), 12px 12px 32px var(--neu-shadow-dark)",
            }}
        >
            <div className="portal-frame-bar">
                <span className="seal-dot" style={{ background: "var(--color-brand-accent)" }} />
                <span className="seal-dot" style={{ background: "var(--color-brand-primary)", opacity: 0.7 }} />
                <span className="seal-dot" style={{ background: "var(--color-cat-frontend)", opacity: 0.6 }} />
                <span className="text-xs text-muted ml-2 font-display uppercase tracking-[0.1em]">
                    workstation.boot
                </span>
            </div>
            <div ref={wrapperRef} className="relative aspect-square bg-black">
                <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                    style={{ opacity: booted ? 0 : 1 }}
                    src="/videos/laptop_openclose.mp4"
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleOpenEnded}
                />
                <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full transition-opacity duration-700"
                    style={{ opacity: booted && framesReady ? 1 : 0 }}
                />
            </div>
        </motion.div>
    );
}
