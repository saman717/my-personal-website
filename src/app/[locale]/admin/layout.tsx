import React from "react";
import { getDictionary } from "@/lib/translate";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // ۱. استخراج لوکیل از پارامترهای سرور
    const { locale } = await params;
    
    // ۲. خواندن فایل JSON در سمت سرور
    const dict = await getDictionary(locale);

    return (
        <AdminLayoutClient locale={locale} labels={dict.admin}>
            {children}
        </AdminLayoutClient>
    );
}