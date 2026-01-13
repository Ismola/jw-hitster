'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { messages } from '@/config/text';
import Link from 'next/link';
import TextPressure from '../components/ReactBits/TextPressure';
import { useTheme } from '../components/ThemeProvider';
import { useResponsiveFontSize } from '../hooks/useResponsiveFontSize';
import CircularText from '../components/ReactBits/CircularText';
import CountUp from '../components/ReactBits/CountUp';
import AnimatedContent from '../components/ReactBits/AnimatedContent';
import { useState } from 'react';


export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;
  const { isDark } = useTheme();
  const minFontSize = useResponsiveFontSize(60, 300, 375, 1080);
  const [showCounter, setShowCounter] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  return (
    <>
      <div className="flex min-h-screen items-center justify-center overflow-hidden flex-col">
        <div className="flex flex-col items-center gap-8 ">
          <div className='w-full h-full relative '>
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1.1}
              threshold={0.1}
              delay={2}
            >
              <TextPressure
                text={t.title}
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor={isDark ? "#e9e5ff" : "#11224E"}
                strokeColor="#ff0000"
                minFontSize={minFontSize}
                className='duration-[2000ms]'
              />
            </AnimatedContent>
          </div>
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1.1}
            threshold={0.1}
            delay={6}
          >
            <p className="text-lg text-(--text-light) dark:text-(--text-dark)">{t.welcome}</p>
          </AnimatedContent>
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1.1}
            threshold={0.1}
            delay={1.5}
          >
            <LanguageSwitcher />
          </AnimatedContent>

          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            duration={.5}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1.1}
            threshold={0.1}
            delay={1}
          >
            <ThemeSwitcher />
          </AnimatedContent>
        </div>
        <AnimatedContent
          distance={150}
          direction="vertical"
          reverse={false}
          duration={.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1.1}
          threshold={0.1}
          delay={.5}
        >
          <Link href={`/${locale}/${t["slug.game"]}`} className="mt-20 h-80 w-80 backdrop-blur shadow bg-(--text-light)/10 dark:bg-(--text-dark)/10 
      rounded-full
      text-(--text-light) dark:text-(--text-dark)
       flex items-center justify-center ">
            {/* {t.startGame} */}
            <CircularText
              text={t.startGame}
              onHover="slowDown"
              spinDuration={40}
              className=" h-full"
            />
          </Link>
        </AnimatedContent>
      </div>
      {/* Contador */}
      {showCounter && (
        <div className={`text-(--text-light) dark:text-(--text-dark) absolute top-0 min-h-screen min-w-screen backdrop-blur shadow bg-(--text-light)/10 dark:bg-(--text-dark)/10 flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <CountUp
            from={0}
            to={100}
            separator=","
            direction="up"
            duration={2}
            className="count-up-text text-9xl"
            onEnd={() => {
              setFadeOut(true);
              setTimeout(() => setShowCounter(false), 500);
            }}
          />
        </div>
      )}
    </>
  );
}
