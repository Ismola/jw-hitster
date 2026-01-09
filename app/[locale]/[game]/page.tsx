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
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <Header />

            <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-8  pb-8 w-full">
                    <h1 className="text-4xl font-bold">{t.game}</h1>
                    <GameBoard locale={locale} />
                </div>
            </div>
        </div>
    );
}
