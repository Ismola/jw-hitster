'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface MessageContent {
  home: {
    title: string;
    welcome: string;
  };
  language: string;
  spanish: string;
  english: string;
}

const messages: Record<string, MessageContent> = {
  es: {
    home: {
      title: "Hipster",
      welcome: "Bienvenido",
    },
    language: "Idioma",
    spanish: "Español",
    english: "English",
  },
  en: {
    home: {
      title: "Hipster",
      welcome: "Welcome",
    },
    language: "Language",
    spanish: "Español",
    english: "English",
  },
};

export default function Home() {
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">{t.home.title}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{t.home.welcome}</p>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
