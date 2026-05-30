"use client";

import { useTranslate } from "@/hooks/useTranslate";
import { useBookingCalendar, CalendarDay } from "@/hooks/useBookingCalendar";

interface BookingCalendarProps {
  locale: string;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

export default function BookingCalendar({ locale, selectedDate, onDateChange }: BookingCalendarProps) {
  const { t } = useTranslate();
  const isRTL = locale === "fa";
  
  // استفاده از کاستوم هوک
  const { currentMonth, days, nextMonth, prevMonth } = useBookingCalendar(new Date());

  const daysOfWeek = isRTL
    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // فرمت کردن داینامیک نام ماه بر اساس زبان کاربر
  const monthTitle = new Intl.DateTimeFormat(isRTL ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
  }).format(currentMonth);

  const handleDayClick = (day: CalendarDay) => {
    if (day.isBookedFull) return;
    onDateChange(day.date);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full max-w-md bg-[#0d0d12]/60 backdrop-blur-3xl p-6 rounded-2xl border border-white/5 flex flex-col gap-5 select-none">
      <div className="flex justify-between items-center bg-[#111118]/50 px-4 py-2 rounded-xl border border-white/[0.02]">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
        
        <span className="text-sm font-bold text-white tracking-wide">{monthTitle}</span>

        <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day, index) => (
          <span key={index} className="text-[11px] font-medium text-gray-500 uppercase py-1">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isSelected = selectedDate?.getDate() === day.dayNumber && 
                             selectedDate?.getMonth() === day.date.getMonth();

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-medium transition-all duration-200
                ${day.isBookedFull ? "text-gray-600 opacity-30 cursor-not-allowed line-through" : "text-gray-300 hover:bg-white/5 cursor-pointer"}
                ${isSelected ? "border border-emerald-500/80 bg-[#1A1D23] text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold" : ""}
              `}
            >
              <span>{day.dayNumber}</span>
              {day.isAvailable && !day.isBookedFull && !isSelected && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}