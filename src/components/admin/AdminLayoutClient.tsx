"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { ToastProvider } from "@/context/ToastContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

interface AdminLayoutClientProps {
    children: React.ReactNode;
    locale: string;
    labels: any; // دیکشنری مخصوص پنل ادمین
}

export default function AdminLayoutClient({ children, locale, labels }: AdminLayoutClientProps) {
    const isRTL = locale === "fa";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div
            dir={isRTL ? "rtl" : "ltr"}
            className="h-screen bg-[#07070a] text-gray-200 flex overflow-hidden"
        >
            <ReactQueryProvider>
                {/* 🪟 بک‌دراپ تاریک برای موبایل (وقتی منو بازه) */}
                {mobileMenuOpen && (
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    />
                )}

                {/* 💻 Sidebar دسکتاپ (همیشه ثابت) */}
                <div className="hidden md:flex">
                    <Sidebar locale={locale} labels={labels} />
                </div>

                {/* 📱 Sidebar موبایل (مخفی شونده با انیمیشن) */}
                <div
                    className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-screen w-[280px] z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen
                        ? "translate-x-0"
                        : isRTL
                            ? "translate-x-full"
                            : "-translate-x-full"
                        }`}
                >
                    <Sidebar
                        locale={locale}
                        labels={labels}
                        onClose={() => setMobileMenuOpen(false)}
                    />
                </div>

                {/* content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header
                        locale={locale}
                        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
                        labels={labels}
                    />

                    <ToastProvider>
                        <main className="flex-1 overflow-y-auto admin-neon-scrollbar p-4 md:p-10 bg-[#07070a]">
                            <div className="max-w-7xl mx-auto w-full">
                                {children}
                            </div>
                        </main>
                    </ToastProvider>
                </div>
            </ReactQueryProvider>
        </div>
    );
}