'use client';

import { useState } from 'react';
import CardBothSides from './CardBothSides';
import CardDataOnly from './CardDataOnly';
import gameData from '@/config/info.json';
import { messages } from '@/config/text';

interface GameItem {
    date: string;
    event: {
        es: string;
        en: string;
    };
    bible_reference: {
        es: string;
        en: string;
    };
    bibliografy?: {
        es: string[];
        en: string[];
    };
}

interface BoardCard extends GameItem {
    id: number;
}

export default function GameBoard({ locale }: { locale: string }) {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
    const [boardCards, setBoardCards] = useState<BoardCard[]>([]);
    const [currentCard, setCurrentCard] = useState<BoardCard | null>(null);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [shuffledDeck, setShuffledDeck] = useState<BoardCard[]>([]);
    const [deckIndex, setDeckIndex] = useState(0);
    const [draggedOver, setDraggedOver] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

    const lang = (locale === 'es' || locale === 'en' ? locale : 'en') as keyof typeof messages;
    const t = messages[lang];

    // Fisher-Yates shuffle algorithm for better randomization
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startGame = () => {
        // Create a shuffled deck with unique IDs
        const deck = (gameData as GameItem[]).map((item, index) => ({
            id: index,
            ...item,
        }));
        const shuffled = shuffleArray(deck);

        setShuffledDeck(shuffled);
        setBoardCards([shuffled[0]]);
        setCurrentCard(shuffled[1]);
        setDeckIndex(2);
        setGameState('playing');
        setScore(0);
        setMessage('');
    };

    const checkPosition = (position: number) => {
        if (!currentCard) return;


        const newBoard = [...boardCards];

        // Insert at the specified position
        newBoard.splice(position, 0, currentCard);

        // Check if the order is correct
        let isCorrect = true;
        for (let i = 0; i < newBoard.length - 1; i++) {
            if (parseInt(newBoard[i].date) > parseInt(newBoard[i + 1].date)) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            setMessage(t.correct);
            setScore(score + 1);
            setBoardCards(newBoard);

            // Get next card from the deck
            if (deckIndex < shuffledDeck.length) {
                setCurrentCard(shuffledDeck[deckIndex]);
                setDeckIndex(deckIndex + 1);
                setTimeout(() => setMessage(''), 1500);
            } else {
                setMessage(t.won);
                setGameState('gameOver');
            }
        } else {
            setMessage(t.lose);
            setGameState('gameOver');
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, position: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDraggedOver(position);
    };

    const handleDragLeave = () => {
        setDraggedOver(null);
    };

    const handleDrop = (e: React.DragEvent, position: number) => {
        e.preventDefault();
        setDraggedOver(null);
        checkPosition(position);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        setTouchStartPos({ x: touch.clientX, y: touch.clientY });
        setDragPosition({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        setDragPosition({ x: touch.clientX, y: touch.clientY });

        // Detect which drop zone is under the touch
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest('[data-drop-zone]');
        if (dropZone) {
            const position = parseInt(dropZone.getAttribute('data-drop-zone') || '-1');
            if (position !== -1) {
                setDraggedOver(position);
            }
        } else {
            setDraggedOver(null);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartPos || !isDragging) return;
        e.preventDefault(); // Prevent any default behavior

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest('[data-drop-zone]');

        if (dropZone) {
            const position = parseInt(dropZone.getAttribute('data-drop-zone') || '-1');
            if (position !== -1) {
                checkPosition(position);
            }
        }

        setIsDragging(false);
        setDragPosition(null);
        setTouchStartPos(null);
        setDraggedOver(null);
    };

    if (gameState === 'start') {
        return (
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-bold">
                    {lang === 'es' ? 'Ordena los eventos por fecha' : 'Order the events by date'}
                </h2>
                <button
                    onClick={startGame}
                    className="px-8 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                    {t.start}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full  mx-auto">
            {/* Score */}
            <div className="text-2xl font-bold">
                {t.score}: {score}
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`text-xl font-bold p-4 rounded-lg ${gameState === 'gameOver'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Game Over Button */}
            {gameState === 'gameOver' && (
                <button
                    onClick={startGame}
                    className="px-8 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                    {t.playAgain}
                </button>
            )}

            {/* Current Card to Place */}
            {gameState === 'playing' && currentCard && (
                <div className="flex flex-col items-center gap-4">
                    <div className="text-lg font-semibold">
                        {t.placeCard}:
                    </div>
                    <div className="relative">
                        {/* Placeholder to keep space when dragging */}
                        {isDragging && (
                            <div className="w-36 h-48 md:w-32 md:h-44 opacity-30">
                                <CardDataOnly
                                    event={currentCard.event[lang]}
                                    bibleReference={currentCard.bible_reference[lang]}
                                />
                            </div>
                        )}
                        {/* Actual draggable card */}
                        <div
                            draggable
                            onDragStart={handleDragStart}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="cursor-move touch-none select-none"
                            style={
                                isDragging && dragPosition
                                    ? {
                                        position: 'fixed',
                                        left: dragPosition.x - 96,
                                        top: dragPosition.y - 128,
                                        zIndex: 1000,
                                        opacity: 0.9,
                                        pointerEvents: 'none',
                                    }
                                    : undefined
                            }
                        >
                            <CardDataOnly
                                event={currentCard.event[lang]}
                                bibleReference={currentCard.bible_reference[lang]}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Board Cards with Position Buttons */}
            <div className="w-full overflow-x-auto pb-4 ">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-start md:justify-center min-w-max px-4">
                    {gameState === 'playing' && currentCard && (
                        <div
                            data-drop-zone="0"
                            onClick={() => checkPosition(0)}
                            onDragOver={(e) => handleDragOver(e, 0)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 0)}
                            className={`shrink-0 flex flex-col items-center justify-center w-36 h-48 md:w-32 md:h-44 md:min-w-32 border-2 border-dashed rounded-lg transition-all cursor-pointer ${draggedOver === 0
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105'
                                : 'border-gray-400 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <svg
                                className="w-10 h-10 md:w-10 md:h-10 text-gray-400 dark:text-gray-600 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                            </svg>
                            <span className="text-xs text-center text-gray-600 dark:text-gray-400 px-2">
                                {t.placeHere}
                            </span>
                        </div>
                    )}

                    {boardCards.map((card, index) => (
                        <div key={card.id} className="flex flex-col md:flex-row gap-4 items-center shrink-0">
                            <div className="shrink-0">
                                <CardBothSides
                                    date={card.date}
                                    event={card.event[lang]}
                                    bibleReference={card.bible_reference[lang]}
                                    bcText={t.bc}
                                    adText={t.ad}
                                    bibliography={card.bibliografy?.[lang]}
                                />
                            </div>

                            {gameState === 'playing' && currentCard && (
                                <div
                                    data-drop-zone={index + 1}
                                    onClick={() => checkPosition(index + 1)}
                                    onDragOver={(e) => handleDragOver(e, index + 1)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index + 1)}
                                    className={`shrink-0 flex flex-col items-center justify-center w-36 h-48 md:w-32 md:h-44 md:min-w-32 border-2 border-dashed rounded-lg transition-all cursor-pointer ${draggedOver === index + 1
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105'
                                        : 'border-gray-400 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <svg
                                        className="w-10 h-10 md:w-10 md:h-10 text-gray-400 dark:text-gray-600 mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                                    </svg>
                                    <span className="text-xs text-center text-gray-600 dark:text-gray-400 px-2">
                                        {t.placeHere}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}
