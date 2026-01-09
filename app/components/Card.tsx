'use client';

import { useState } from 'react';

interface CardProps {
    date: string;
    event: string;
    bibleReference: string;
    showFront?: boolean;
}

export default function Card({ date, event, bibleReference, showFront = true }: CardProps) {
    const [isFlipped, setIsFlipped] = useState(!showFront);

    return (
        <div className="perspective h-64 w-48 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div
                className={`relative w-full h-full transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front - Date */}
                <div
                    className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center p-4 text-center"
                    style={{
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <div className="text-white">
                        <div className="text-5xl font-bold">{date}</div>
                        <div className="text-sm mt-4 opacity-75">Tap to reveal</div>
                    </div>
                </div>

                {/* Back - Info */}
                <div
                    className="absolute w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 text-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="text-white">
                        <div className="text-lg font-bold mb-2">{event}</div>
                        <div className="text-xs opacity-75">{bibleReference}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
