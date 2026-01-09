'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { messages } from '@/config/text';
import Link from 'next/link';


export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">{t.title}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{t.welcome}</p>
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
