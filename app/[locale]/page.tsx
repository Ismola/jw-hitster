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
import { useState, useEffect } from 'react';
import BlurText from '../components/ReactBits/BlurText';


export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;
  const { isDark } = useTheme();
  const minFontSize = useResponsiveFontSize(60, 300, 375, 1080);
  const [showCounter, setShowCounter] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showBlurText, setShowBlurText] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showCounter) {
      const timer = setTimeout(() => {
        setShowBlurText(true);
      }, 500); // Segundos de retraso antes de mostrar el texto borroso después del contador
      return () => clearTimeout(timer);
    }
  }, [showCounter]);

  const handleAnimationComplete = () => {
    // console.log('Animation completed!');
  };
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
                textColor={mounted ? (isDark ? "#e9e5ff" : "#11224E") : "#11224E"}
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
            delay={0}
          >
            {showBlurText ? (
              <BlurText
                text={t.welcome}
                threshold={1}
                delay={100}
                animateBy="letters"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-2xl mb-8 text-(--text-light) dark:text-(--text-dark)"
              />
            )
              :
              <div className="text-2xl mb-8 text-(--text-light) dark:text-(--text-dark)">{/* Espacio reservado para el texto borroso */}

                ********
              </div>
            }
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
              spinDuration={30}
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
