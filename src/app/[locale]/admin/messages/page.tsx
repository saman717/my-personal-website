import React from "react";
import MessagesManager from "@/components/admin/messages/MessagesManager";

export default function AdminMessagesPage() {
  return (
    <div className="flex flex-col w-full gap-5 pb-10" dir="rtl">
      {/* لود کردن مستقیم منیجر شیشه‌ای با قابلیت‌های تماماً کلاینت */}
      <MessagesManager />
    </div>
  );
}