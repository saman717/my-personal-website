// src/actions/admin-bookings.ts
"use server";

import { db } from "@/db";
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
 * ۲. تغییر وضعیت یک رزرو (تایید یا رد)
 * ✨ فیکس شد: تغییر تایپ bookingId به string به دلیل استفاده از UUID در دیتابیس
 */
export async function updateBookingStatusAction(bookingId: string, newStatus: "ACCEPTED" | "REJECTED") {
  try {
    await db
      .update(bookings)
      .set({ status: newStatus })
      .where(eq(bookings.id, bookingId));

    // بروزرسانی کش نکست‌جی‌اس برای دیدن آنی تغییرات
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "خطا در تغییر وضعیت درخواست" };
  }
}

/**
 * ۳. بروزرسانی یا ذخیره یادداشت اختصاصی ادمین
 * ✨ فیکس شد: تغییر تایپ به string و انطباق نام فیلد دیتابیس به adminNote (بدون s)
 */
export async function updateAdminNotesAction(bookingId: string, notes: string) {
  try {
    await db
      .update(bookings)
      .set({ adminNote: notes }) // 🌟 این بخش دقیقاً به ستون adminNote در اسکیمای شما متصل شد
      .where(eq(bookings.id, bookingId));

    // رفرش کردن کش مسیر برای بروزرسانی همزمان فرانت‌اند
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating admin notes:", error);
    return { success: false, error: "خطا در ذخیره یادداشت ادمین" };
  }
}