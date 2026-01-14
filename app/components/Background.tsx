"use client";
import LiquidChrome from "./ReactBits/LiquidChrome";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect, useRef } from "react";

export default function Backgtound() {
    const { isDark } = useTheme();
    const isFirstLoadRef = useRef(true);

    const targetColor: [number, number, number] = isDark
        ? [0.1, 0.1, 0.2]
        : [0.6, 0.6, 0.7];

    const [baseColor, setBaseColor] = useState<[number, number, number]>(isDark
        ? [0, 0, 0]
        : [1, 1, 1]);

    useEffect(() => {
        if (isFirstLoadRef.current) {
            const timeout = setTimeout(() => {
                setBaseColor(targetColor);
                isFirstLoadRef.current = false;
            }, 3000);

            return () => clearTimeout(timeout);
        } else {
            setTimeout(() => {
                setBaseColor(targetColor);
            }, 0);
        }
    }, [isDark]);

    return (
        <div className="w-screen h-[120vh] sm:h-screen absolute top-0 left-0 -z-100">
            <LiquidChrome
                baseColor={baseColor}
                speed={0.3}
                amplitude={0.3}
                interactive={false}
            />
        </div>
    );
}
