"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconCircle, IconCheck } from "./icons";
import { useTranslate } from "@/hooks/useTranslate";
import { MessageType } from "@/types/types";

interface MessageItemProps {
  msg: MessageType;
  index: number;
  onOpenMessage: (msg: MessageType) => void;
  onToggleRead: (id: string, currentStatus: boolean, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  formatDate: (date: Date | string) => string;
}

export default function MessageItem({ msg, index, onOpenMessage, onToggleRead, onDelete, formatDate }: MessageItemProps) {
  const { t } = useTranslate();

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      onClick={() => onOpenMessage(msg)}
      // 🔴 تمام شدوهای رنگی حذف شدند. منطق خط زیر با المان مجازی کاملاً هماهنگ با rounded کارت‌هاست:
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-white/[0.03] last:border-0 cursor-pointer transition-all hover:bg-white/[0.02] group relative overflow-hidden ${!msg.isRead
          ? "bg-emerald-500/[0.02] z-1 before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-emerald-500"
          : ""
        }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-1">
        {/* نقطه کوچک وضعیت */}
        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${!msg.isRead ? "bg-emerald-400" : "bg-transparent"}`} />
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{msg.name}</span>
            <span className="text-[10px] text-gray-500 font-mono truncate hidden md:block" dir="ltr">{msg.email}</span>
            {msg.phone && <span className="text-[10px] text-gray-500 font-mono truncate hidden lg:block" dir="ltr">{msg.phone}</span>}
          </div>
          <p className="text-xs font-semibold text-gray-400 group-hover:text-gray-300 transition-colors truncate max-w-xl">
            <span className="text-emerald-400/90 font-bold">{msg.subject}</span> — <span className="text-gray-500 font-normal">{msg.message}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 font-sans text-[10px]">
        <span className="text-gray-500 bg-white/[0.02] px-2 py-1 rounded-md border border-white/[0.02]">
          {formatDate(msg.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => onToggleRead(msg.id, msg.isRead, e)}
            title={msg.isRead ? t("admin.dashboard.messagesPage.actions.markUnread") : t("admin.dashboard.messagesPage.actions.markRead")}
            className={`p-2 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all cursor-pointer ${!msg.isRead ? "text-gray-400 hover:text-emerald-400" : "text-emerald-500 hover:text-gray-400"
              }`}
          >
            {!msg.isRead ? <IconCircle /> : <IconCheck />}
          </button>

          <button
            onClick={(e) => onDelete(msg.id, e)}
            title={t("admin.dashboard.messagesPage.actions.delete")}
            className="p-2 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}