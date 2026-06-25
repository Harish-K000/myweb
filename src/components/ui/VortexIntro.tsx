"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { Vortex } from "./vortex";

export default function VortexIntro() {
    return (
        <section id="rift" className="relative w-full h-[34rem] md:h-[38rem] overflow-hidden">
            <Vortex
                backgroundColor="#000000"
                baseHue={12}
                rangeHue={38}
                particleCount={500}
                className="flex items-center flex-col justify-center px-6 w-full"
            >
                <p className="eyebrow-rune mb-5" style={{ color: "#e8b96a" }}>
                    Beyond the Gate
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-center max-w-3xl leading-tight text-[#f8f1e3]">
                    Every system starts as chaos —
                    <br className="hidden md:block" /> the craft is in the taming of it.
                </h2>
                <p className="text-base md:text-lg max-w-xl mt-6 text-center text-[#b8aa94]">
                    From tangled requirements to shipped products, I bring order to the rift —
                    one well-built system at a time.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                    <a
                        href="#quests"
                        className="wobble-hover inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.1em] font-semibold px-7 py-3 rounded-md transition-colors"
                        style={{ background: "#d6a84f", color: "#1f1710" }}
                    >
                        View Projects <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                        href="#portal"
                        className="wobble-hover inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.1em] border px-7 py-3 rounded-md transition-colors"
                        style={{ borderColor: "rgba(214,168,79,0.35)", color: "#f8f1e3" }}
                    >
                        <Mail className="w-4 h-4" /> Open the Portal
                    </a>
                </div>
            </Vortex>
        </section>
    );
}
