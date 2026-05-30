// components/admin/messages/MessagePagination.tsx
import React from "react";

interface MessagePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((p: number) => number)) => void;
}

export default function MessagePagination({ currentPage, totalPages, setCurrentPage }: MessagePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-2 font-sans text-xs">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-white/5 bg-black/20 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        قبلی
      </button>

      <div className="flex items-center gap-1 px-2 text-gray-500">
        صفحه <span className="text-emerald-400 font-bold">{currentPage}</span> از {totalPages}
      </div>

      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-white/5 bg-black/20 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        بعدی
      </button>
    </div>
  );
}