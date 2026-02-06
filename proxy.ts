import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

const localeSet = new Set<string>(locales as readonly string[]);
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === '/' || pathname === '') {
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}`;
        return NextResponse.redirect(url);
    }

    const segments = pathname.split('/');
    const first = segments[1];

    if (!localeSet.has(first)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
        return NextResponse.redirect(url);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
