// app/actions/booking.ts
"use server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

// لیست ثابت و مرجع ساعت‌های کاری شما در روز
const MASTER_TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "03:00 PM",
  "04:30 PM"
];

/**
 * ۱. دریافت لیست ساعت‌های خالی برای یک تاریخ مشخص
 * @param dateStr فرمت: "YYYY-MM-DD"
 */
export async function getAvailableSlotsAction(dateStr: string) {
  try {
    if (!dateStr) return { success: false, slots: [] };

    // فچ کردن نوبت‌هایی که قبلاً تایید شده یا قطعی هستند
    const takenBookings = await db
      .select({ timeSlot: bookings.timeSlot })
      .from(bookings)
      .where(
        and(
          eq(bookings.date, dateStr),
          inArray(bookings.status, ["ACCEPTED", "CONFIRMED"])
        )
      );

    const takenSlots = takenBookings.map((b) => b.timeSlot);

    // فیلتر کردن ساعت‌های اصلی: فقط ساعت‌هایی که پر نشده‌اند برگردانده می‌شوند
    const availableSlots = MASTER_TIME_SLOTS.filter(
      (slot) => !takenSlots.includes(slot)
    );

    return { success: true, slots: availableSlots };
  } catch (error) {
    console.error("Error in getAvailableSlotsAction:", error);
    return { success: false, slots: MASTER_TIME_SLOTS, error: "خطا در فچ کردن ساعت‌های خالی" };
  }
}

/**
 * ۲. ثبت نهایی درخواست رزرو وقت در دیتابیس Supabase
 */
interface SubmitBookingInput {
  clientName: string;
  clientEmail: string;
  date: string;
  timeSlot: string;
  meetingType: "Online" | "In-Location";
  clientNote?: string;
}

export async function submitBookingRequestAction(data: SubmitBookingInput) {
  try {
    // اعتبارسنجی اولیه سرور
    if (!data.clientName || !data.clientEmail || !data.date || !data.timeSlot) {
      return { success: false, error: "تمامی فیلدهای اجباری باید پر شوند." };
    }

    // چک کردن مجدد تداخل زمانی (Race Condition Check)
    const doubleBookingCheck = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.date, data.date),
          eq(bookings.timeSlot, data.timeSlot),
          inArray(bookings.status, ["ACCEPTED", "CONFIRMED"])
        )
      );

    if (doubleBookingCheck.length > 0) {
      return { 
        success: false, 
        error: "متأسفانه این زمان در همین لحظه توسط شخص دیگری رزرو شد. لطفا زمان دیگری انتخاب کنید." 
      };
    }

    // ثبت در جدول bookings دیتابیس Supabase
    await db.insert(bookings).values({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      timeSlot: data.timeSlot,
      meetingType: data.meetingType,
      clientNote: data.clientNote || null,
      status: "PENDING", // وضعیت اولیه: در انتظار تایید ادمین
    });

    return { success: true };
  } catch (error) {
    console.error("Error in submitBookingRequestAction:", error);
    return { success: false, error: "خطایی در ارتباط با سرور رخ داد. مجدداً تلاش کنید." };
  }
}