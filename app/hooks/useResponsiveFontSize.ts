import { useState, useEffect } from 'react';

export function useResponsiveFontSize(minSize: number = 60, maxSize: number = 300, minWidth: number = 375, maxWidth: number = 1080) {
    const [fontSize, setFontSize] = useState(minSize);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            // Interpolación lineal entre minSize y maxSize según el ancho de pantalla
            let calculatedSize = minSize;

            if (width >= maxWidth) {
                calculatedSize = maxSize;
            } else if (width >= minWidth) {
                // Escala lineal entre minWidth y maxWidth
                const progress = (width - minWidth) / (maxWidth - minWidth);
                calculatedSize = minSize + (maxSize - minSize) * progress;
            }

            setFontSize(calculatedSize);
        };

        handleResize(); // Llamar una vez al montar
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [minSize, maxSize, minWidth, maxWidth]);

    return fontSize;
}
