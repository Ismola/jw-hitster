'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { translatePath } from '@/config/routes';
import type { Locale } from '@/i18n.config';
import AnimatedContent from './ReactBits/AnimatedContent';

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
                delay={1.5}
            >
                <button
                    onClick={() => switchLanguage('es')}
                    className={` px-3 py-1 rounded transition ${locale === 'es'
                        // Seccionado
                        ? 'bg-[var(--text-light)] text-white dark:bg-[var(--text-dark)] dark:text-black '
                        // Sin seleccionar
                        : 'cursor-pointer bg-zinc-100 text-(--text-light) dark:bg-zinc-700 dark:text-(--text-dark) hover:bg-zinc-300 dark:hover:bg-zinc-600  '
                        }`}
                    disabled={isPending}
                >
                    Español
                </button>
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
                delay={1.25}
            >
                <button
                    onClick={() => switchLanguage('en')}
                    className={` px-3 py-1 rounded transition ${locale === 'en'
                        // Seccionado
                        ? 'bg-(--text-light) text-white dark:bg-(--text-dark) dark:text-black '
                        // Sin seleccionar
                        : 'cursor-pointer bg-zinc-100 text-(--text-light) dark:bg-zinc-700 dark:text-(--text-dark) hover:bg-zinc-300 dark:hover:bg-zinc-600  '
                        }`}
                    disabled={isPending}
                >
                    English
                </button>
            </AnimatedContent>
        </div>
    );
}
