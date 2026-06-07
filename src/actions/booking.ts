"use server";

import { db } from "../db/index";
// 🌟 ایمپورت جدول یکپارچه‌ی tasks به جای adminTasks
import { bookings, blockedDates, tasks } from "@/db/schema";
import { eq, and, inArray, isNotNull, between } from "drizzle-orm";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";

/**
 * ۱. دریافت وضعیت کل ماه (جلوگیری از N+1 Problem در تقویم)
 */
export async function getMonthAvailabilityAction(year: number, month: number) {
  try {
    const formattedMonth = String(month).padStart(2, "0");
    const startDate = `${year}-${formattedMonth}-01`;
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${formattedMonth}-${String(lastDayOfMonth).padStart(2, "0")}`;

    // روزهای بلاک شده
    const blocked = await db.select({ date: blockedDates.date }).from(blockedDates)
      .where(between(blockedDates.date, startDate, endDate));
    const blockedDays = blocked.map((b) => b.date);

    // رزروهای تایید شده
    const monthBookings = await db.select({ date: bookings.date, timeSlot: bookings.timeSlot }).from(bookings)
      .where(and(between(bookings.date, startDate, endDate), inArray(bookings.status, ["ACCEPTED", "CONFIRMED"])));

    // تسک‌های زمان‌دار ادمین که قابلیت بلاک کردن دارند
    const monthTasks = await db.select({ date: tasks.date, timeSlot: tasks.timeSlot }).from(tasks)
      .where(
        and(
          between(tasks.date, startDate, endDate),
          isNotNull(tasks.timeSlot),
          eq(tasks.isBlocking, true) // 🌟 گارد امنیتی
        )
      );

    const slotCounts: Record<string, Set<string>> = {};

    monthBookings.forEach((b) => {
      if (!slotCounts[b.date]) slotCounts[b.date] = new Set();
      slotCounts[b.date].add(b.timeSlot);
    });

    monthTasks.forEach((t) => {
      if (!slotCounts[t.date]) slotCounts[t.date] = new Set();
      if (t.timeSlot) slotCounts[t.date].add(t.timeSlot);
    });

    const fullDays: string[] = [];
    const TOTAL_SLOTS = MASTER_TIME_SLOTS.length;

    for (const [date, slots] of Object.entries(slotCounts)) {
      if (slots.size >= TOTAL_SLOTS) fullDays.push(date);
    }

    return { success: true, blockedDays, fullDays };
  } catch (error) {
    console.error("Error in getMonthAvailabilityAction:", error);
    return { success: false, blockedDays: [], fullDays: [], error: "خطا در بارگذاری تقویم ماه" };
  }
}

/**
 * ۲. دریافت لیست ساعت‌های خالی برای یک تاریخ مشخص (ارتقا یافته)
 */
export async function getAvailableSlotsAction(dateStr: string) {
  try {
    if (!dateStr) return { success: false, slots: [] as string[] };

    // 🛑 لایه ۱: آیا روز کلاً توسط ادمین بلاک شده است؟
    const isDayBlocked = await db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.date, dateStr));

    if (isDayBlocked.length > 0) {
      return { success: true, slots: [] as string[], message: "این روز تعطیل است" };
    }

    // 🙋‍♂️ لایه ۲: فچ کردن نوبت‌های تایید شده کاربران
    const takenBookings = await db
      .select({ timeSlot: bookings.timeSlot })
      .from(bookings)
      .where(
        and(
          eq(bookings.date, dateStr),
          inArray(bookings.status, ["ACCEPTED", "CONFIRMED"])
        )
      );

    // 👨‍💻 لایه ۳: فچ کردن تسک‌های ادمین که ساعت براشون فیکس شده و بلاک‌کننده هستند
    const takenTasks = await db
      .select({ timeSlot: tasks.timeSlot })
      .from(tasks)
      .where(
        and(
          eq(tasks.date, dateStr),
          isNotNull(tasks.timeSlot),
          eq(tasks.isBlocking, true) // 🌟 گارد امنیتی
        )
      );

    const allTakenSlots = new Set([
      ...takenBookings.map((b) => b.timeSlot),
      ...takenTasks.map((t) => t.timeSlot!)
    ]);

    const availableSlots = MASTER_TIME_SLOTS.filter(
      (slot) => !allTakenSlots.has(slot)
    );

    return { success: true, slots: availableSlots };
  } catch (error) {
    console.error("Error in getAvailableSlotsAction:", error);
    return { success: false, slots: MASTER_TIME_SLOTS, error: "خطا در فچ کردن ساعت‌های خالی" };
  }
}

/**
 * ۳. ثبت نهایی درخواست رزرو وقت (همراه با بررسی امنیتی ۳ لایه)
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
    if (!data.clientName || !data.clientEmail || !data.date || !data.timeSlot) {
      return { success: false, error: "تمامی فیلدهای اجباری باید پر شوند." };
    }

    // 🛡️ لایه امنیتی ۱: آیا ادمین دقیقاً همین الان روز رو بلاک نکرد؟
    const isBlockedCheck = await db.select().from(blockedDates).where(eq(blockedDates.date, data.date));
    if (isBlockedCheck.length > 0) {
      return { success: false, error: "متأسفانه این روز توسط مدیر بسته شد. لطفاً روز دیگری انتخاب کنید." };
    }

    // 🛡️ لایه امنیتی ۲: آیا ادمین دقیقاً همین الان این ساعت رو برای تسک بلاک‌کننده‌ی خودش برنداشت؟
    // 🌟 اینجا کلمه‌ی adminTasks با جدول جدید tasks جایگزین شد
    const adminTaskCheck = await db.select().from(tasks)
      .where(
        and(
          eq(tasks.date, data.date), 
          eq(tasks.timeSlot, data.timeSlot),
          eq(tasks.isBlocking, true) // 🌟 گارد امنیتی اضافه شد
        )
      );

    if (adminTaskCheck.length > 0) {
      return { success: false, error: "متأسفانه این زمان توسط مدیر رزرو شد. لطفاً زمان دیگری انتخاب کنید." };
    }

    // 🛡️ لایه امنیتی ۳: چک کردن مجدد تداخل زمانی کاربران (Race Condition)
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

    // ثبت نهایی در دیتابیس
    await db.insert(bookings).values({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      timeSlot: data.timeSlot,
      meetingType: data.meetingType,
      clientNote: data.clientNote || null,
      status: "PENDING",
    });

    return { success: true };
  } catch (error) {
    console.error("Error in submitBookingRequestAction:", error);
    return { success: false, error: "خطایی در ارتباط با سرور رخ داد. مجدداً تلاش کنید." };
  }
}