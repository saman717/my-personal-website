// src/hooks/useBookingCalendar.ts
import { useState, useEffect } from "react";

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isAvailable: boolean;
  isBookedFull: boolean;
}

export function useBookingCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [days, setDays] = useState<CalendarDay[]>([]);

  const generateDays = (monthDate: Date) => {
    const newDays: CalendarDay[] = [];
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    
    // محاسبه تعداد روزهای ماه جاری
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      newDays.push({
        date: new Date(year, month, i),
        dayNumber: i,
        isAvailable: true,    // موقتاً همه روزها نقطه سبز دارند و در دسترس هستند
        isBookedFull: false,  // موقتاً هیچ روزی خط‌خورده و پر نیست
      });
    }
    setDays(newDays);
  };

  useEffect(() => {
    generateDays(currentMonth);
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));

  return { currentMonth, days, nextMonth, prevMonth };
}