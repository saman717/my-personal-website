"use client";

import React, { useState, useEffect } from "react";
import NavDayButton from "./NavDayButton";

interface WeeklyNavProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  locale: string;
}

export default function WeeklyNav({ selectedDate, onSelectDate, locale }: WeeklyNavProps) {
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const currentLocale = locale === "fa" ? "fa-IR" : "en-US";

  // 🌟 فیکس کردن باگ پنهان: گوش دادن دقیق به تغییرات تاریخ انتخابی از بیرون کامپوننت
  useEffect(() => {
    const today = new Date(selectedDate);
    const dayOfWeek = today.getDay(); 
    const start = new Date(today);
    
    // کالیبره کردن شروع هفته: تقویم شمسی از شنبه (۶) و میلادی معمولاً از یکشنبه (۰) یا دوشنبه
    start.setDate(today.getDate() - (dayOfWeek === 6 ? 0 : dayOfWeek + 1)); 
    start.setHours(0, 0, 0, 0);
    setWeekStart(start);
  }, [selectedDate]); // 🌟 اضافه شدن وابستگی برای جابجایی هوشمند

  // تولید آرایه ۷ روزه هفته جاری
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
  };

  return (
    <div className="flex items-center justify-between bg-[#0d0d12]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-3 md:p-4 w-full">
      {/* دکمه هفته قبل */}
      <button 
        type="button"
        onClick={handlePrevWeek}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#07070a] border border-white/5 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400 transition-all transform hover:scale-105 shrink-0"
      >
        {locale === "fa" ? "▶" : "◀"}
      </button>

      {/* اسکرول‌بار افقی شیک و رسپانسیو روزهای هفته */}
      <div className="flex-1 flex justify-between px-2 md:px-6 gap-2 overflow-x-auto admin-neon-scrollbar">
        {weekDays.map((date, index) => (
          <NavDayButton
            key={index}
            date={date}
            selectedDate={selectedDate}
            currentLocale={currentLocale}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>

      {/* دکمه هفته بعد */}
      <button 
        type="button"
        onClick={handleNextWeek}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#07070a] border border-white/5 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400 transition-all transform hover:scale-105 shrink-0"
      >
        {locale === "fa" ? "◀" : "▶"}
      </button>
    </div>
  );
}