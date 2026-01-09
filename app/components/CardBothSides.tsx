'use client';

import { useState } from 'react';

interface CardBothSidesProps {
    date: string;
    event: string;
    bibleReference: string;
    bcText: string;
    adText: string;
}

export default function CardBothSides({ date, event, bibleReference, bcText, adText }: CardBothSidesProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    // Format date with BC/AD
    const formatDate = (dateStr: string) => {
        const year = parseInt(dateStr);
        if (year < 0) {
            return `${Math.abs(year)} ${bcText}`;
        } else {
            return `${year} ${adText}`;
        }
    };

    return (
        <div
            className="w-36 h-48 md:w-48 md:h-64 perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
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
                    className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center p-4"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="text-white text-center">
                        <div className="text-3xl md:text-5xl font-bold">{formatDate(date)}</div>
                    </div>
                </div>

                {/* Back - Event Details */}
                <div
                    className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 text-white"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="text-xs md:text-sm font-bold mb-3 text-center">{event}</div>
                    <div className="text-[10px] md:text-xs opacity-75 text-center">{bibleReference}</div>
                    <div className="absolute top-2 right-2 text-[10px] md:text-xs opacity-50">{formatDate(date)}</div>
                </div>
            </div>
        </div>
    );
}
