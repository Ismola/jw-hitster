'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(() => {
        // Check initial theme from localStorage or system preference
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('theme');
                if (stored === 'dark') return true;
                if (stored === 'light') return false;
                // Default to system preference
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            } catch {
                return false;
            }
        }
        return false;
    });

    useEffect(() => {
        // Check theme from DOM class
        const checkTheme = () => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        };

        checkTheme();

        // Observer for theme changes
        const observer = new MutationObserver(checkTheme);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
