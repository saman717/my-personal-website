"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconLoader } from "./icons";
import { useMessages } from "@/hooks/useMessages";
import { useMessageMutations } from "@/hooks/useMessageMutations";
import { MessageType } from "@/types/contact";

import MessageFilters from "./MessageFilters";
import MessageItem from "./MessageItem";
import MessagePagination from "./MessagePagination";
import MessageDetailModal from "./MessageDetailModal";
import { useToast } from "@/context/ToastContext";

// 🌟 اضافه شدن پراپ‌ها به اینترفیس
interface MessagesManagerProps {
  locale: string;
  labels: any;
}

export default function MessagesManager({ locale, labels }: MessagesManagerProps) {
  const loadingToastIdRef = React.useRef<number | null>(null);
  const { showToast, dismissToast, updateToast } = useToast();
  const hasLoadedRef = React.useRef<boolean>(false);
  const isRTL = locale === "fa";

  const {
    isLoading,
    search,
    setSearch,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    selectedMessage,
    setSelectedMessage,
    isModalOpen,
    setIsModalOpen,
    paginatedMessages,
    totalPages,
  } = useMessages();

  React.useEffect(() => {
    if (isLoading) {
      if (!loadingToastIdRef.current) {
        // 🌟 استفاده از متن داینامیک لودینگ
        loadingToastIdRef.current = showToast(labels.loadingToast, "loading-white");
      }
    } else {
      if (loadingToastIdRef.current) {
        // 🌟 استفاده از متن داینامیک موفقیت
        updateToast(loadingToastIdRef.current, labels.successToast, "success");
        loadingToastIdRef.current = null;
        hasLoadedRef.current = true;
      }
    }

    return () => {
      if (loadingToastIdRef.current) {
        dismissToast(loadingToastIdRef.current);
      }
    };
  }, [isLoading, showToast, dismissToast, labels]);

  const { toggleReadMutation, deleteMutation } = useMessageMutations();

  const handleToggleRead = (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleReadMutation.mutate({ id, currentStatus });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleOpenMessage = (msg: MessageType) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (!msg.isRead) {
      toggleReadMutation.mutate({ id: msg.id, currentStatus: false });
    }
  };

  // 🌟 اصلاح هوشمند و سینور فرمت تاریخ بر اساس زبان فعال کاربر
  const formatDateTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    const targetLocale = isRTL ? "fa-IR" : "en-US";

    return `${new Intl.DateTimeFormat(targetLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)} - ${new Intl.DateTimeFormat(targetLocale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)}`;
  };

  return (
    <div className={`w-full flex flex-col gap-5 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          {labels.title}
        </h1>
        <p className="text-xs text-gray-500 font-sans">
          {labels.subtitle}
        </p>
      </div>

      <MessageFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        labels={labels.filters}
      // نکته: اگر دکمه‌های فیلتر هم متغیر هستند، در گام بعد پراپ labels را به آن هم پاس بدهید
      />

      <div className="bg-[#13131a]/20 border border-white/3 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col min-h-[200px] justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-xs text-gray-400 font-sans">
            <div className="text-emerald-500">
              <IconLoader />
            </div>
            <span>...</span>
          </div>
        ) : paginatedMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-12 text-center text-xs text-gray-500 font-sans"
          >
            {labels.noMessages}
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col p-5 gap-3">
            <AnimatePresence mode="popLayout">
              {paginatedMessages.map((msg, index) => (
                <MessageItem
                  key={msg.id}
                  msg={msg}
                  index={index}
                  onOpenMessage={handleOpenMessage}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDelete}
                  formatDate={formatDateTime}
                  labels={labels?.actions}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <MessagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <MessageDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={selectedMessage as any}
        formatDate={formatDateTime}
        locale={locale} // 🌟 پاس دادن لوکال
        labels={labels?.modal} //
      />
    </div>
  );
}