import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // The Developer Kingdom palette — used for the 3-way accent
                // cycles across project/experience cards (replaces cyan/violet/emerald).
                gold: {
                    400: "#e8c97a",
                    500: "#d6a84f",
                    600: "#b8872f",
                },
                ember: {
                    400: "#ff8c5a",
                    500: "#ff6a2a",
                    600: "#e0551c",
                },
                rune: {
                    400: "#7dd3fc",
                    500: "#60a5fa",
                    600: "#3b82f6",
                },
            },
        },
    },
    plugins: [],
};
export default config;
