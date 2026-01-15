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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAnimationComplete = () => {
    // console.log('Animation completed!');
  };
  return (
    <>
      <div className="flex  h-full   overflow-y-auto overflow-x-hidden items-center justify-around sm:justify-between  flex-col gap-4 ">
        <div className="flex flex-col  items-center gap-8 z-10  ">
          <div className='w-full h-full relative   '>
            <AnimatedContent
              distance={0}
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
                delay={.3}
              >
                <div className="text-2xl mb-8 text-(--text-light) dark:text-(--text-dark)">{/* Espacio reservado para el texto borroso */}

                  ********
                </div>
              </AnimatedContent>
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
      <div
        onClick={handleModalToggle}
        className='absolute md:bottom-5 md:top-auto right-5 
        top-5 
        transition-all
        cursor-pointer
        text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40
        p-2 rounded-full text-xs w-10 h-10 z-50'>
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="currentColor" />
          <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Modal de información */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-(--text-light)/5 dark:bg-(--text-dark)/5 animate-in fade-in duration-300"
          onClick={handleModalToggle}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-(--text-dark) dark:bg-(--text-light) text-(--text-light) dark:text-(--text-dark) rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleModalToggle}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Contenido del modal */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold border-b border-(--text-light)/20 dark:border-(--text-dark)/20 pb-4">
                {t.credits.title}
              </h2>

              {/* Developer Section */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{t.credits.developer}</h3>
                <a
                  href="https://github.com/Ismola/jw-hitster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="font-medium">Ismola</span>
                </a>
              </div>

              {/* Thanks Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t.credits.thanksTitle}</h3>
                <p className="text-base opacity-90">{t.credits.thanksText}</p>

                <div className="grid gap-3">
                  <a
                    href="https://www.jw.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-(--text-light)/5 dark:bg-(--text-dark)/5 hover:bg-(--text-light)/10 dark:hover:bg-(--text-dark)/10 transition-all group"
                  >
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="font-semibold">{t.credits.resources.jw.name}</p>
                      <p className="text-sm opacity-75">{t.credits.resources.jw.description}</p>
                    </div>
                  </a>

                  <a
                    href="https://www.reactbits.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-(--text-light)/5 dark:bg-(--text-dark)/5 hover:bg-(--text-light)/10 dark:hover:bg-(--text-dark)/10 transition-all group"
                  >
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="font-semibold">{t.credits.resources.reactbits.name}</p>
                      <p className="text-sm opacity-75">{t.credits.resources.reactbits.description}</p>
                    </div>
                  </a>

                  <a
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-(--text-light)/5 dark:bg-(--text-dark)/5 hover:bg-(--text-light)/10 dark:hover:bg-(--text-dark)/10 transition-all group"
                  >
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="font-semibold">{t.credits.resources.tailwind.name}</p>
                      <p className="text-sm opacity-75">{t.credits.resources.tailwind.description}</p>
                    </div>
                  </a>

                  <a
                    href="https://www.svgrepo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-(--text-light)/5 dark:bg-(--text-dark)/5 hover:bg-(--text-light)/10 dark:hover:bg-(--text-dark)/10 transition-all group"
                  >
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="font-semibold">{t.credits.resources.svgrepo.name}</p>
                      <p className="text-sm opacity-75">{t.credits.resources.svgrepo.description}</p>
                    </div>
                  </a>

                  <a
                    href="https://hitstergame.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-(--text-light)/5 dark:bg-(--text-dark)/5 hover:bg-(--text-light)/10 dark:hover:bg-(--text-dark)/10 transition-all group"
                  >
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="font-semibold">{t.credits.resources.hitster.name}</p>
                      <p className="text-sm opacity-75">{t.credits.resources.hitster.description}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-3 pt-4 border-t border-(--text-light)/20 dark:border-(--text-dark)/20">
                <h3 className="text-xl font-semibold">{t.credits.contact}</h3>
                <a
                  href="https://ismola.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="font-medium">{t.credits.resources.portfolio.name}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
