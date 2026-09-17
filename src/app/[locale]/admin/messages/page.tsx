import React from "react";
import { getDictionary } from "@/lib/translate";
import MessagesManager from "@/components/admin/messages/MessagesManager";

export default async function AdminMessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <MessagesManager
      locale={locale}
      labels={dict.admin.dashboard.messagesPage}
    />
  );
}