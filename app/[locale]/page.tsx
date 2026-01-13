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


export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;
  const { isDark } = useTheme();
  const minFontSize = useResponsiveFontSize(60, 300, 375, 1080);
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden flex-col">
      <div className="flex flex-col items-center gap-8 ">


        <div className='w-full h-full relative '>
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
        </div>

        <p className="text-lg text-(--text-light) dark:text-(--text-dark)">{t.welcome}</p>
        <LanguageSwitcher />
        <ThemeSwitcher />

      </div>

      <Link href={`/${locale}/${t["slug.game"]}`} className="mt-20  w-full h-80">
        <CircularText
          text={t.startGame}
          onHover="goBonkers"
          spinDuration={40}
          className="text-(--text-light) dark:text-(--text-dark) h-full"
        />
      </Link>
    </div>
  );
}
