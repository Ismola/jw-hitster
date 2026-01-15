"use client";
import LiquidChrome from "./ReactBits/LiquidChrome";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSuccess } from "../[locale]/SuccessContext";

export default function Backgtound() {
    const { isDark } = useTheme();
    const { isSuccess, isError } = useSuccess();
    const isFirstLoadRef = useRef(true);
    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const targetColor: [number, number, number] = useMemo(() =>
        isDark ? [0.1, 0.1, 0.2] : [0.6, 0.6, 0.7],
        [isDark]
    );

    const successColor: [number, number, number] = useMemo(() =>
        isDark ? [0.1, 0.3, 0.1] : [0.4, 0.7, 0.4],
        [isDark]
    );

    const errorColor: [number, number, number] = useMemo(() =>
        isDark ? [0.3, 0.1, 0.1] : [0.7, 0.3, 0.3],
        [isDark]
    );

    const [baseColor, setBaseColor] = useState<[number, number, number]>(isDark
        ? [0, 0, 0]
        : [1, 1, 1]);

    // Efecto para el color del tema
    useEffect(() => {
        if (isFirstLoadRef.current) {
            const timeout = setTimeout(() => {
                setBaseColor(targetColor);
                isFirstLoadRef.current = false;
            }, 3000);

            return () => clearTimeout(timeout);
        } else {
            // Limpiar timeout existente si hay uno
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
                resetTimeoutRef.current = null;
            }
            setTimeout(() => {
                setBaseColor(targetColor);
            }, 0);
        }
    }, [isDark, targetColor]);

    // Efecto para el cambio a verde cuando hay éxito
    useEffect(() => {
        if (isSuccess) {
            // Limpiar cualquier timeout anterior
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }

            // Cambiar a verde inmediatamente
            setTimeout(() => {
                setBaseColor(successColor);
            }, 0);

            // Esperar 5 segundos antes de volver al color original
            resetTimeoutRef.current = setTimeout(() => {
                setBaseColor(targetColor);
                resetTimeoutRef.current = null;
            }, 5000);
        }
    }, [isSuccess, successColor, targetColor]);

    // Efecto para el cambio a rojo cuando hay error
    useEffect(() => {
        if (isError) {
            // Limpiar cualquier timeout anterior
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }

            // Cambiar a rojo inmediatamente
            setTimeout(() => {
                setBaseColor(errorColor);
            }, 0);

            // Esperar 5 segundos antes de volver al color original
            resetTimeoutRef.current = setTimeout(() => {
                setBaseColor(targetColor);
                resetTimeoutRef.current = null;
            }, 5000);
        }
    }, [isError, errorColor, targetColor]);

    return (
        <div className="w-screen  top-0 h-[120vh] md:h-screen absolute  left-0 -z-100">
            <LiquidChrome
                baseColor={baseColor}
                speed={0.3}
                amplitude={0.3}
                interactive={false}
            />
        </div>
    );
}
