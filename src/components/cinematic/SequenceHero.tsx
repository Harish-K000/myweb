"use client";

import * as React from "react";

const FRAME_COUNT = 40;
const framePath = (i: number) => `/images/sequence/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

/**
 * Scrubs a pre-rendered 40-frame story sequence (silhouette walking into a
 * glowing orb of code) in lockstep with scroll position over #hero-section,
 * the way Apple/anime "OP" title sequences tie animation frames to input.
 */
export default function SequenceHero() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const imagesRef = React.useRef<HTMLImageElement[]>([]);
    const frameRef = React.useRef(0);
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        let loaded = 0;
        const imgs: HTMLImageElement[] = [];
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = framePath(i);
            img.onload = () => {
                loaded += 1;
                if (loaded === FRAME_COUNT) setReady(true);
            };
            imgs.push(img);
        }
        imagesRef.current = imgs;
    }, []);

    const draw = React.useCallback((index: number) => {
        const canvas = canvasRef.current;
        const img = imagesRef.current[index];
        if (!canvas || !img || !img.complete) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Cover-fit the frame into the canvas viewport.
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const boxRatio = w / h;
        let drawW = w;
        let drawH = h;
        if (imgRatio > boxRatio) {
            drawH = h;
            drawW = h * imgRatio;
        } else {
            drawW = w;
            drawH = w / imgRatio;
        }
        const dx = (w - drawW) / 2;
        const dy = (h - drawH) / 2;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, dx, dy, drawW, drawH);
    }, []);

    React.useEffect(() => {
        if (!ready) return;
        draw(0);

        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const hero = document.getElementById("hero-section");
                if (!hero) return;
                const rect = hero.getBoundingClientRect();
                const total = rect.height - window.innerHeight;
                const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
                const index = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
                if (index !== frameRef.current) {
                    frameRef.current = index;
                    draw(index);
                }
            });
        };

        const onResize = () => draw(frameRef.current);

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [ready, draw]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
        />
    );
}
