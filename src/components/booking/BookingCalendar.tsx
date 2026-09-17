"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getMonthAvailabilityAction } from "@/actions/booking";

interface BookingCalendarProps {
  locale: string;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  labels?: any; 
}

export default function BookingCalendar({ locale, selectedDate, onDateChange, labels }: BookingCalendarProps) {
  const isRTL = locale === "fa";
  const calLabels = labels?.calendar || {};

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0); 
    return d;
  });

  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [fullDays, setFullDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 موتور هوشمندِ تقویم دوگانه (کاملاً نیتیو و بدون پکیج سنگین)
  const { firstDay, lastDay, totalDays, startDayOfWeek, monthTitle } = useMemo(() => {
    const localeStr = isRTL ? "fa-IR" : "en-US";
    const getMonthYear = (d: Date) => new Intl.DateTimeFormat(localeStr, { year: "numeric", month: "numeric" }).format(d);
    
    const targetMonthYear = getMonthYear(currentMonth);

    // ۱. پیدا کردن دقیقِ روز اولِ این ماه (شمسی یا میلادی)
    let first = new Date(currentMonth);
    while (true) {
      const prev = new Date(first);
      prev.setDate(prev.getDate() - 1);
      if (getMonthYear(prev) !== targetMonthYear) break;
      first = prev;
    }

    // ۲. پیدا کردن دقیقِ روز آخرِ این ماه
    let last = new Date(currentMonth);
    while (true) {
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      if (getMonthYear(next) !== targetMonthYear) break;
      last = next;
    }

    const total = Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const title = new Intl.DateTimeFormat(localeStr, { year: "numeric", month: "long" }).format(currentMonth);

    return { firstDay: first, lastDay: last, totalDays: total, startDayOfWeek: first.getDay(), monthTitle: title };
  }, [currentMonth, isRTL]);

  // 📞 دریافت هوشمند اطلاعات از بک‌اِند (ترکیب دو ماه میلادی برای پوشش کامل یک ماه شمسی)
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const m1 = firstDay.getMonth() + 1;
        const y1 = firstDay.getFullYear();
        const m2 = lastDay.getMonth() + 1;
        const y2 = lastDay.getFullYear();

        const res1 = await getMonthAvailabilityAction(y1, m1);
        let blocked = res1.blockedDays || [];
        let full = res1.fullDays || [];

        // اگر ماه شمسی ما بین دو ماه میلادی مشترک بود، هر دو را فچ کرده و ترکیب می‌کنیم
        if (m1 !== m2 || y1 !== y2) {
          const res2 = await getMonthAvailabilityAction(y2, m2);
          blocked = [...blocked, ...(res2.blockedDays || [])];
          full = [...full, ...(res2.fullDays || [])];
        }

        setBlockedDays([...new Set(blocked)]);
        setFullDays([...new Set(full)]);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [firstDay.getTime(), lastDay.getTime()]);

  // 🧮 تولید آرایه دقیق روزها از ۱ تا ۳۱
  const daysArray = Array.from({ length: totalDays }).map((_, i) => {
    const d = new Date(firstDay);
    d.setDate(firstDay.getDate() + i);
    d.setHours(12, 0, 0, 0);
    return d;
  });

  const handlePrevMonth = () => {
    const prev = new Date(firstDay);
    prev.setDate(prev.getDate() - 1);
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(lastDay);
    next.setDate(next.getDate() + 1);
    setCurrentMonth(next);
  };

  const daysOfWeek = isRTL
    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // 📐 تراز کردن روز اول هفته متناسب با زبان (ایران=شنبه ، انگلیسی=یکشنبه)
  const emptySlotsCount = isRTL ? (startDayOfWeek + 1) % 7 : startDayOfWeek;

  const isSameDay = (d1: Date | null, d2: Date) => {
    if (!d1) return false;
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full max-w-md bg-[#0d0d12]/60 backdrop-blur-3xl p-6 rounded-2xl border border-white/5 flex flex-col gap-5 select-none relative">

      {/* هدر ناوبری ماه */}
      <div className="flex justify-between items-center bg-[#111118]/50 px-4 py-2 rounded-xl border border-white/[0.02]">
        <button onClick={handlePrevMonth} type="button" className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-all transform hover:scale-105">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>

        <span className="text-sm font-bold text-white tracking-wide">{monthTitle}</span>

        <button onClick={handleNextMonth} type="button" className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-all transform hover:scale-105">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      {/* نام روزهای هفته */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day, index) => (
          <span key={index} className={`text-[11px] font-bold uppercase py-1 ${isRTL && index === 6 ? "text-red-500/60" : "text-gray-500"}`}>
            {day}
          </span>
        ))}
      </div>

      {/* گرید روزها */}
      <div className={`grid grid-cols-7 gap-2 ${isLoading ? "opacity-30 pointer-events-none" : ""} transition-opacity`}>

        {/* خانه‌های خالی برای تراز کردن روز اول ماه */}
        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square opacity-0 pointer-events-none" />
        ))}

        {daysArray.map((dateObj, index) => {
          const isSelected = isSameDay(selectedDate, dateObj);

          // فرمت دیتابیس برای مطابقت با روزهای پر شده
          const y = dateObj.getFullYear();
          const m = String(dateObj.getMonth() + 1).padStart(2, "0");
          const d = String(dateObj.getDate()).padStart(2, "0");
          const dateString = `${y}-${m}-${d}`;

          const isBlocked = blockedDays.includes(dateString);
          const isFull = fullDays.includes(dateString);

          const compareDate = new Date(dateObj);
          compareDate.setHours(0, 0, 0, 0);
          const isPast = compareDate < today;

          const isAvailable = !isBlocked && !isFull && !isPast;

          // 🌟 عدد روز حالا همیشه درست (۱ تا ۳۱) رندر می‌شود
          const displayDayNumber = new Intl.DateTimeFormat(isRTL ? "fa-IR" : "en-US", { day: "numeric" }).format(dateObj);

          return (
            <div
              key={index}
              onClick={() => isAvailable && onDateChange(dateObj)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all duration-200
                ${isPast
                  ? "text-gray-700 opacity-20 cursor-not-allowed bg-white/[0.01]"
                  : isBlocked || isFull
                    ? "text-gray-600 bg-red-500/5 border border-red-500/10 opacity-40 cursor-not-allowed line-through"
                    : "text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer"
                }
                ${isSelected ? "border border-emerald-500/80 bg-[#1A1D23] text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold scale-105 z-10" : ""}
              `}
            >
              <span>{displayDayNumber}</span>
              {isAvailable && !isSelected && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}