// 🌟 اصلاح مسیر ایمپورت‌ها: مطمئن شو مسیر فایل db و schema بر اساس ساختار پروژه‌ات درست باشد
// اگر فایل db.ts داخل پوشه lib است، مسیر زیر درست است:
import { db } from "@/db/index";
import { bookings } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function checkTimeConflict(
  requestedDate: string, // فرمت: YYYY-MM-DD
  requestedTimeSlot: string // فرمت: HH:MM
): Promise<boolean> {
  const conflicts = await db
    .select()
    .from(bookings)
    .where(
      and(
        // فقط رزروهایی که "تایید شده" هستند تایم رو اشغال میکنن
        eq(bookings.status, "CONFIRMED"),
        // چک کردن تاریخ دقیق
        eq(bookings.date, requestedDate),
        // چک کردن ساعت دقیق
        eq(bookings.timeSlot, requestedTimeSlot)
      )
    );

  // اگر طول آرایه بیشتر از ۰ باشه، یعنی تداخل زمانی وجود داره (true)
  return conflicts.length > 0;
}