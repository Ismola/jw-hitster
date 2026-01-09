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

    const lang = (locale === 'es' || locale === 'en' ? locale : 'en') as keyof typeof messages;
    const t = messages[lang];

    const startGame = () => {
        // Create a shuffled deck with unique IDs
        const deck = (gameData as GameItem[]).map((item, index) => ({
            id: index,
            ...item,
        }));
        const shuffled = [...deck].sort(() => Math.random() - 0.5);

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

        const currentDate = parseInt(currentCard.date);
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

    if (gameState === 'start') {
        return (
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-bold">
                    {lang === 'es' ? 'Ordena los eventos por fecha' : 'Order the events by date'}
                </h2>
                <button
                    onClick={startGame}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    {t.start}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto">
            {/* Score */}
            <div className="text-2xl font-bold">
                {t.score}: {score}
            </div>

            {/* Current Card to Place */}
            {gameState === 'playing' && currentCard && (
                <div className="flex flex-col items-center gap-4">
                    <div className="text-lg font-semibold">
                        {t.placeCard}:
                    </div>
                    <CardDataOnly
                        event={currentCard.event[lang]}
                        bibleReference={currentCard.bible_reference[lang]}
                    />
                </div>
            )}

            {/* Board Cards with Position Buttons */}
            <div className="flex gap-4 items-center justify-center flex-wrap">
                {gameState === 'playing' && currentCard && (
                    <button
                        onClick={() => checkPosition(0)}
                        className="w-12 h-12 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition flex items-center justify-center text-2xl"
                        title={t.placeHere}
                    >
                        +
                    </button>
                )}

                {boardCards.map((card, index) => (
                    <div key={card.id} className="flex gap-4 items-center">
                        <CardBothSides
                            date={card.date}
                            event={card.event[lang]}
                            bibleReference={card.bible_reference[lang]}
                        />

                        {gameState === 'playing' && currentCard && (
                            <button
                                onClick={() => checkPosition(index + 1)}
                                className="w-12 h-12 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition flex items-center justify-center text-2xl"
                                title={t.placeHere}
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}
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
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    {t.playAgain}
                </button>
            )}
        </div>
    );
}
