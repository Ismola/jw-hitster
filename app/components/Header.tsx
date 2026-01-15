import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { messages } from "@/config/text";
import ThemeSwitcher from "./ThemeSwitcher";
import AnimatedContent from "./ReactBits/AnimatedContent";


export default function Header() {
    const pathname = usePathname();
    const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
    // const t = messages[locale] || messages.en;
    return (
        <div className="flex items-center justify-between p-4">
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
                delay={.25}
            >
                <Link href={`/${locale}`} className="flex items-center justify-center hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10">
                        <svg className="fill-(--text-light) dark:fill-(--text-dark) w-full h-full" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 30 30" xmlSpace="preserve">
                            <path d="M15.281 7.188v17.594l-15.281-8.781z"></path>
                        </svg>
                    </div>
                </Link>
            </AnimatedContent>

            <ThemeSwitcher />
            {/* <LanguageSwitcher /> */}
        </div>
    )
}