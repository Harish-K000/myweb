"use client";

import { Readex_Pro } from "next/font/google";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const readexPro = Readex_Pro({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const VIDEO_SRC =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4";

const NAV_LINKS = ["platform", "solutions", "company", "support"];

function SecurifyLogo() {
    return (
        <svg viewBox="0 0 256 256" className="h-5 w-5" aria-hidden="true">
            <path
                fill="#ffffff"
                d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
            />
        </svg>
    );
}

export default function SecurifyHero() {
    const reduceMotion = useReducedMotion();

    const fadeDown: Variants = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : -20 },
        show: { opacity: 1, y: 0 },
    };

    const word = (delay: number): Variants => ({
        hidden: { opacity: 0, y: reduceMotion ? 0 : 36 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        },
    });

    const fadeUp = (delay: number): Variants => ({
        hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        },
    });

    return (
        <section className={`${readexPro.className} relative h-screen w-full overflow-hidden bg-black`}>
            <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                src={VIDEO_SRC}
            />

            {/* Navbar */}
            <motion.nav
                initial="hidden"
                animate="show"
                variants={fadeDown}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-6 md:px-10 pt-6"
            >
                <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3">
                    <SecurifyLogo />
                    <span className="text-white text-sm font-normal tracking-tight">securify</span>
                </div>

                <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link}
                            href={`#${link}`}
                            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                <button
                    type="button"
                    className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors"
                >
                    get started
                </button>
            </motion.nav>

            {/* Foreground content */}
            <div className="relative h-full w-full">
                <motion.h1
                    initial="hidden"
                    animate="show"
                    variants={word(0.15)}
                    className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%] tracking-[-0.04em] leading-[0.95]"
                >
                    protect
                </motion.h1>

                <motion.h1
                    initial="hidden"
                    animate="show"
                    variants={word(0.35)}
                    className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%] tracking-[-0.04em] leading-[0.95]"
                >
                    your
                </motion.h1>

                <motion.h1
                    initial="hidden"
                    animate="show"
                    variants={word(0.55)}
                    className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%] tracking-[-0.04em] leading-[0.95]"
                >
                    data
                </motion.h1>

                <motion.p
                    initial="hidden"
                    animate="show"
                    variants={fadeUp(0.8)}
                    className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90"
                >
                    we can guarding your data with utmost care, empowering you with privacy everywhere
                </motion.p>

                {/* Stat: top-right */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp(0.9)}
                    className="absolute right-6 md:right-24 top-[14%]"
                >
                    <div className="flex items-center gap-3 justify-end">
                        <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
                        <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+65k</span>
                    </div>
                    <p className="text-xs md:text-sm text-white/70 mt-1 text-right">startups use</p>
                </motion.div>

                {/* Stat: bottom-left */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp(1.0)}
                    className="absolute left-6 md:left-20 bottom-20 md:bottom-24"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+1.5b</span>
                        <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
                    </div>
                    <p className="text-xs md:text-sm text-white/70 mt-1">gb data was protected</p>
                </motion.div>

                {/* Stat: bottom-right */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp(1.1)}
                    className="absolute right-6 md:right-20 bottom-16 md:bottom-20"
                >
                    <div className="flex items-center gap-3 justify-end">
                        <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
                        <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+300k</span>
                    </div>
                    <p className="text-xs md:text-sm text-white/70 mt-1 text-right">downloads</p>
                </motion.div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />
            </div>
        </section>
    );
}
