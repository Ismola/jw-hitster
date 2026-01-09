import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { messages } from "@/config/text";
import ThemeSwitcher from "./ThemeSwitcher";


export default function Header() {
    const pathname = usePathname();
    const locale = (pathname.split('/')[1] || 'es') as keyof typeof messages;
    const t = messages[locale] || messages.en;
    return (
        <div className="flex items-center justify-between p-4">
            <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-700">
                ← Volver
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />
        </div>
    )
}