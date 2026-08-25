import React, { useEffect, useId } from 'react';
import { motion, useAnimation, useMotionValue, MotionValue, Transition } from 'motion/react';
interface CircularTextProps {
    text: string;
    spinDuration?: number;
    onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
    className?: string;
    direction?: 'clockwise' | 'counterclockwise';
}

const getRotationTransition = (duration: number, from: number, loop: boolean = true, direction: 'clockwise' | 'counterclockwise' = 'clockwise') => ({
    from,
    to: direction === 'clockwise' ? from + 360 : from - 360,
    ease: 'linear' as const,
    duration,
    type: 'tween' as const,
    repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number, direction: 'clockwise' | 'counterclockwise' = 'clockwise') => ({
    rotate: getRotationTransition(duration, from, true, direction),
    scale: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300
    }
});

const CircularText: React.FC<CircularTextProps> = ({
    text,
    spinDuration = 20,
    onHover = 'speedUp',
    className = '',
    direction = 'clockwise'
}) => {
    const letters = Array.from(text);
    const pathRadius = 88;
    const pathLength = 2 * Math.PI * pathRadius;
    // Keep long translations from forcing SVG into negative letter spacing.
    // 0.75em is a conservative average width for the bold uppercase copy.
    const fontSize = Math.min(16, pathLength / Math.max(letters.length * 0.75, 1));
    const controls = useAnimation();
    const rotation: MotionValue<number> = useMotionValue(0);
    const pathId = `circular-text-${useId().replace(/:/g, '')}`;

    useEffect(() => {
        const start = rotation.get();
        controls.start({
            rotate: direction === 'clockwise' ? start + 360 : start - 360,
            scale: 1,
            transition: getTransition(spinDuration, start, direction)
        });
    }, [spinDuration, text, onHover, controls, direction, rotation]);

    const handleHoverStart = () => {
        const start = rotation.get();

        if (!onHover) return;

        let transitionConfig: ReturnType<typeof getTransition> | Transition;
        let scaleVal = 1;

        switch (onHover) {
            case 'slowDown':
                transitionConfig = getTransition(spinDuration * 2, start, direction);
                break;
            case 'speedUp':
                transitionConfig = getTransition(spinDuration / 4, start, direction);
                break;
            case 'pause':
                transitionConfig = {
                    rotate: { type: 'spring', damping: 20, stiffness: 300 },
                    scale: { type: 'spring', damping: 20, stiffness: 300 }
                };
                break;
            case 'goBonkers':
                transitionConfig = getTransition(spinDuration / 20, start, direction);
                scaleVal = 0.8;
                break;
            default:
                transitionConfig = getTransition(spinDuration, start, direction);
        }

        controls.start({
            rotate: direction === 'clockwise' ? start + 360 : start - 360,
            scale: scaleVal,
            transition: transitionConfig
        });
    };

    const handleHoverEnd = () => {
        const start = rotation.get();
        controls.start({
            rotate: direction === 'clockwise' ? start + 360 : start - 360,
            scale: 1,
            transition: getTransition(spinDuration, start, direction)
        });
    };

    return (
        <motion.svg
            className={`m-0 mx-auto rounded-full w-[200px] h-[200px] relative font-black  text-center cursor-pointer origin-center ${className}`}
            style={{ rotate: rotation }}
            initial={{ rotate: 0 }}
            animate={controls}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            viewBox="0 0 200 200"
            role="img"
            aria-label={text}
        >
            <defs>
                <path
                    id={pathId}
                    d={`M 100,100 m -${pathRadius},0 a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0 a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0`}
                />
            </defs>
            <text
                fill="currentColor"
                fontSize={fontSize}
                fontWeight="900"
                textLength={pathLength}
                lengthAdjust="spacing"
            >
                <textPath href={`#${pathId}`} startOffset="0">
                    {letters.join('')}
                </textPath>
            </text>
        </motion.svg>
    );
};

export default CircularText;
