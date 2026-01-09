export const defaultLocale = 'es';
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromHeader(acceptLanguage: string): Locale {
    if (!acceptLanguage) return defaultLocale;

    const preferredLanguage = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase();

    return locales.includes(preferredLanguage as Locale)
        ? (preferredLanguage as Locale)
        : defaultLocale;
}
