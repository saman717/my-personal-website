"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";
import { MessageType } from "@/types"; // اضافه کردن تایپ اصلی

interface ModalProps {
  message: MessageType | null; // استفاده از تایپ استاندارد به جای اینترفیس دستی
  isOpen: boolean;
  onClose: () => void;
  formatDate: (date: Date | string) => string;
}

export default function MessageDetailModal({ message, isOpen, onClose, formatDate }: ModalProps) {
  const { t } = useTranslate();

  if (!message) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-[#13131a]/80 border border-white/10 p-6 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] backdrop-blur-2xl z-10 text-right"
          >
            {/* ... دکمه بستن و هدر دقیقاً مثل قبل ... */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-white/5 mb-5 text-xs  text-gray-300">
              <div className="flex items-center gap-2">
                <span className=" text-gray-400 font-medium">{message.name}</span>
              </div>
              <div className="flex items-center gap-2" dir="ltr">
                <span className="text-gray-400">{message.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                {/* تغییر دادن date به فیلد واقعی تاریخ (مثلا createdAt) */}
                <span className="text-gray-400">{formatDate(message.createdAt)}</span> 
              </div>
            </div>

            {/* اصلاح فراخوانی متن اصلی پیام */}
            <div className="bg-[#0d0d12]/60 border border-white/5 p-4 rounded-xl min-h-32 text-sm text-gray-300 leading-relaxed overflow-y-auto max-h-60 admin-neon-scrollbar  text-justify">
              {message.message} {/* <--- تغییر از content به message */}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-white rounded-xl transition-all cursor-pointer"
              >
                {t("admin.dashboard.messagesPage.modal.close")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}