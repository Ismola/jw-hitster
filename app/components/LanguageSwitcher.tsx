'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { translatePath } from '@/config/routes';
import type { Locale } from '@/i18n.config';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // Extract current locale from pathname
    const locale = (pathname.split('/')[1] || 'es') as Locale;

    const switchLanguage = (newLocale: Locale) => {
        startTransition(() => {
            const newPathname = translatePath(pathname, locale, newLocale);
            router.push(newPathname);
        });
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => switchLanguage('es')}
                className={` px-3 py-1 rounded transition ${locale === 'es'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'cursor-pointer bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600'
                    }`}
                disabled={isPending}
            >
                Español
            </button>
            <button
                onClick={() => switchLanguage('en')}
                className={` px-3 py-1 rounded transition ${locale === 'en'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'cursor-pointer bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600'
                    }`}
                disabled={isPending}
            >
                English
            </button>
        </div>
    );
}
