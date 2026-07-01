"use client";

import React from "react";
import { IconSearch } from "./icons";

interface MessageFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  filter: "all" | "unread" | "read";
  setFilter: (val: "all" | "unread" | "read") => void;
  labels: any; // 🌟 اضافه کردن لیبل‌ها
}

export default function 
  ({ 
  search, 
  setSearch, 
  filter, 
  setFilter, 
  labels 
}: MessageFiltersProps) {
  
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#13131a]/30 border border-white/[0.03] p-4 rounded-2xl backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          <IconSearch />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full pl-4 pr-11 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 transition-all font-sans"
        />
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-black/20 border border-white/5 rounded-xl self-start font-sans">
        {(["all", "unread", "read"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === tab
                ? "bg-[#1A1D23] text-emerald-400 border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {labels[tab]} {/* 🌟 خواندن مستقیم از لیبل‌ها */}
          </button>
        ))}
      </div>
    </div>
  );
}