import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { messages } from "@/config/text";
import Background from "../components/Background";
import { ThemeProvider } from "@/app/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale ?? 'es') as keyof typeof messages;
  const t = messages[locale] || messages.en;
  return {
    title: "JW Hitster",
    description: t.description,
    other: {
      language: locale,
    },
    creator: "Ismola",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale ?? 'es';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => { try {
            var t = localStorage.getItem('theme');
            var m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            var isDark = t === 'dark' || (!t || t === 'system') && m;
            document.documentElement.classList.toggle('dark', isDark);
          } catch (e) {} })();`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Background />
          <main className="absolute w-full top-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
