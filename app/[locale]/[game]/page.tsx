'use client';

import { usePathname } from 'next/navigation';
import { messages } from '@/config/text';
import Header from '@/app/components/Header';
import GameBoard from '@/app/components/GameBoard';

interface GamePageProps {
    params: {
        locale: string;
        game: string;
    };
}

export default function GamePage({ }: GamePageProps) {
    const pathname = usePathname();
    const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
    const t = messages[locale] || messages.en;

    return (
        <>
            <Header />

            <div className="flex flex-col h-full items-center justify-start ">
                    <h1 className="text-4xl font-bold">{t.game}</h1>
                    <GameBoard locale={locale} />
                    
            </div>
        </>
    );
}
