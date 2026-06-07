// src/hooks/useTimeSlots.ts
import { useState, useEffect } from "react";
import { getAvailableSlotsAction } from "@/actions/booking";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config"; // 🌟 وارد کردن لیست مرجع و داینامیک

export interface TimeSlot {
  id: string;
  timeLabel: string;
  isBooked: boolean;
}

export function useTimeSlots(selectedDate: Date | null) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsLoading(true);
      
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const res = await getAvailableSlotsAction(dateString);
      const availableSlots: string[] = res.slots || [];

      // 🌟 حالا سیستم به جای اون ۶ تا دونه، کل تایم‌های ۸ صبح تا ۹ شب رو رندر می‌کنه
      const mappedSlots = MASTER_TIME_SLOTS.map((slot, index) => {
        const isSlotTaken = !availableSlots.includes(slot);

        return {
          id: String(index + 1),
          timeLabel: slot,
          isBooked: !res.success ? true : isSlotTaken,
        };
      });

      setTimeSlots(mappedSlots);
      setIsLoading(false);
    };

    fetchSlots();
  }, [selectedDate]);

  return { timeSlots, isLoading };
}