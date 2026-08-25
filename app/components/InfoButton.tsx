'use client';

import { useState } from 'react';
import { messages } from '@/config/text';
import AnimatedContent from './ReactBits/AnimatedContent';

type Locale = keyof typeof messages;

export default function InfoButton({ locale }: { locale: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    const t = messages[locale] || messages.en;
    const resources = [
        { href: 'https://www.jw.org/', content: t.credits.resources.jw },
        { href: 'https://www.reactbits.dev/', content: t.credits.resources.reactbits },
        { href: 'https://tailwindcss.com/', content: t.credits.resources.tailwind },
        { href: 'https://www.svgrepo.com/', content: t.credits.resources.svgrepo },
        { href: 'https://hitstergame.com/', content: t.credits.resources.hitster },
    ];

    return (
        <>
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
                className="flex items-center justify-center"
            >
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Información"
                    className="cursor-pointer text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40 hover:scale-105 p-2 rounded-full w-9 h-9 transition-all duration-300"
                >
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="currentColor" />
                        <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </AnimatedContent>

            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-xl bg-(--text-light)/5 dark:bg-(--text-dark)/5" onClick={() => setIsOpen(false)}>
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-(--text-dark) dark:bg-(--text-light) text-(--text-light) dark:text-(--text-dark) rounded-2xl shadow-2xl p-8" onClick={(event) => event.stopPropagation()}>
                        <button type="button" aria-label="Cerrar" onClick={() => setIsOpen(false)} className="cursor-pointer absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold border-b border-(--text-light)/20 dark:border-(--text-dark)/20 pb-4">{t.credits.title}</h2>
                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold">{t.credits.developer}</h3>
                                <a href="https://github.com/Ismola/jw-hitster" target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-lg bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all font-medium">Ismola</a>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">{t.credits.thanksTitle}</h3>
                                <p className="opacity-90">{t.credits.thanksText}</p>
                                <div className="grid gap-3">
                                    {resources.map(({ href, content }) => (
                                        <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-(--text-light)/5 dark:bg-(--text-dark)/5 hover:bg-(--text-light)/10 dark:hover:bg-(--text-dark)/10 transition-all">
                                            <p className="font-semibold">{content.name}</p>
                                            <p className="text-sm opacity-75">{content.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-(--text-light)/10 dark:border-(--text-dark)/10">
                                <h3 className="text-xl font-semibold">{t.legal?.title}</h3>
                                <p className="text-sm opacity-90">{t.legal?.text}</p>
                                <h4 className="text-lg font-semibold pt-2">{t.cookies?.title}</h4>
                                <p className="text-sm opacity-90">{t.cookies?.text}</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-(--text-light)/20 dark:border-(--text-dark)/20">
                                <h3 className="text-xl font-semibold">{t.credits.contact}</h3>
                                <a href="https://ismola.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-lg bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/20 dark:hover:bg-(--text-dark)/20 transition-all font-medium">{t.credits.resources.portfolio.name}</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
