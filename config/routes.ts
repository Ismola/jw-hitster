import { Locale, locales } from '@/i18n.config';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>;

const messagesByLocale: Record<Locale, Messages> = {
    en: en as Messages,
    es: es as Messages,
};

// Build Canonical → localized per-locale mapping from message files.
// Keys starting with `slug.` define canonical slug names, e.g. `slug.game`.
const buildSlugMap = (): Record<string, Partial<Record<Locale, string>>> => {
    const map: Record<string, Partial<Record<Locale, string>>> = {};

    for (const loc of locales) {
        const msgs = messagesByLocale[loc] || {};
        for (const [key, value] of Object.entries(msgs)) {
            if (!key.startsWith('slug.')) continue;
            const canonical = key.slice('slug.'.length);
            map[canonical] = map[canonical] || {};
            map[canonical][loc] = value;
        }
    }
    return map;
};

const slugMap = buildSlugMap();

function toCanonicalSegment(segment: string, fromLocale: Locale): string {
    for (const [canonical, perLocale] of Object.entries(slugMap)) {
        if (perLocale[fromLocale] === segment) return canonical;
    }
    return segment;
}

function fromCanonicalSegment(canonical: string, toLocale: Locale): string {
    const perLocale = slugMap[canonical];
    return perLocale?.[toLocale] ?? canonical;
}

export function translatePath(pathname: string, fromLocale: Locale, toLocale: Locale): string {
    if (fromLocale === toLocale) return pathname;

    const segments = pathname.split('/');
    if (segments.length === 0) return `/${toLocale}`;

    // segments[0] is "" due to leading '/'
    segments[1] = toLocale; // swap locale

    // Translate each subsequent segment using canonical mapping
    for (let i = 2; i < segments.length; i++) {
        const seg = segments[i];
        if (!seg) continue;
        const canonical = toCanonicalSegment(seg, fromLocale);
        segments[i] = fromCanonicalSegment(canonical, toLocale);
    }

    const newPath = segments.join('/');
    return newPath || `/${toLocale}`;
}
