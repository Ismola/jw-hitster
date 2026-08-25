// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
    type PointerEvent as ReactPointerEvent
} from 'react';

interface TextPressureProps {
    text?: string;
    fontFamily?: string;
    fontUrl?: string;
    width?: boolean;
    weight?: boolean;
    italic?: boolean;
    alpha?: boolean;
    flex?: boolean;
    stroke?: boolean;
    scale?: boolean;
    textColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    className?: string;
    minFontSize?: number;
}

const AUTO_ANIMATION_DURATION = 10000;
const AUTO_ANIMATION_PADDING = 0.12;

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
    const safeMaxDist = Math.max(maxDist, 1);
    const val = maxVal - Math.abs((maxVal * distance) / safeMaxDist);
    return Math.max(minVal, val + minVal);
};

const debounce = <Args extends unknown[]>(func: (...args: Args) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const TextPressure: React.FC<TextPressureProps> = ({
    text = 'Compressa',
    fontFamily = 'Roboto Flex',
    fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
    width = true,
    weight = true,
    italic = true,
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    textColor = '#FFFFFF',
    strokeColor = '#FF0000',
    strokeWidth = 2,
    className = '',
    minFontSize = 24
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    /**
     * Importante:
     * true  = animación automática
     * false = usa la posición real del ratón
     */
    const autoAnimateRef = useRef(true);

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);

    const chars = useMemo(() => text.split(''), [text]);

    const centerCursor = useCallback(() => {
        const target = titleRef.current || containerRef.current;
        if (!target) return;

        const rect = target.getBoundingClientRect();

        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        mouseRef.current = center;
        cursorRef.current = center;
    }, []);

    useEffect(() => {
        centerCursor();
    }, [centerCursor]);

    useEffect(() => {
        spansRef.current = spansRef.current.slice(0, chars.length);
    }, [chars.length]);

    const setSize = useCallback(() => {
        if (!containerRef.current || !titleRef.current) return;

        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

        const safeCharsLength = Math.max(chars.length, 1);

        let newFontSize = containerW / (safeCharsLength / 2);
        newFontSize = Math.max(newFontSize, minFontSize);

        setFontSize(newFontSize);
        setScaleY(1);
        setLineHeight(1);

        requestAnimationFrame(() => {
            if (!titleRef.current) return;

            const textRect = titleRef.current.getBoundingClientRect();

            if (scale && textRect.height > 0) {
                const yRatio = containerH / textRect.height;
                setScaleY(yRatio);
                setLineHeight(yRatio);
            }

            centerCursor();
        });
    }, [chars.length, minFontSize, scale, centerCursor]);

    useEffect(() => {
        const debouncedSetSize = debounce(setSize, 100);

        debouncedSetSize();

        window.addEventListener('resize', debouncedSetSize);

        return () => {
            window.removeEventListener('resize', debouncedSetSize);
        };
    }, [setSize]);

    const handlePointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;

        autoAnimateRef.current = false;

        cursorRef.current.x = e.clientX;
        cursorRef.current.y = e.clientY;
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;

        autoAnimateRef.current = false;

        cursorRef.current.x = e.clientX;
        cursorRef.current.y = e.clientY;
    };

    const handlePointerLeave = () => {
        autoAnimateRef.current = true;
    };

    useEffect(() => {
        let rafId: number;

        const animate = () => {
            const title = titleRef.current;

            if (autoAnimateRef.current && title) {
                const rect = title.getBoundingClientRect();

                const progress = (performance.now() % AUTO_ANIMATION_DURATION) / AUTO_ANIMATION_DURATION;

                /**
                 * 0 -> 1 -> 0
                 * Simula que el ratón pasa de izquierda a derecha
                 * y luego de derecha a izquierda.
                 */
                const pingPongProgress = progress < 0.5
                    ? progress * 2
                    : (1 - progress) * 2;
                const minX = rect.left + rect.width * AUTO_ANIMATION_PADDING;
                const maxX = rect.right - rect.width * AUTO_ANIMATION_PADDING;

                cursorRef.current.x = minX + (maxX - minX) * pingPongProgress;
                cursorRef.current.y = rect.top + rect.height / 2;


            }

            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = Math.max(titleRect.width / 2, 1);

                spansRef.current.forEach(span => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();

                    const charCenter = {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
                    const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
                    const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0';
                    const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : '1';

                    const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

                    if (span.style.fontVariationSettings !== newFontVariationSettings) {
                        span.style.fontVariationSettings = newFontVariationSettings;
                    }

                    if (alpha && span.style.opacity !== alphaVal) {
                        span.style.opacity = alphaVal;
                    }
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [width, weight, italic, alpha]);

    const styleElement = useMemo(() => {
        return (
            <style>{`
                @import url('${fontUrl}');

                .stroke span {
                    position: relative;
                    color: ${textColor};
                }

                .stroke span::after {
                    content: attr(data-char);
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: transparent;
                    z-index: -1;
                    -webkit-text-stroke-width: ${strokeWidth}px;
                    -webkit-text-stroke-color: ${strokeColor};
                }
            `}</style>
        );
    }, [fontUrl, textColor, strokeColor, strokeWidth]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-transparent"
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {styleElement}

            <h1
                ref={titleRef}
                className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''
                    } ${stroke ? 'stroke' : ''} uppercase text-center`}
                style={{
                    fontFamily,
                    fontSize,
                    lineHeight,
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0,
                    fontWeight: 100,
                    color: stroke ? undefined : textColor
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={`${char}-${i}`}
                        ref={el => {
                            spansRef.current[i] = el;
                        }}
                        data-char={char}
                        className="inline-block"
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default TextPressure;
