"use client";
import LiquidChrome from "./ReactBits/LiquidChrome";
import { useTheme } from "./ThemeProvider";

export default function Backgtound() {
    const { isDark } = useTheme();

    const baseColor: [number, number, number] = isDark
        ? [0.1, 0.1, 0.2]
        : [0.6, 0.6, 0.7];

    return (
        <div className="w-screen h-screen relative ">
            <LiquidChrome
                baseColor={baseColor}
                speed={0.05}
                amplitude={0.3}
                interactive={true}
            />
        </div>
    );
}
