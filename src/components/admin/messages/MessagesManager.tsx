"use client";

// components/admin/messages/MessagesManager.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";
import { IconLoader } from "./icons";
import { useMessages } from "@/hooks/useMessages";
import { useMessageMutations } from "@/hooks/useMessageMutations";
import { MessageType } from "@/types/types";


import MessageFilters from "./MessageFilters";
import MessageItem from "./MessageItem";
import MessagePagination from "./MessagePagination";
import MessageDetailModal from "./MessageDetailModal";
import { useToast } from "@/context/ToastContext";
export default function MessagesManager() {
  const loadingToastIdRef = React.useRef<number | null>(null);
  const { showToast, dismissToast, updateToast } = useToast();
  const hasLoadedRef = React.useRef<boolean>(false);
  const { t } = useTranslate();

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
      // اگر کامپوننت در حال لود اولیه بود و از قبل توستی نساخته بودیم:
      if (!loadingToastIdRef.current) {
        loadingToastIdRef.current = showToast("در حال بارگذاری پیام‌ها...", "loading-white");
      }
    } else {
      // وقتی لود تمام شد: توست لودینگ سفید را دیسمیس و حذف کن
      if (loadingToastIdRef.current) {
        updateToast(loadingToastIdRef.current, "پیام‌ها با موفقیت بارگذاری شدند.", "success");

        // ✅ حالا با خیال راحت رفرنس لودینگ رو null کن تا در ری‌رندرهای بعدی تداخل ایجاد نکنه
        loadingToastIdRef.current = null;
        hasLoadedRef.current = true;
      }
    }

    // کلین‌آپ برای زمانی که کاربر قبل از اتمام لود از صفحه خارج می‌شود
    return () => {
      if (loadingToastIdRef.current) {
        dismissToast(loadingToastIdRef.current);
      }
    };
  }, [isLoading, showToast, dismissToast]);

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

  const formatDateTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    return `${new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)} - ${new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)}`;
  };

  return (
    <div className="w-full flex flex-col gap-5 text-right">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          {t("admin.dashboard.messagesPage.title")}
        </h1>
        <p className="text-xs text-gray-500 font-sans">
          {t("admin.dashboard.messagesPage.subtitle")}
        </p>
      </div>

      <MessageFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="bg-[#13131a]/20 border border-white/[0.03] rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col min-h-[200px] justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-xs text-gray-400 font-sans">
            <div className="text-emerald-500">
              <IconLoader />
            </div>
            <span>...</span>
          </div>
        ) : paginatedMessages.length === 0 ? (
          // ✅ وضعیت خالی را از AnimatePresence خارج کردیم تا محاسبات ابعاد مطلق (position absolute) آن را خراب نکند
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-12 text-center text-xs text-gray-500 font-sans"
          >
            {t("admin.dashboard.messagesPage.noMessages")}
          </motion.div>
        ) : (
          // ✅ انیمیشن‌های حذف و جابجایی آیتم‌ها فقط زمانی فعال می‌شوند که واقعاً پیامی در لیست باشد
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
      />
    </div>
  );
}