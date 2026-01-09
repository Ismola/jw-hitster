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

    const isDark = theme === "dark" || (theme === "system" && systemPrefersDark());

    const handleSystemToggle = () => {
        if (theme === "system") {
            // Si está en system, cambia al tema actual del sistema
            switchTo(systemPrefersDark() ? "dark" : "light");
        } else {
            // Si no está en system, activa el modo system
            switchTo("system");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => switchTo(isDark ? "light" : "dark")}
                disabled={theme === "system"}
                className={`relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-colors ${theme === "system"
                    ? "bg-zinc-200 dark:bg-zinc-700 opacity-50 cursor-not-allowed"
                    : "cursor-pointer bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
                    }`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
                <span
                    className={`absolute left-1 transition-transform duration-300 ${isDark ? "translate-x-6" : "translate-x-0"
                        }`}
                >
                    {isDark ? (
                        <svg
                            className="w-6 h-6 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6 text-slate-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </span>
            </button>
            <button
                onClick={handleSystemToggle}
                className={`cursor-pointer rounded-full p-2 transition-colors ${theme === "system"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                aria-label="Use system theme"
                aria-pressed={theme === "system"}
            >
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}