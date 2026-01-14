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
                <Link href={`/${locale}`} className="">
                    <div className="w-9 h-9">
                        <svg className="fill-(--text-light) dark:fill-(--text-dark)" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="40px" height="40px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve">
                            <g>
                                <path d="M74.656,56.818c3.895,3.729,5.788,8.795,5.788,15.491c0,1.104,0.896,2,2,2s2-0.885,2-1.989
		c0-7.736-2.362-13.91-7.022-18.369C66.646,43.639,46.325,44.551,30,45.269c-2.28,0.101-4.461,0.211-6.499,0.28L38.428,30.62
		c0.781-0.781,0.781-2.047,0-2.828s-2.048-0.781-2.828,0L17.479,45.915c-0.375,0.375-0.586,0.884-0.586,1.414
		s0.211,1.039,0.586,1.414l18.123,18.12c0.391,0.391,0.902,0.586,1.414,0.586s1.024-0.195,1.415-0.586
		c0.781-0.781,0.781-2.048,0-2.828L24.142,49.75c1.915-0.11,3.932-0.261,6.033-0.354C44.919,48.748,65.114,47.688,74.656,56.818z"/>
                            </g>
                        </svg>
                    </div>
                </Link>
            </AnimatedContent>
            
            <ThemeSwitcher />
            {/* <LanguageSwitcher /> */}
        </div>
    )
}