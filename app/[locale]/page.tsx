'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { messages } from '@/config/text';
import Link from 'next/link';
import TextPressure from '../components/ReactBits/TextPressure';
import { useTheme } from '../components/ThemeProvider';


export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;
  const { isDark } = useTheme();
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="flex flex-col items-center gap-8">


        <div className='w-full h-full relative'>
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
            minFontSize={300}
            className='duration-[2000ms]'
          />
        </div>

        <p className="text-lg text-[var(--text-light)] dark:text-[var(--text-dark)]">{t.welcome}</p>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <Link href={`/${locale}/${t["slug.game"]}`} className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          {t.startGame}
        </Link>
      </div>
    </div>
  );
}
