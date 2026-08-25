'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface Preferences {
    animationsEnabled: boolean;
    backgroundEnabled: boolean;
}

interface PreferencesContextValue extends Preferences {
    setAnimationsEnabled: (enabled: boolean) => void;
    setBackgroundEnabled: (enabled: boolean) => void;
}

const STORAGE_KEY = 'jw-hitster-preferences';
const defaultPreferences: Preferences = {
    animationsEnabled: true,
    backgroundEnabled: true,
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState(defaultPreferences);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = { ...defaultPreferences, ...JSON.parse(stored) };
                timeout = setTimeout(() => setPreferences(parsed), 0);
            }
        } catch {
            // Keep defaults when browser storage is unavailable or invalid.
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('animations-disabled', !preferences.animationsEnabled);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        } catch {
            // The preference remains active for this session.
        }
    }, [preferences]);

    const value = useMemo<PreferencesContextValue>(() => ({
        ...preferences,
        setAnimationsEnabled: (animationsEnabled) => setPreferences((current) => ({ ...current, animationsEnabled })),
        setBackgroundEnabled: (backgroundEnabled) => setPreferences((current) => ({ ...current, backgroundEnabled })),
    }), [preferences]);

    return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
    return context;
}
