"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentMessages } from "@/actions/messages";

interface MessageType {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
  isRead: boolean;
}

interface RecentMessagesCardProps {
  locale: string;
  labels: any; // 🌟 دریافت تمامی لیبل‌ها از طریق پراپ
}

export default function RecentMessagesCard({ locale, labels }: RecentMessagesCardProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const res = await getRecentMessages(3);
      if (res.success && res.data) {
        setMessages(res.data as MessageType[]);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  // 🌟 تابع محاسبه زمان با استفاده از لیبل‌های داینامیک
  const formatTimeAgo = (dateString: Date | string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const minutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return labels.time.now;
    if (minutes < 60) return `${minutes} ${labels.time.minutes}`;
    if (hours < 24) return `${hours} ${labels.time.hours}`;
    return `${days} ${labels.time.days}`;
  };

  return (
    <div className="bg-[#13131a]/40 border border-white/3 backdrop-blur-md rounded-2xl p-6 w-full flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="text-sm font-bold text-white tracking-tight">{labels.title}</h4>
        <Link href={`/${locale}/admin/messages`} className="text-[10px] text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors">
          {labels.viewAll}
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-xs text-gray-500 py-6 text-center">{labels.loading}</div>
        ) : messages.length === 0 ? (
          <div className="text-xs text-gray-500 py-6 text-center">{labels.empty}</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {msg.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">{msg.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono truncate max-w-30">{msg.email}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-500">{formatTimeAgo(msg.createdAt)}</span>
                {!msg.isRead && (
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                    {labels.unread}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}