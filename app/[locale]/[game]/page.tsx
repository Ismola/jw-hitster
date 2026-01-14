'use client';

import { usePathname } from 'next/navigation';
import { messages } from '@/config/text';
import Header from '@/app/components/Header';
import GameBoard from '@/app/components/GameBoard';
import ShinyText from '@/app/components/ReactBits/ShinyText';
import { useTheme } from '@/app/components/ThemeProvider';
import AnimatedContent from '@/app/components/ReactBits/AnimatedContent';

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
    const { isDark } = useTheme();

    return (
        <>
            <Header />

            <div className="flex flex-col h-full items-start md:items-center justify-start pt-8 ">
                <AnimatedContent
                    distance={200}
                    direction="vertical"
                    reverse={false}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1.1}
                    threshold={0.1}
                    delay={1}
                    className='w-full  text-center'
                >
                    <ShinyText
                        text={t.title}
                        speed={3}
                        delay={2}
                        color={isDark ? "#e9e5ff" : "#11224E"}
                        shineColor={isDark ? "#ffff" : "#3060db"}
                        spread={120}
                        direction="left"
                        yoyo={true}
                        pauseOnHover={false}
                        className={`text-center transition-all text-5xl font-extrabold`}
                    />
                </AnimatedContent>
                <AnimatedContent
                    distance={200}
                    direction="vertical"
                    reverse={false}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1.1}
                    threshold={0.1}
                    delay={1.3}
                    className='w-full'
                >
                    <GameBoard locale={locale} />
                </AnimatedContent>
            </div>
        </>
    );
}
