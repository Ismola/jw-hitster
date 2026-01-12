"use client";
import { useEffect, useState } from "react";
import LiquidChrome from "../components/ReactBits/LiquidChrome";

export default function Backgtound() {
    const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    const [isDark, setIsDark] = useState(isDarkMode);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const baseColor: [number, number, number] = isDark
        ? [0.1, 0.1, 0.2]
        : [0.3, 0.3, 0.4];

    return (
        <div className="w-screen h-screen relative ">
            <LiquidChrome
                baseColor={baseColor}
                speed={0.05}
                amplitude={0.4}
                interactive={true}
            />
        </div>
    );
}
