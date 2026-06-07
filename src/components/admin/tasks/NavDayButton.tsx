"use client";

import React from "react";

interface NavDayButtonProps {
  date: Date;
  selectedDate: Date;
  currentLocale: string;
  onSelectDate: (date: Date) => void;
}

export default function NavDayButton({ date, selectedDate, currentLocale, onSelectDate }: NavDayButtonProps) {
  // تولید بومی نام و عدد روز بدون نیاز به هاردکد کردن متون
  const dayName = new Intl.DateTimeFormat(currentLocale, { weekday: "short" }).format(date);
  const dayNumber = new Intl.DateTimeFormat(currentLocale, { day: "numeric" }).format(date);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isSelected = isSameDay(date, selectedDate);
  const isToday = isSameDay(date, new Date());

  return (
    <button
      type="button"
      onClick={() => onSelectDate(date)}
      className={`flex flex-col items-center justify-center py-2 px-3 md:px-5 rounded-xl border transition-all min-w-[60px] md:min-w-[70px] ${
        isSelected 
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
          : isToday
            ? "bg-white/5 border-white/10 hover:border-white/20"
            : "bg-transparent border-transparent hover:bg-white/5"
      }`}
    >
      {/* نام روز */}
      <span className={`text-[10px] font-bold mb-1 ${isSelected ? "text-emerald-400" : "text-gray-500"}`}>
        {dayName}
      </span>
      
      {/* عدد روز (در حالت fa کاملاً با فونت بومی فارسی رندر می‌شود) */}
      <span className={`text-base md:text-lg font-bold ${isSelected ? "text-white" : isToday ? "text-gray-200" : "text-gray-400"}`}>
        {dayNumber}
      </span>
      
      {/* نقطه نشان‌دهنده روز جاری */}
      {isToday && !isSelected && (
        <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1 shadow-[0_0_5px_#10b981]" />
      )}
    </button>
  );
}