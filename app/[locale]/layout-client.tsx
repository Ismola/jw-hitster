'use client';

import { useState, useEffect } from 'react';
import Counter from '../components/Counter';
import Background from '../components/Background';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { BlurTextProvider } from './BlurTextContext';
import { SuccessProvider } from './SuccessContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { messages } from '@/config/text';

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
    const [mounted, setMounted] = useState(false);
    const [cookieConsent, setCookieConsent] = useLocalStorage('cookieConsent', '');
    const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

    const t = messages[(locale as keyof typeof messages)] || messages.en;

    useEffect(() => {
        if (!showCounter) {
            const timer = setTimeout(() => {
                setShowBlurText(true);
            }, 3000); // 3 segundos
            return () => clearTimeout(timer);
        }
    }, [showCounter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);
    }, []);

    const handleAcceptCookies = () => {
        setCookieConsent('accepted');
        setIsCookieModalOpen(false);
    };
    const handleOpenCookieModal = () => setIsCookieModalOpen(true);
    const handleCloseCookieModal = () => setIsCookieModalOpen(false);

    const handleCounterEnd = () => {
        setFadeOut(true);
        setTimeout(() => setShowCounter(false), 500);
    };

    return (
        <ThemeProvider>
            <SuccessProvider>
                <Background />
                <BlurTextProvider showBlurText={showBlurText}>
                    <main className="relative  top-0 h-screen overflow-auto ">

                        {children}

                    </main>
                    {mounted && cookieConsent !== 'accepted' && (
                        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-110 w-full md:w-auto">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-lg shadow-lg bg-(--text-light)/95 dark:bg-(--text-dark)/95 text-(--text-dark) dark:text-(--text-light)">
                                <div className="text-sm">{t.cookies?.banner}</div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleAcceptCookies}
                                        className="cursor-pointer px-3 py-1 rounded bg-(--text-dark) dark:bg-(--text-light) text-(--text-light) dark:text-(--text-dark)"
                                    >
                                        {t.cookies?.accept}
                                    </button>
                                    <button
                                        onClick={handleOpenCookieModal}
                                        className="cursor-pointer px-3 py-1 rounded border border-(--text-dark)/20 dark:border-(--text-light)/20"
                                    >
                                        {t.cookies?.learnMore}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {mounted && isCookieModalOpen && (
                        <div
                            className="fixed inset-0 z-120 flex items-center justify-center p-4 backdrop-blur-xl bg-(--text-light)/10 dark:bg-(--text-dark)/10"
                            onClick={handleCloseCookieModal}
                        >
                            <div
                                className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-(--text-dark) dark:bg-(--text-light) text-(--text-light) dark:text-(--text-dark) rounded-2xl shadow-2xl p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleCloseCookieModal}
                                    className="cursor-pointer absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="space-y-4">
                                    <h3 className="text-2xl font-semibold">{t.cookies?.title}</h3>
                                    <p className="text-sm opacity-90">{t.cookies?.text}</p>
                                    <h4 className="text-lg font-semibold pt-2">{t.legal?.title}</h4>
                                    <p className="text-sm opacity-90">{t.legal?.text}</p>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={handleAcceptCookies}
                                            className="cursor-pointer px-4 py-2 rounded bg-(--text-light) dark:bg-(--text-dark) text-(--text-dark) dark:text-(--text-light)"
                                        >
                                            {t.cookies?.accept}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </BlurTextProvider>
                <Counter show={showCounter} fadeOut={fadeOut} onEnd={handleCounterEnd} />
            </SuccessProvider>
        </ThemeProvider>
    );
}
