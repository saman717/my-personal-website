"use client";

import React, { useEffect } from "react";
import NavLink from "./NavLink";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { usePathname } from "next/navigation"; // 🌟 اضافه شد برای تشخیص تغییر صفحه

// 🌟 پراپ onClose اضافه شد تا لی‌آوت اصلی بتونه سایدبار رو ببنده
export default function Sidebar({ locale, onClose }: { locale: string; onClose?: () => void }) {
    const { t } = useTranslate();
    const isRTL = locale === 'fa';
    const { data: unreadCount = 0 } = useUnreadCount();
    
    // گرفتن مسیر فعلی
    const pathname = usePathname();

    // 🚀 Best Practice: هر زمان که URL تغییر کرد (کاربر روی لینکی کلیک کرد)، سایدبار موبایل بسته شود
    useEffect(() => {
        if (onClose) {
            onClose();
        }
    }, [pathname]);

    return (
        <aside
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`relative w-full md:w-68 h-screen md:h-auto overflow-y-auto bg-[#0d0d12]/60 backdrop-blur-3xl p-4 md:p-6 flex flex-col gap-4 shrink-0 z-20 border-white/[0.03] before:content-[''] before:absolute before:inset-0 ${isRTL ? "before:rounded-l-3xl md:border-l" : "before:rounded-r-3xl md:border-r"} before:border-white/5 before:pointer-events-none before:shadow-[0_0_30px_rgba(16,185,129,0.01)]`}
        >
            {/* 🟣 بخش لوگو و وضعیت گوی نئونی */}
            <div className="flex items-center gap-3.5 pb-4 md:pb-5 border-b border-white/5">
                <div className="relative w-5 h-5 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-white tracking-wide text-sm">{t("admin.console")}</span>
                    <span className="text-[10px] text-gray-500">{t("admin.status")}</span>
                </div>
            </div>

            {/* 🧭 لیست منوها */}
            <div
                dir="ltr"
                className="flex flex-col gap-5 md:gap-6 flex-1 overflow-y-auto admin-neon-scrollbar"
            >
                <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col gap-5 md:gap-6 w-full px-0 md:px-1">

                    {/* دسته اول: مدیریت سایت */}
                    <div className="flex flex-col gap-1">
                        <span className={`px-2 md:px-5 text-[9px] md:text-[10px] text-gray-600 uppercase tracking-wider mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t("admin.categories.site")}
                        </span>
                        <NavLink href={`/${locale}/admin`}>{t("admin.menu.dashboard")}</NavLink>
                        <NavLink
                            href={`/${locale}/admin/messages`}
                            badge={unreadCount > 0 ? `+${unreadCount}` : undefined}
                            badgeStyle={isRTL ? "left-3 md:left-4" : "right-3 md:right-4"}
                        >
                            {t("admin.menu.messages")}
                        </NavLink>
                        <NavLink href={`/${locale}/admin/blog`}>{t("admin.menu.blog")}</NavLink>
                        <NavLink href={`/${locale}/admin/portfolio`}>{t("admin.menu.portfolio")}</NavLink>
                        <NavLink href={`/${locale}/admin/media`}>{t("admin.menu.media")}</NavLink>
                        <NavLink href={`/${locale}/admin/settings`}>{t("admin.menu.settings")}</NavLink>
                    </div>

                    {/* دسته دوم: سیستم عامل زندگی */}
                    <div className="flex flex-col gap-1">
                        <span className={`px-2 md:px-5 text-[9px] md:text-[10px] text-gray-600 uppercase tracking-wider mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t("admin.categories.personal")}
                        </span>
                        <NavLink href={`/${locale}/admin/tasks`}>{t("admin.menu.tasks")}</NavLink>
                        <NavLink href={`/${locale}/admin/bookings`}>{t("admin.menu.Booking")}</NavLink>
                        <NavLink href={`/${locale}/admin/job-hunt`}>{t("admin.menu.jobHunt")}</NavLink>
                        <NavLink href={`/${locale}/admin/growth`}>{t("admin.menu.growth")}</NavLink>
                        <NavLink href={`/${locale}/admin/bots`}>{t("admin.menu.bots")}</NavLink>
                        <NavLink href={`/${locale}/admin/automation`}>{t("admin.menu.automation")}</NavLink>
                    </div>

                </div>
            </div>

            {/* 🚪 دکمه خروج */}
            <div className="pt-2.5 border-t border-white/5">
                <Link
                    href={`/${locale}`}
                    onClick={onClose} // 🌟 اضافه کردن onClose برای اطمینان از بسته شدن سایدبار هنگام خروج
                    className="flex items-center justify-center gap-1 w-full px-4 py-3 rounded-xl text-xs font-medium text-white border border-red-500/20 bg-red-500/5 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.02)] hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                >
                    🚪 {t("admin.exit")}
                </Link>
            </div>
        </aside>
    );
}