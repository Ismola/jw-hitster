'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

// Animation configuration
const ANIMATION_CONFIG = {
    initial: {
        scale: 0.3,
        opacity: 0,
        y: -50, // pixels upward
        rotateX: -90 // degrees
    },
    final: {
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0
    },
    duration: 0.6, // seconds
    ease: 'back.out(1.7)'
};

interface CardBothSidesProps {
    date: string;
    event: string;
    bibleReference: string;
    bcText: string;
    adText: string;
    bibliography?: string[];
    isNewlyPlaced?: boolean;
    onAnimationComplete?: () => void;
    isFailedCard?: boolean;
}

export default function CardBothSides({ date, event, bibleReference, bcText, adText, bibliography, isNewlyPlaced = false, onAnimationComplete, isFailedCard = false }: CardBothSidesProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isTouchDevice] = useState(() =>
        typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
    const cardRef = useRef<HTMLDivElement>(null);

    // Animate when card is newly placed
    useEffect(() => {
        if (isNewlyPlaced && cardRef.current) {
            const card = cardRef.current;

            // Set initial state
            gsap.set(card, ANIMATION_CONFIG.initial);

            // Animate in
            gsap.to(card, {
                ...ANIMATION_CONFIG.final,
                duration: ANIMATION_CONFIG.duration,
                ease: ANIMATION_CONFIG.ease,
                onComplete: () => {
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                }
            });
        }
    }, [isNewlyPlaced, onAnimationComplete]);

    // Format date with BC/AD
    const formatDate = (dateStr: string) => {
        const year = parseInt(dateStr);
        if (year < 0) {
            return `${Math.abs(year)} ${bcText}`;
        } else {
            return `${year} ${adText}`;
        }
    };

    // Card styling based on failed state
    const cardClassName = isFailedCard
        ? 'bg-red-600 text-white dark:bg-red-700 dark:text-white  '
        : 'bg-(--text-dark) text-(--text-light) dark:bg-(--text-light) dark:text-(--text-dark)';

    const cardBackClassName = isFailedCard
        ? 'bg-red-600 text-white dark:bg-red-700 dark:text-white '
        : 'bg-(--text-light) text-(--text-dark) dark:bg-(--text-dark) dark:text-(--text-light)';

    const handleInteraction = () => {
        if (isTouchDevice) {
            setIsFlipped(!isFlipped);
        }
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) {
            setIsFlipped(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice) {
            setIsFlipped(false);
        }
    };

    return (
        <div
            ref={cardRef}
            className="w-36 md:w-60 h-full perspective-1000 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleInteraction}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front - Date Only */}
                <div
                    className={`absolute w-full h-full backface-hidden rounded-lg shadow-lg flex items-center justify-center p-4 ${cardClassName}`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className=" text-center">
                        <div className="text-xl md:text-3xl font-bold">{formatDate(date)}</div>
                    </div>
                </div>

                {/* Back - Event Details */}
                <div
                    className={`absolute w-full h-full backface-hidden rounded-lg shadow-lg flex flex-col items-center md:justify-center justify-evenly p-4 ${cardBackClassName}`}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="text-[10px] md:text-[13px]  font-bold mb-2 line-clamp-0">
                        {event}
                    </div>
                    <div className={`text-[10px] md:text-xs text-center ${isFailedCard ? 'opacity-90' : 'opacity-75'}`}>{bibleReference}</div>
                    <div className={`absolute top-2 right-2 text-[10px] md:text-xs ${isFailedCard ? 'opacity-80' : 'opacity-50'}`}>{formatDate(date)}</div>

                    {/* Bibliography Links */}
                    {bibliography && bibliography.length > 0 && (
                        <div className="absolute bottom-2 right-2 flex gap-1">
                            {bibliography.map((url, index) => {
                                const isWol = url.includes('wol.jw.org');
                                const isJw = url.includes('jw.org') && !isWol;

                                let iconSrc = '/globe-icon.svg';
                                let altText = 'Link externo';

                                if (isWol) {
                                    iconSrc = '/wol-tm-color.svg';
                                    altText = 'WOL - Biblioteca en línea';
                                } else if (isJw) {
                                    iconSrc = '/siteLogo-jworg-medium.svg';
                                    altText = 'JW.org';
                                }

                                return (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-60 hover:opacity-100 transition-opacity"
                                        title={url}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Image
                                            src={iconSrc}
                                            alt={altText}
                                            width={20}
                                            height={20}
                                            className="w-4 h-4 md:w-5 md:h-5"
                                        />
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
