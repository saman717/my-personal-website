"use server";

import { db } from "../db/index";
import { bookings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * ۱. دریافت لیست تمام رزروها برای ادمین
 */
export async function getAdminBookingsAction() {
  try {
    const data = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt)); // جدیدترین‌ها اول بیایند

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    return { success: false, data: [], error: "خطا در بارگذاری لیست رزروها" };
  }
}

/**
 * ۲. تغییر وضعیت یک رزرو (تایید یا رد یا قفل نهایی)
 * 🔒 لایه امنیتی سرور اضافه شد: جلوگیری از دستکاری رکوردهای نهایی شده
 */
export async function updateBookingStatusAction(bookingId: string, newStatus: "ACCEPTED" | "REJECTED" | "CONFIRMED") {
  try {
    // ۱. 🔒 استفاده از متد پایه و ۱۰۰٪ امن select برای دریافت وضعیت فعلی رکورد
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1); // همیشه حداکثر یک رکورد می‌خواهیم

    const currentBooking = existingBookings[0];

    // اگر درخواستی با این آیدی پیدا نشد
    if (!currentBooking) {
      return { success: false, error: "درخواست رزرو یافت نشد." };
    }

    // ۲. 🔒 گارد امنیتی سرور: اگر جلسه از قبل نهایی یا رد شده بود، اجازه تغییر نده
    if (currentBooking.status === "CONFIRMED" || currentBooking.status === "REJECTED") {
      return { success: false, error: "این جلسه نهایی یا رد شده است و وضعیت آن قابل تغییر نیست." };
    }

    // ۳. انجام آپدیت نهایی دیتابیس در صورت معتبر بودن کلیدها
    await db
      .update(bookings)
      .set({ status: newStatus })
      .where(eq(bookings.id, bookingId));

    // بروزرسانی آنی کش نکست‌جی‌اس برای کلاینت
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "خطا در تغییر وضعیت درخواست" };
  }
}

/**
 * ۳. بروزرسانی یا ذخیره یادداشت اختصاصی ادمین
 */
export async function updateAdminNotesAction(bookingId: string, notes: string) {
  try {
    await db
      .update(bookings)
      .set({ adminNote: notes })
      .where(eq(bookings.id, bookingId));

    // رفرش کردن کش مسیر برای بروزرسانی همزمان فرانت‌اند
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating admin notes:", error);
    return { success: false, error: "خطا در ذخیره یادداشت ادمین" };
  }
}
/**
 * ۴. حذف کامل و قطعی یک رزرو از دیتابیس
 */
export async function deleteBookingAction(bookingId: string) {
  try {
    await db
      .delete(bookings)
      .where(eq(bookings.id, bookingId));

    // رفرش کردن کش مسیر برای بروزرسانی فوری کلاینت
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: "خطا در حذف درخواست از دیتابیس" };
  }
}