'use client';

import { useState, useEffect } from 'react';
import Counter from '../components/Counter';
import Background from '../components/Background';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { BlurTextProvider } from './BlurTextContext';

export function LayoutClient({
    children,
    locale,
}: Readonly<{
    children: React.ReactNode;
    locale: string;
}>) {
    const [showCounter, setShowCounter] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [showBlurText, setShowBlurText] = useState(false);

    useEffect(() => {
        if (!showCounter) {
            const timer = setTimeout(() => {
                setShowBlurText(true);
            }, 3000); // 3 segundos
            return () => clearTimeout(timer);
        }
    }, [showCounter]);

    const handleCounterEnd = () => {
        setFadeOut(true);
        setTimeout(() => setShowCounter(false), 500);
    };

    return (
        <ThemeProvider>
            <Background />
            <BlurTextProvider showBlurText={showBlurText}>
                <main className="relative w-full top-0 h-[120vh] md:h-screen overflow-hidden">
                    {children}
                </main>
            </BlurTextProvider>
            <Counter show={showCounter} fadeOut={fadeOut} onEnd={handleCounterEnd} />
        </ThemeProvider>
    );
}
