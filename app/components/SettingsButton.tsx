'use client';

import { Settings, Sparkles, Waves, X } from 'lucide-react';
import { useState } from 'react';
import { messages } from '@/config/text';
import { usePreferences } from './PreferencesProvider';
import AnimatedContent from './ReactBits/AnimatedContent';

type Locale = keyof typeof messages;

export default function SettingsButton({ locale }: { locale: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    const { animationsEnabled, backgroundEnabled, setAnimationsEnabled, setBackgroundEnabled } = usePreferences();
    const t = messages[locale] || messages.en;

    const options = [
        {
            label: t.settings.animations,
            description: t.settings.animationsDescription,
            enabled: animationsEnabled,
            setEnabled: setAnimationsEnabled,
            Icon: Sparkles,
        },
        {
            label: t.settings.background,
            description: t.settings.backgroundDescription,
            enabled: backgroundEnabled,
            setEnabled: setBackgroundEnabled,
            Icon: Waves,
        },
    ];

    return (
        <>
            <AnimatedContent distance={150} direction="vertical" duration={0.5} delay={0.75} className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label={t.settings.open}
                    className="cursor-pointer text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl bg-(--text-light)/10 dark:bg-(--text-dark)/10 hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40 hover:scale-105 p-2 rounded-full w-9 h-9 transition-all duration-300"
                >
                    <Settings className="h-full w-full" aria-hidden="true" />
                </button>
            </AnimatedContent>

            {isOpen && (
                <div
                    className="fixed inset-0 z-120 flex items-center justify-center p-4 backdrop-blur-xl bg-(--text-light)/10 dark:bg-(--text-dark)/10"
                    onClick={() => setIsOpen(false)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="settings-title"
                        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-(--text-dark) p-6 text-(--text-light) shadow-2xl dark:bg-(--text-light) dark:text-(--text-dark) md:p-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label={t.settings.close}
                            className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-white/10 dark:hover:bg-black/10"
                        >
                            <X aria-hidden="true" />
                        </button>
                        <h2 id="settings-title" className="pr-12 text-3xl font-bold">{t.settings.title}</h2>
                        <p className="mt-2 text-sm opacity-70">{t.settings.description}</p>

                        <div className="mt-8 space-y-3">
                            {options.map(({ label, description, enabled, setEnabled, Icon }) => (
                                <div key={label} className="flex items-center gap-4 rounded-2xl bg-white/8 p-4 dark:bg-black/8">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-black/10">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-semibold">{label}</span>
                                        <span className="block text-sm opacity-65">{description}</span>
                                    </span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={enabled}
                                        aria-label={label}
                                        onClick={() => setEnabled(!enabled)}
                                        className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full border transition-colors ${enabled ? 'border-emerald-300/40 bg-emerald-500' : 'border-white/15 bg-white/15 dark:border-black/15 dark:bg-black/15'}`}
                                    >
                                        <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
