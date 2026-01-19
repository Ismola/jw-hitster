'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import CardBothSides from './CardBothSides';
import CardDataOnly from './CardDataOnly';
import gameData from '@/config/info.json';
import { messages } from '@/config/text';
import AnimatedContent from './ReactBits/AnimatedContent';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { useSuccess } from '../[locale]/SuccessContext';
import Magnet from './ReactBits/Magnet';
import ScrollReveal from './ReactBits/ScrollReveal';
import ShinyText from './ReactBits/ShinyText';
import { useTheme } from './ThemeProvider';

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
    const { triggerSuccess, triggerError } = useSuccess();

    // Track if component is mounted (client-side)
    const [isMounted, setIsMounted] = useState(false);
    const hasHydrated = useRef(false);

    // Initialize with default values or saved values (after mount)
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
    const [boardCards, setBoardCards] = useState<BoardCard[]>([]);
    const [currentCard, setCurrentCard] = useState<BoardCard | null>(null);
    const [score, setScore] = useState(0);
    const [shuffledDeck, setShuffledDeck] = useState<BoardCard[]>([]);
    const [deckIndex, setDeckIndex] = useState(0);

    const [message, setMessage] = useState<ActiveMessage | null>(null);
    const [draggedOver, setDraggedOver] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [newlyPlacedCardId, setNewlyPlacedCardId] = useState<number | null>(null);
    const [failedCard, setFailedCard] = useState<BoardCard | null>(null);

    // Ref para el contenedor scrollable
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const lang = (locale === 'es' || locale === 'en' ? locale : 'en') as keyof typeof messages;
    const t = messages[lang];
    const MESSAGE_VISIBILITY_SECONDS = 2.5;

    const showMessage = useCallback((text: string, tone: MessageTone) => {
        setMessage({
            id: Date.now(),
            text,
            tone
        });
    }, []);

    const clearMessage = useCallback(() => setMessage(null), []);

    // Flag that client-side hydration occurred
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Hydrate saved game state once after load
    useEffect(() => {
        if (hasHydrated.current) return;

        if (savedGame?.gameState === 'playing') {
            setGameState(savedGame.gameState);
            setBoardCards(savedGame.boardCards);
            setCurrentCard(savedGame.currentCard);
            setScore(savedGame.score);
            setShuffledDeck(savedGame.shuffledDeck);
            setDeckIndex(savedGame.deckIndex);
        }

        hasHydrated.current = true;
    }, [savedGame]);

    // Save game state whenever it changes (only when playing and after mount)
    useEffect(() => {
        if (!isMounted) return;

        if (gameState === 'playing') {
            const newState = {
                gameState,
                boardCards,
                currentCard,
                score,
                shuffledDeck,
                deckIndex,
            };
            setSavedGame(newState);
        } else if (gameState === 'gameOver') {
            // Clear saved game when game is over
            setSavedGame(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, gameState, boardCards, currentCard, score, shuffledDeck, deckIndex]);

    // Callback for when card placement animation completes
    const handleAnimationComplete = useCallback(() => {
        setNewlyPlacedCardId(null);
    }, []);

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

        // Reset drag states
        setIsDragging(false);
        setDragPosition(null);
        setDraggedOver(null);
        setTouchStartPos(null);
        setDragOffset({ x: 0, y: 0 });
        setFailedCard(null);
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
            triggerSuccess(); // Activar el cambio de color verde
            setScore(score + 1);
            setBoardCards(newBoard);
            setNewlyPlacedCardId(currentCard.id);

            // Get next card from the deck
            if (deckIndex < shuffledDeck.length) {
                setCurrentCard(shuffledDeck[deckIndex]);
                setDeckIndex(deckIndex + 1);
            } else {
                showMessage(t.won, 'success');
                setGameState('gameOver');
            }
        } else {
            showMessage(t.lose, 'error');
            triggerError(); // Activar el cambio de color rojo
            setFailedCard(currentCard);
            setGameState('gameOver');
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        // Crear una imagen transparente para ocultar la imagen fantasma del navegador
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);

        // Capturar el offset del clic dentro del elemento
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });

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

        // Capturar el offset del toque dentro del elemento
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDragOffset({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });

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

    const { isDark } = useTheme();


    if (gameState === 'start') {
        return (
            <>
                {/* Espacio superior para scroll */}
                <div
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}

                    ref={scrollContainerRef} className='scroll-smooth  border-0 w-full h-screen overflow-y-scroll  border-white/20 rounded-lg p-4 [&::-webkit-scrollbar]:hidden'>

                    {/* INSTRUCTIONS TITLE */}
                    <div className='md:h-187.5 h-[75vh]   w-full flex items-center justify-center gap-10'>
                        <ShinyText
                            text={t.instructions.title}
                            speed={3}
                            delay={2}
                            color={isDark ? "#e9e5ff" : "#11224E"}
                            shineColor={isDark ? "#ffff" : "#3060db"}
                            spread={120}
                            direction="left"
                            yoyo={true}
                            pauseOnHover={false}
                            className={`text-center transition-all text-2xl font-extrabold`}
                        />
                        <svg className='md:hidden' width="50px" height="50px" viewBox="-0.5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">

                            <title>scroll_up [#1381]</title>
                            <desc>Created with Sketch.</desc>
                            <defs>
                            </defs>
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-420.000000, -760.000000)" className="text-(--text-light) dark:text-(--text-dark)" fill="currentColor">
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path d="M369.277343,604 C369.859711,604 370.332357,603.552 370.332357,603 L370.332357,601 C370.332357,600.448 369.859711,600 369.277343,600 C368.694975,600 368.222329,600.448 368.222329,601 L368.222329,603 C368.222329,603.552 368.694975,604 369.277343,604 M373.296948,614.464 L371.382097,616.147 C371.049767,616.462 370.332357,616.239 370.332357,615.793 L370.332357,610.657 C370.332357,610.104 369.859711,609.657 369.277343,609.657 C368.694975,609.657 368.222329,610.104 368.222329,610.657 L368.222329,615.791 C368.222329,616.237 367.803488,616.46 367.471159,616.145 L365.726165,614.464 C365.314709,614.073 364.707021,614.073 364.29451,614.464 C363.882,614.854 363.912595,615.488 364.325106,615.879 L367.695877,619.059 L368.079902,619.415 C368.903868,620.195 370.245846,620.195 371.068757,619.415 L374.807728,615.878 C375.220239,615.488 375.231844,614.855 374.820389,614.464 C374.407878,614.074 373.709458,614.074 373.296948,614.464 M382.776252,608.36 L378.654311,610.516 C378.23969,610.787 377.679477,610.731 377.323938,610.394 C376.866061,609.96 376.931472,609.223 377.461089,608.87 L378.719722,608 L369.757375,608 C369.175007,608 368.69814,607.586 368.69814,607.033 C368.69814,606.323 369.376514,606.066 369.748935,606.066 L375.061987,606.059 L375.466057,601.741 C375.802607,600.784 376.75001,600.215 377.793419,600.413 L381.53661,600.745 C382.523048,600.932 382.99253,601.753 382.99253,602.706 L382.99253,607.541 C382.99253,607.87 383.062161,608.174 382.776252,608.36" id="scroll_up-[#1381]">

                                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <svg className='hidden md:block' width="50px" height="50px" viewBox="0 0 20 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <path d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M12 6V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 11L12 14L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </div>

                    {/* INSTRUCTIONS */}
                    {[t.instructions.step0, t.instructions.step1, t.instructions.step2, t.instructions.step3, t.instructions.step4, t.instructions.step5, t.instructions.step6, t.instructions.step7,].map((instruction: string, index: number) => (
                        <div key={index}>
                            <ScrollReveal
                                scrollContainerRef={scrollContainerRef as React.RefObject<HTMLElement>}
                                baseOpacity={0}
                                enableBlur={true}
                                baseRotation={5}
                                blurStrength={15}
                                rotationEnd="bottom top"
                                wordAnimationEnd="bottom top"
                                containerClassName="px-4 text-(--text-light) hidden md:block  dark:text-(--text-dark) "
                            >
                                {/* AQUI NO PUEDE HABER HTML SOLO TEXTO PLANO */}
                                {instruction}
                            </ScrollReveal>
                            <div className='md:h-75 hidden md:block w-full '></div>


                        </div>
                    ))}

                    {/* INSTRUCTIONS MOBILE */}
                    {[t.instructions.step0, t.instructions.step1, t.instructions.step2, t.instructions.step3, t.instructions.step4, t.instructions.step5, t.instructions.step6, t.instructions.step7,].map((instruction: string, index: number) => (

                        <ScrollReveal
                            key={index}
                            scrollContainerRef={scrollContainerRef as React.RefObject<HTMLElement>}
                            baseOpacity={0}
                            enableBlur={true}
                            baseRotation={5}
                            blurStrength={5}
                            rotationEnd="bottom top"
                            wordAnimationEnd="bottom top"
                            containerClassName="px-4 text-(--text-light)  md:hidden dark:text-(--text-dark) "
                        >
                            {/* AQUI NO PUEDE HABER HTML SOLO TEXTO PLANO */}
                            {instruction}
                        </ScrollReveal>

                    ))}

                    {/* SPACE */}
                    <div className=' h-[25vh] md:h-50 '></div>


                    {/* READY TITLE */}
                    <div className='md:h-50 h-[75vh] w-full flex items-start md:items-center justify-center '>
                        <Magnet padding={500} disabled={false} magnetStrength={9}>
                            <button
                                onClick={startGame}
                                aria-label={t.start}
                                className="group relative overflow-hidden cursor-pointer md:text-4xl text-2xl font-semibold px-8 w- py-8
                                    text-(--text-light) dark:text-(--text-dark) rounded-2xl
                                    bg-linear-to-r from-[rgba(255,255,255,0.06)] via-[rgba(255,255,255,0.03)] to-[rgba(0,0,0,0.03)]
                                    dark:from-[rgba(255,255,255,0.03)] dark:via-[rgba(255,255,255,0.02)] dark:to-[rgba(0,0,0,0.5)]
                                    border border-(--text-light)/10 dark:border-(--text-dark)/20
                                    shadow-2xl hover:shadow-[0_20px_60px_rgba(60,50,120,0.25)]
                                    transform transition-all duration-300 hover:scale-[1.3] backdrop-blur-lg"
                            >
                                {/* Subtle moving sheen */}
                                <span className="pointer-events-none absolute -inset-1 bg-white/5 mix-blend-screen blur-md
                                    transform -translate-x-24 rotate-12 transition-all duration-700 group-hover:translate-x-40" />
                                {/* inner content */}
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    <span className="select-none">
                                        <ShinyText
                                            text={t.instructions.ready}
                                            speed={3}
                                            delay={2}
                                            color={isDark ? "#e9e5ff" : "#11224E"}
                                            shineColor={isDark ? "#ffff" : "#3060db"}
                                            spread={120}
                                            direction="left"
                                            yoyo={true}
                                            pauseOnHover={false}
                                        />
                                    </span>
                                </span>
                            </button>
                        </Magnet>
                    </div>

                    {/* SPACE */}
                    <div className='md:h-75 h-10 w-full flex items-center justify-center'>

                    </div>
                </div>






            </>
        );
    }

    return (
        <>

            {/* Message */}
            <div className="pointer-events-none fixed inset-x-0 -top-40 z-100 flex justify-center px-4 ">
                {message && (
                    <AnimatedContent
                        key={message.id}
                        distance={48}
                        direction="vertical"
                        reverse
                        duration={0.5}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0}
                        disappearAfter={MESSAGE_VISIBILITY_SECONDS}
                        disappearDuration={0.4}
                        onDisappearanceComplete={clearMessage}
                        className={`inline-flex items-center justify-center text-lg font-semibold px-4 py-3 rounded-xl shadow-lg border ${message.tone === 'error'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-50 border-green-200 dark:border-green-800'
                            }`}
                    >
                        <span aria-live="polite">{message.text}</span>
                    </AnimatedContent>
                )}
            </div>



            <div className="flex flex-col text-(--text-light) dark:text-(--text-dark)  items-center   md:gap-12 gap-8 w-full ">
                {/* Score */}
                <AnimatedContent
                    distance={0}
                    direction="horizontal"
                    reverse={false}
                    duration={.5}

                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1.1}
                    threshold={0.1}
                    delay={.5}
                    className='flex justify-center items-center w-full md:w-auto'
                >
                    <div className="text-2xl font-bold flex justify-center items-center w-full">
                        {t.score}: {score}
                    </div>
                </AnimatedContent>


                {/* Game Over Button */}
                {gameState === 'gameOver' && (
                    <div className="flex justify-center w-full">

                        <button
                            onClick={startGame}
                            className="px-8 py-3  rounded-lg font-semibold cursor-pointer 
                        text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10
                         
                        hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40 transition"
                        >
                            {t.playAgain}
                        </button>
                    </div>
                )}

                {/* Current Card to Place */}
                {gameState === 'playing' && currentCard && (

                    <div className="w-fit   h-auto wrap-break-word  right-0  z-50 relative flex items-center flex-col">

                        <div className="text-lg font-semibold mb-6">
                            {t.placeCard}:
                        </div>
                        <div className="relative">
                            <Magnet padding={1000} disabled={false} magnetStrength={15}>
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
                            </Magnet>
                        </div>
                    </div>


                )}

                {/* Carta flotante mientras arrastra */}
                {isMounted && gameState === 'playing' && isDragging && dragPosition && currentCard &&
                    createPortal(
                        <div
                            className="pointer-events-none"
                            style={{
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                transform: `translate(${dragPosition.x - dragOffset.x}px, ${dragPosition.y - dragOffset.y}px)`,
                                zIndex: 1000,
                            }}
                        >
                            <CardDataOnly
                                event={currentCard.event[lang]}
                                bibleReference={currentCard.bible_reference[lang]}
                                isAnimating={true}
                            />
                        </div>,
                        document.body
                    )}

                {/* Board Cards with Position Buttons */}
                <div className="w-full pb-4 flex justify-center  md:mt-0 mt-[20vw] ">
                    <div className="h-35 md:h-50 flex flex-row gap-4 items-left  justify-center-safe max-w-max overflow-x-auto overflow-y-visible  scrollbar-minimal px-4 ">
                        {/* PLACE HERE */}
                        {gameState === 'playing' && currentCard && (
                            <div
                                data-drop-zone="0"
                                onClick={() => checkPosition(0)}
                                onDragOver={(e) => handleDragOver(e, 0)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 0)}
                                className={`
                                backdrop-blur-xl
                                shrink-0 flex flex-col items-center justify-center w-22 h-32 md:w-32 md:h-44 md:min-w-32  rounded-lg transition-all cursor-pointer ${draggedOver === 0
                                        ? 'bg-green-200/50 dark:bg-green-900/50 scale-95'
                                        : 'text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40   '
                                    }`}
                            >
                                <svg
                                    className="w-8 h-8 md:w-10 md:h-10  mb-2"
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

                        {/* CARDS */}
                        {boardCards.map((card, index) => (
                            <div key={card.id} className="flex   flex-row gap-4 items-start shrink-0 ">
                                <div className="shrink-0">
                                    <CardBothSides
                                        date={card.date}
                                        event={card.event[lang]}
                                        bibleReference={card.bible_reference[lang]}
                                        bcText={t.bc}
                                        adText={t.ad}
                                        bibliography={card.bibliografy?.[lang]}
                                        isNewlyPlaced={card.id === newlyPlacedCardId}
                                        onAnimationComplete={handleAnimationComplete}
                                    />
                                </div>

                                {gameState === 'playing' && currentCard && (

                                    <div
                                        data-drop-zone={index + 1}
                                        onClick={() => checkPosition(index + 1)}
                                        onDragOver={(e) => handleDragOver(e, index + 1)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index + 1)}
                                        className={`shrink-0 flex flex-col items-center justify-center w-22 h-32 md:w-32 md:h-44 md:min-w-32  rounded-lg transition-all cursor-pointer ${draggedOver === index + 1
                                            ? 'bg-green-200/50 dark:bg-green-900/50 scale-95'
                                            : 'text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40   '
                                            }`
                                        }
                                    >
                                        <svg
                                            className="w-8 h-8 md:w-10 md:h-10  mb-2"
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

                        {/* Failed Card - Show at the end when game is over */}
                        {gameState === 'gameOver' && failedCard && (

                            <div className="shrink-0">
                                <CardBothSides
                                    date={failedCard.date}
                                    event={failedCard.event[lang]}
                                    bibleReference={failedCard.bible_reference[lang]}
                                    bcText={t.bc}
                                    adText={t.ad}
                                    bibliography={failedCard.bibliografy?.[lang]}
                                    isNewlyPlaced={false}
                                    onAnimationComplete={handleAnimationComplete}
                                    isFailedCard={true}
                                />
                            </div>

                        )}
                    </div>


                </div>


            </div >
        </>
    );
}
