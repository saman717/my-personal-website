import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/translate';
import GitHubIcon from '../../../../public/icons/Github.svg';
import Linkdin from '../../../../public/icons/Linkdin.svg';
import Telegram from '../../../../public/icons/Telegram.svg';
import Instageram from '../../../../public/icons/Instageram.svg';
import WhatsApp from '../../../../public/icons/WhatsApp.svg';
import Bale from '../../../../public/icons/Bale.svg';

// --- Types ---
interface FooterProps {
    locale: string;
}

interface SocialLink {
    id: string;
    label: Record<'fa' | 'en', string>;
    href: string;
    icon?: React.ReactNode;
}

interface NavLink {
    id: string;
    label: Record<'fa' | 'en', string>;
    href: string;
}

// --- Data Configuration ---
const QUICK_LINKS: NavLink[] = [
    { id: 'home', label: { fa: 'صفحه اصلی', en: 'Home' }, href: '/' },
    { id: 'about', label: { fa: 'درباره من', en: 'About Me' }, href: '#about' },
    { id: 'projects', label: { fa: 'پروژه‌ها', en: 'Projects' }, href: '#projects' },
    { id: 'contact', label: { fa: 'تماس با من', en: 'Contact' }, href: '#contact' },
];

const SOCIAL_LINKS: SocialLink[] = [
    { id: 'github', label: { fa: 'گیت هاب', en: 'GitHub' }, href: 'https://github.com/samankhoshnood', icon: <GitHubIcon className="size-8" /> },
    { id: 'whatsapp', label: { fa: 'واتس آپ', en: 'WhatsApp' }, href: '#',icon: <WhatsApp className="size-8 text-[#25D366]" /> },
    { id: 'linkedin', label: { fa: 'لینکدین', en: 'LinkedIn' }, href: '#', icon: <Linkdin className="size-8 text-blue-700" /> },
    { id: 'bale', label: { fa: 'بله', en: 'Bale' }, href: '#',icon: <Bale className="size-8 text-[#00BFA5]" /> },
    { id: 'telegram', label: { fa: 'تلگرام', en: 'Telegram' }, href: '#', icon: <Telegram className="size-8 text-[#0088cc]" /> },
    { id: 'instagram', label: { fa: 'اینستاگرام', en: 'Instagram' }, href: '#',icon: <Instageram className="size-8 text-[#E4405F]" /> },
];

export default async function Footer({ locale }: FooterProps) {
    const dict = await getDictionary(locale);
    const t = dict.footer;
    const isRTL = locale === 'fa';

    const langKey = isRTL ? 'fa' : 'en';

    return (
        <footer
            className="w-full bg-[#1E1E24]/70 backdrop-blur-3xl shadow-lg shadow-black/20 text-white/90 border-t border-white/10 mt-30"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 ${isRTL ? 'md:divide-x' : ''} md:divide-x md:divide-white/20`}>

                    {/* ستون اول: معرفی */}
                    <section className="flex flex-col items-center md:px-8">
                        <h2 className="text-2xl font-bold tracking-wide">{t.name}</h2>
                        <div className="w-[60%] h-px bg-white/30 my-4" />
                        <h3 className="text-lg font-medium text-gray-200 mb-4">{t.role}</h3>
                        <p className="text-sm leading-8 text-gray-400 text-justify md:text-center">
                            {t.description}
                        </p>
                    </section>

                    {/* ستون دوم: دسترسی سریع */}
                    <section className="flex flex-col items-center md:px-8">
                        <h3 className="text-xl font-semibold tracking-wide">{t.quickLinksTitle}</h3>
                        <div className="w-[60%] h-px bg-white/30 my-4" />
                        <nav className="w-full mt-2" aria-label="Footer Navigation">
                            <ul className="grid grid-cols-1 gap-y-4 gap-x-2 text-sm  text-gray-300">
                                {QUICK_LINKS.map((link) => (
                                    <li key={link.id} className="flex justify-center">
                                        <Link
                                            href={link.href}
                                            className="hover:text-white transition-colors duration-300 relative group"
                                        >
                                            {link.label[langKey]}
                                            <span className={`absolute -bottom-1 w-0 h-px bg-white transition-all delay-150 duration-300 group-hover:w-full ${isRTL ? "right-0" : "left-0"}`} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>

                    {/* ستون سوم: شبکه‌های اجتماعی */}
                    <section className="flex flex-col items-center md:px-8">
                        <h3 className="text-xl font-semibold tracking-wide">{t.socialsTitle}</h3>
                        <div className="w-[60%] h-px bg-white/30 my-4" />
                        <ul className="w-fit mx-auto grid grid-cols-2 gap-y-6 gap-x-10 md:gap-x-12 mt-2">
                            {SOCIAL_LINKS.map((social) => (
                                <li key={social.id} className="flex justify-start items-center">
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label[langKey]}
                                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors duration-300 group"
                                    >
                                        <div className="size-10 shrink-0 rounded-md flex items-center justify-center group-hover:border-white transition-colors">
                                            {social.icon ? social.icon : null}
                                        </div>
                                        <span className="whitespace-nowrap">{social.label[langKey]}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            {/* کپی‌رایت */}
            <div className="w-full bg-[#1E1E24] backdrop-blur-3xl shadow-lg shadow-black/20 py-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} {isRTL ? 'تمام حقوق محفوظ است.' : 'All rights reserved.'}
            </div>
        </footer>
    );
}