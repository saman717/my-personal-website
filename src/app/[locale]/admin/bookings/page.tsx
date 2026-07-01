import React from "react";
import { getDictionary } from "@/lib/translate";
import AdminBookingsPageContent from "@/components/admin/booking/AdminBookingsPageContent";

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // ۱. فچ کردن دیکشنری در لایه سرور
  const dict = await getDictionary(locale);

  return (
    <AdminBookingsPageContent 
      locale={locale} 
      labels={dict.adminBooking} // 🌟 تزریق یکپارچه دیتا
    />
  );
}