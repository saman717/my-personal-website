"use client";

import React from "react";
import { useTimeSlots } from "@/hooks/useTimeSlots";

interface BookingTimeSlotsProps {
  locale: string;
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  labels: any; 
}

export default function BookingTimeSlots({ locale, selectedDate, selectedTime, onTimeSelect, labels }: BookingTimeSlotsProps) {
  const isRTL = locale === "fa";
  const { timeSlots, isLoading } = useTimeSlots(selectedDate);
  const tsLabels = labels?.timeSlots || {};

  // 🌟 هماهنگ‌سازی نمایش تاریخ با تقویم (میلادی با حروف فارسی)
  const formattedDate = new Intl.DateTimeFormat(isRTL ? "fa-IR-u-ca-gregory" : "en-US", {
    month: "long", day: "numeric",
  }).format(selectedDate);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full max-w-md bg-[#0d0d12]/60 backdrop-blur-3xl p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <span className="text-xs font-semibold text-gray-400 uppercase">{tsLabels.selectTime || "انتخاب زمان"}</span>
        <span className="text-xs font-medium text-emerald-400">{formattedDate}</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
           <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.timeLabel;
            return (
              <button
                key={slot.id}
                disabled={slot.isBooked}
                onClick={() => onTimeSelect(slot.timeLabel)}
                // 🌟 استایل‌های شیکِ نئونی کاملاً برگشت
                className={`relative flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                  ${slot.isBooked 
                    ? "bg-white/5 text-gray-600 opacity-40 cursor-not-allowed border border-transparent" 
                    : "border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white"}
                  ${isSelected 
                    ? "bg-emerald-500 text-[#07070a] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:text-[#07070a]" 
                    : ""}
                `}
              >
                {slot.timeLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}