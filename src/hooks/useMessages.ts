// hooks/useMessages.ts
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getContactMessages } from "@/actions/messages";
import { MessageType } from "@/types/contact";

const ITEMS_PER_PAGE = 4;

export function useMessages() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: queryKeys.messages,
    queryFn: async () => {
      const response = await getContactMessages();
      if (!response.success) throw new Error("خطا در دریافت پیام‌ها");
      return response.data as MessageType[];
    },
  });

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const s = search.toLowerCase();
      const matchesSearch =
        msg.name?.toLowerCase().includes(s) ||
        msg.email?.toLowerCase().includes(s) ||
        msg.phone?.toLowerCase().includes(s) ||
        msg.subject?.toLowerCase().includes(s) ||
        msg.message?.toLowerCase().includes(s);

      if (filter === "unread") return matchesSearch && !msg.isRead;
      if (filter === "read") return matchesSearch && msg.isRead;
      return matchesSearch;
    });
  }, [messages, search, filter]);

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);

  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMessages, currentPage]);

  return {
    messages,
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
    filteredMessages,
    paginatedMessages,
    totalPages,
  };
}