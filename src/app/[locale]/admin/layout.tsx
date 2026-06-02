"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation"; // ۱. این هوک را اضافه کردیم
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { ToastProvider } from "@/context/ToastContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ۲. دریافت پارامترها به صورت کلاینت‌ساید
    const params = useParams();
    const locale = (params.locale as string) || "fa"; // استخراج لوکیل از آدرس

    const isRTL = locale === "fa";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div
            dir={isRTL ? "rtl" : "ltr"}
            className="h-screen bg-[#07070a] text-gray-200 flex overflow-hidden"
        >
            <ReactQueryProvider>
                {/* overlay موبایل */}
                {mobileMenuOpen && (
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}

                {/* sidebar دسکتاپ */}
                <div className="hidden md:flex">
                    <Sidebar locale={locale} />
                </div>

                {/* sidebar موبایل */}
                <div
                    className={`fixed top-0 ${isRTL ? "right-0" : "left-0"
                        } h-screen w-[280px] z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen
                            ? "translate-x-0"
                            : isRTL
                                ? "translate-x-full"
                                : "-translate-x-false"
                        }`}
                >
                    <Sidebar locale={locale} />
                </div>

                {/* content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header
                        locale={locale}
                        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
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