"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

function getPreferredTheme() {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<ThemeMode>("dark");

    const applyTheme = useCallback((nextTheme: ThemeMode) => {
        if (typeof document === "undefined") return;
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.style.colorScheme = nextTheme;
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        setTheme(nextTheme);
    }, []);

    useEffect(() => {
        applyTheme(getPreferredTheme());
    }, [applyTheme]);

    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            onClick={() => applyTheme(nextTheme)}
            className="flex items-center gap-2 border border-subtle px-3 py-2 rounded-full text-sm text-muted hover:text-[var(--color-brand-text)] transition-colors"
            aria-label={`Switch to ${nextTheme} mode`}
        >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{theme === "dark" ? "Day" : "Night"}</span>
        </button>
    );
}
