import React from "react";
import { getDictionary } from "@/lib/translate";
import AdminTasksPageContent from "@/components/admin/tasks/AdminTasksPageContent";

export default async function AdminTasksPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // ۱. خواندن فایل لکالیزیشن در سرور
  const dict = await getDictionary(locale);

  return (
    <AdminTasksPageContent 
      locale={locale} 
      labels={dict.adminTask} // ⚡️ اصلاح شد: فرستادن مستقیم ساختار درختی ادمین تسک
    />
  );
}