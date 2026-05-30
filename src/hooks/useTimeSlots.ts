// src/hooks/useTimeSlots.ts
import { useState, useEffect } from "react";

export interface TimeSlot {
  id: string; // 👈 این فیلد اضافه شد تا خطای key رفع شود
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

    setIsLoading(true);
    
    const MASTER_SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "03:00 PM", "04:30 PM"];
    
    const mappedSlots = MASTER_SLOTS.map((slot, index) => ({
      id: String(index + 1), // 👈 اختصاص یک آیدی یونیک
      timeLabel: slot,
      isBooked: false, 
    }));

    setTimeSlots(mappedSlots);
    setIsLoading(false);
  }, [selectedDate]);

  return { timeSlots, isLoading };
}