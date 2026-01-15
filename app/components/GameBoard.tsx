'use client';

import { useState, useEffect } from 'react';
import CardBothSides from './CardBothSides';
import CardDataOnly from './CardDataOnly';
import gameData from '@/config/info.json';
import { messages } from '@/config/text';
import AnimatedContent from './ReactBits/AnimatedContent';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

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

type MessageTone = 'success' | 'error';

interface ActiveMessage {
    id: number;
    text: string;
    tone: MessageTone;
}

interface SavedGameState {
    gameState: 'start' | 'playing' | 'gameOver';
    boardCards: BoardCard[];
    currentCard: BoardCard | null;
    score: number;
    shuffledDeck: BoardCard[];
    deckIndex: number;
}

export default function GameBoard({ locale }: { locale: string }) {
    const [savedGame, setSavedGame] = useLocalStorage<SavedGameState | null>('jw-hitster-game-state', null);
    
    // Initialize state from saved game or defaults
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>(() => {
        return savedGame?.gameState === 'playing' ? 'playing' : 'start';
    });
    const [boardCards, setBoardCards] = useState<BoardCard[]>(() => savedGame?.boardCards || []);
    const [currentCard, setCurrentCard] = useState<BoardCard | null>(() => savedGame?.currentCard || null);
    const [score, setScore] = useState(() => savedGame?.score || 0);
    const [shuffledDeck, setShuffledDeck] = useState<BoardCard[]>(() => savedGame?.shuffledDeck || []);
    const [deckIndex, setDeckIndex] = useState(() => savedGame?.deckIndex || 0);
    
    const [message, setMessage] = useState<ActiveMessage | null>(null);
    const [draggedOver, setDraggedOver] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

    const lang = (locale === 'es' || locale === 'en' ? locale : 'en') as keyof typeof messages;
    const t = messages[lang];

    // Save game state whenever it changes (only when playing)
    useEffect(() => {
        if (gameState === 'playing') {
            setSavedGame({
                gameState,
                boardCards,
                currentCard,
                score,
                shuffledDeck,
                deckIndex,
            });
        } else if (gameState === 'gameOver') {
            // Clear saved game when game is over
            setSavedGame(null);
        }
    }, [gameState, boardCards, currentCard, score, shuffledDeck, deckIndex, setSavedGame]);

    const showMessage = (text: string, tone: MessageTone) => {
        setMessage({
            id: Date.now(),
            text,
            tone
        });
    };

    const clearMessage = () => setMessage(null);

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
        clearMessage();
        setSavedGame(null); // Clear any saved game

        // Reset drag states
        setIsDragging(false);
        setDragPosition(null);
        setDraggedOver(null);
        setTouchStartPos(null);
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
            showMessage(t.correct, 'success');
            setScore(score + 1);
            setBoardCards(newBoard);

            // Get next card from the deck
            if (deckIndex < shuffledDeck.length) {
                setCurrentCard(shuffledDeck[deckIndex]);
                setDeckIndex(deckIndex + 1);
                setTimeout(clearMessage, 1500);
            } else {
                showMessage(t.won, 'success');
                setGameState('gameOver');
            }
        } else {
            showMessage(t.lose, 'error');
            setGameState('gameOver');
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        // Crear una imagen transparente para ocultar la imagen fantasma del navegador
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);

        setIsDragging(true);
        setDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleDrag = (e: React.DragEvent) => {
        if (e.clientX !== 0 || e.clientY !== 0) {
            setDragPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragPosition(null);
        setDraggedOver(null);
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
                    className="cursor-pointer px-8 py-3 bg-(--text-light) dark:bg-(--text-dark) text-(--text-dark) dark:text-(--text-light) rounded-lg font-semibold "
                >
                    {t.start}
                </button>
            </div>
        );
    }

    return (
        <>

            {/* Message */}
            <div className="absolute -bottom-30 z-40 w-full flex justify-center">
                <div className="relative w-full max-w-3xl min-h-18">
                    {message ? (
                        <AnimatedContent
                            key={message.id}
                            distance={64}
                            direction="vertical"
                            duration={0.6}
                            ease="power3.out"
                            initialOpacity={0}
                            animateOpacity
                            scale={1}
                            threshold={0.05}
                            className={`pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 inline-flex items-center justify-center text-lg font-semibold px-4 py-3 rounded-xl shadow-lg border ${message.tone === 'error'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-50 border-green-200 dark:border-green-800'
                                }`}
                        >
                            <span aria-live="polite">{message.text}</span>
                        </AnimatedContent>
                    ) : (
                        <div className="h-18" aria-hidden="true" />
                    )}
                </div>
            </div>



            <div className="flex flex-col  items-end md:items-center  md:gap-12 gap-8 w-full">

                {/* Score */}
                <div className="text-2xl font-bold flex justify-center items-center w-full">
                    {t.score}: {score}
                </div>



                {/* Game Over Button */}
                {gameState === 'gameOver' && (
                    <div className="flex justify-center w-full">

                        <button
                            onClick={startGame}
                            className="px-8 py-3  rounded-lg font-semibold cursor-pointer 
                        text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-zinc-200 dark:hover:bg-zinc-600
                         
                        hover:bg-gray-700 dark:hover:bg-gray-200 transition"
                        >
                            {t.playAgain}
                        </button>
                    </div>
                )}

                {/* Current Card to Place */}
                {gameState === 'playing' && currentCard && (
                    <div className="w-fit h-0 md:h-auto wrap-break-word sticky right-5 top-70 md:top-0 z-50 md:relative flex items-center flex-col">
                        {/* TODO cambiar texto de instruccion */}
                        <div className="text-lg font-semibold mb-6">
                            {t.placeCard}:
                        </div>
                        <div className="relative">
                            {/* Draggable card */}
                            <div
                                draggable
                                onDragStart={handleDragStart}
                                onDrag={handleDrag}
                                onDragEnd={handleDragEnd}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                className="cursor-move touch-none select-none"
                                style={{
                                    opacity: isDragging && dragPosition ? 0 : 1,
                                    transition: 'none'
                                }}
                            >
                                <CardDataOnly
                                    event={currentCard.event[lang]}
                                    bibleReference={currentCard.bible_reference[lang]}
                                    isDragging={isDragging}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Carta flotante mientras arrastra */}
                {gameState === 'playing' && isDragging && dragPosition && currentCard && (
                    <div
                        className="pointer-events-none"
                        style={{
                            position: 'fixed',
                            left: dragPosition.x - 72,
                            top: dragPosition.y - 96,
                            zIndex: 1000,
                        }}
                    >
                        <CardDataOnly
                            event={currentCard.event[lang]}
                            bibleReference={currentCard.bible_reference[lang]}
                            isAnimating={true}
                        />
                    </div>
                )}

                {/* Board Cards with Position Buttons */}
                <div className="w-full pb-4 flex justify-start md:justify-center">
                    <div className="flex flex-col md:flex-row gap-4 items-left justify-start  md:justify-center md:max-w-max overflow-x-auto overflow-y-auto scrollbar-minimal px-4">
                        {gameState === 'playing' && currentCard && (
                            <div
                                data-drop-zone="0"
                                onClick={() => checkPosition(0)}
                                onDragOver={(e) => handleDragOver(e, 0)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 0)}
                                className={`
                                backdrop-blur-xl
                                shrink-0 flex flex-col items-center justify-center w-36 h-48 md:w-32 md:h-44 md:min-w-32  rounded-lg transition-all cursor-pointer ${draggedOver === 0
                                        ? ' bg-(--text-dark)/30 dark:bg-(--text-light)/50 scale-105'
                                        : 'text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <svg
                                    className="w-10 h-10 md:w-10 md:h-10  mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                                </svg>
                                <span className="text-xs text-center  px-2">
                                    {t.placeHere}
                                </span>
                            </div>
                        )}

                        {boardCards.map((card, index) => (
                            <div key={card.id} className="flex   flex-col md:flex-row gap-4 items-start shrink-0">
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
                                        className={`shrink-0 flex flex-col items-center justify-center w-36 h-48 md:w-32 md:h-44 md:min-w-32  rounded-lg transition-all cursor-pointer ${draggedOver === index + 1
                                            ? 'bg-green-200/50 dark:bg-green-900/50 scale-105'
                                            : 'text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <svg
                                            className="w-10 h-10 md:w-10 md:h-10  mb-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                                        </svg>
                                        <span className="text-xs text-center  px-2">
                                            {t.placeHere}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                </div>


            </div>
        </>
    );
}
