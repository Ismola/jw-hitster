'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
    const hasLocalUpdate = useRef(false);
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!hasLocalUpdate.current) {
                try {
                    const item = window.localStorage.getItem(key);
                    if (item) setStoredValue(JSON.parse(item));
                } catch (error) {
                    console.error('Error reading from localStorage:', error);
                }
            }
            setIsHydrated(true);
        }, 0);

        return () => clearTimeout(timeout);
    }, [key]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        hasLocalUpdate.current = true;
        setStoredValue((current) => {
            const valueToStore = typeof value === 'function'
                ? (value as (stored: T) => T)(current)
                : value;
            try {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
            return valueToStore;
        });
    }, [key]);

    return [storedValue, setValue, isHydrated];
}
