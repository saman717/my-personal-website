"use client";

import React, { useState, useEffect } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { getMonthAvailabilityAction } from "@/actions/booking";

interface BookingCalendarProps {
  locale: string;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

export default function BookingCalendar({ locale, selectedDate, onDateChange }: BookingCalendarProps) {
  const { t } = useTranslate();
  const isRTL = locale === "fa";
  const currentLocale = isRTL ? "fa-IR" : "en-US";

  // 🗓️ استیت ماه جاری (پایه اصلی محاسبات ادمین)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0); // گارد امنیتی تایم‌زون
    return d;
  });

  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [fullDays, setFullDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 📞 دریافت آنی وضعیت شلوغی ماه از بک‌اِند (دقیقاً مثل ادمین)
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const monthForBackend = currentMonth.getMonth() + 1;
        const res = await getMonthAvailabilityAction(year, monthForBackend);

        setBlockedDays(res.blockedDays || []);
        setFullDays(res.fullDays || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [currentMonth]);

  // 🧮 تولید هوشمند ۷ روزِ ردیف‌های تقویم متناسب با ماه جاری
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();

  // تعداد روزهای ماه جاری
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // پیدا کردن روزِ شروعِ ماه برای تراز کردن گرید
  const firstDayInstance = new Date(year, monthIndex, 1);
  const startDayOfWeek = firstDayInstance.getDay(); // 0 (یکشنبه) تا 6 (شنبه)

  // تولید پویای آرایه روزها
  const daysArray = Array.from({ length: totalDaysInMonth }).map((_, i) => {
    const d = new Date(year, monthIndex, i + 1);
    d.setHours(12, 0, 0, 0); // ثبات کامل ساعت برای جلوگیری از پرش تاریخ
    return d;
  });

  // ناوبری ساده و روان ماه‌ها
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, monthIndex - 1, 1, 12, 0, 0));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, monthIndex + 1, 1, 12, 0, 0));
  };

  // فرمت داینامیک عنوان ماه با Intl (همان جادوی ادمین)
  const monthTitle = new Intl.DateTimeFormat(isRTL ? "fa-IR-u-ca-persian" : "en-US", {
    year: "numeric",
    month: "long",
  }).format(currentMonth);

  const daysOfWeek = isRTL
    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // گارد تراز کلاینت: تبدیل روزِ شروعِ میلادی به خانه‌های خالیِ هماهنگ با شنبه در ایران
  const emptySlotsCount = isRTL
    ? (startDayOfWeek === 6 ? 0 : startDayOfWeek + 1)
    : startDayOfWeek;

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

        {/* رندر خانه‌های خالی اول ماه */}
        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square opacity-0 pointer-events-none" />
        ))}

        {/* رندر روزهای واقعی */}
        {daysArray.map((dateObj, index) => {
          const isSelected = isSameDay(selectedDate, dateObj);

          // فرمت دیتابیسی تاریخ YYYY-MM-DD
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

          // شماره روز نمایشی (اگر فارسی است به شمسی و اگر انگلیسی است به میلادی تبدیل می‌شود)
          const displayDayNumber = new Intl.DateTimeFormat(currentLocale, { day: "numeric" }).format(dateObj);

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