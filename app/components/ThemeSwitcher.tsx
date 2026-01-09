"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function systemPrefersDark(): boolean {
    return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    const isDark = theme === "dark" || (theme === "system" && systemPrefersDark());
    root.classList.toggle("dark", isDark);
}

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            if (typeof window === "undefined") return "system";
            const stored = localStorage.getItem("theme") as Theme | null;
            return stored ?? "system";
        } catch {
            return "system";
        }
    });

    // Sync DOM class with selected theme; listen to system changes when in 'system'
    useEffect(() => {
        applyTheme(theme);

        if (theme !== "system") return;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (_e?: MediaQueryListEvent) => applyTheme("system");

        if ("addEventListener" in mql) {
            mql.addEventListener("change", handler);
        } else {
            const legacy = mql as MediaQueryList & {
                addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
                removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
            };
            legacy.addListener?.(handler);
        }

        return () => {
            if ("removeEventListener" in mql) {
                mql.removeEventListener("change", handler);
            } else {
                const legacy = mql as MediaQueryList & {
                    addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
                    removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
                };
                legacy.removeListener?.(handler);
            }
        };
    }, [theme]);

    const switchTo = (next: Theme) => {
        setTheme(next);
        applyTheme(next);
        try {
            localStorage.setItem("theme", next);
        } catch {
            // ignore storage errors
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => switchTo("light")}
                className={`px-3 py-1 rounded transition ${theme === "light"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "cursor-pointer bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                aria-pressed={theme === "light"}
            >
                Light
            </button>
            <button
                onClick={() => switchTo("dark")}
                className={`px-3 py-1 rounded transition ${theme === "dark"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "cursor-pointer bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                aria-pressed={theme === "dark"}
            >
                Dark
            </button>
            <button
                onClick={() => switchTo("system")}
                className={`px-3 py-1 rounded transition ${theme === "system"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "cursor-pointer bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                aria-pressed={theme === "system"}
            >
                System
            </button>
        </div>
    );
}