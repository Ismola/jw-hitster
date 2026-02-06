import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n.config';

const localeSet = new Set<string>(locales as readonly string[]);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.length > 1 && pathname.endsWith('/')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(0, -1);
        return NextResponse.rewrite(url);
    }

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

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
