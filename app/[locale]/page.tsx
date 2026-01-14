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
import AnimatedContent from '../components/ReactBits/AnimatedContent';
import { useState, useEffect } from 'react';
import BlurText from '../components/ReactBits/BlurText';
import { useBlurText } from './BlurTextContext';


export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;
  const { isDark } = useTheme();
  const { showBlurText } = useBlurText();
  const minFontSize = useResponsiveFontSize(60, 300, 375, 1080);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleAnimationComplete = () => {
    // console.log('Animation completed!');
  };
  return (
    <>
      <div className="flex  h-full   overflow-y-auto overflow-x-hidden items-center justify-around sm:justify-between  flex-col gap-4 ">
        <div className="flex flex-col  items-center gap-8 z-10  ">
          <div className='w-full h-full relative   '>
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
                delay={200}
                stepDuration={.5}
                animateBy="letters"
                direction="bottom"
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


          <LanguageSwitcher />



          <ThemeSwitcher />

        </div>
        <div className="w-full sm:h-96 h-72 min-h-100 overflow-visible sm:overflow-hidden relative ">
          <div className='absolute h-full  w-full flex justify-center bottom-0  left-1/2 transform -translate-x-1/2  '>
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
              <Link href={`/${locale}/${t["slug.game"]}`} className="relative 
              sm:h-200 sm:w-200 h-170 w-170


              shadow-2xl

              xl:w-250 xl:h-250


              rounded-full
              flex items-center justify-center
              text-(--text-light) dark:text-(--text-dark)
              backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 
       
       ">
                {/* {t.startGame} */}
                <CircularText
                  text={t.startGame}
                  onHover="slowDown"
                  spinDuration={30}
                  className="w-full h-full "
                  direction='counterclockwise'
                />
              </Link>
            </AnimatedContent>
          </div>
        </div>

      </div>

    </>
  );
}
