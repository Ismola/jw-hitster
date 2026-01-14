'use client';

import CountUp from './ReactBits/CountUp';
import { useTheme } from './ThemeProvider';

interface CounterProps {
    show: boolean;
    fadeOut: boolean;
    onEnd: () => void;
}

export default function Counter({ show, fadeOut, onEnd }: CounterProps) {
    const { isDark } = useTheme();

    if (!show) return null;

    return (
        <div
            className={`text-(--text-light) dark:text-(--text-dark) 
        absolute top-0 h-full w-full
        z-[200]
       backdrop-blur shadow bg-(--text-light)/10 dark:bg-(--text-dark)/10 
       flex items-center justify-center
        transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <CountUp
                from={0}
                to={100}
                separator=","
                direction="up"
                duration={2}
                className="count-up-text text-9xl "
                onEnd={onEnd}
            />
        </div>
    );
}
