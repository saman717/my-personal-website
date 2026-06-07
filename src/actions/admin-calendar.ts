"use server"; // 🚀 ضروری برای اینکه نکست‌جی‌اس بفهمد این کدها فقط روی سرور اجرا می‌شوند

import { db } from "../db/index"; // 🌟 آدرس ایمپورت db پروژه خودت رو جایگزین کن
import { revalidatePath } from "next/cache";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { bookings, blockedDates, adminTasks } from "@/db/schema";

// 🌟 اگر تایم‌اسلات‌های ثابتت رو تو یک فایل کانفیگ داری، ایمپورتش کن.
// به عنوان مثال:
const MASTER_TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00"];

// ۱. تعریف تایپ استاندارد برای خروجی تمام اکشن‌ها (سیستم حل مسئله یکپارچه)
export type ActionResponse<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
};

/**
 * ایجاد یک تسک شناور (بدون زمان) برای ادمین در یک روز خاص
 * @param date فرمت متنی استاندارد YYYY-MM-DD
 * @param title عنوان تسک
 */
export async function createAdminTaskAction(
    date: string,
    title: string
): Promise<ActionResponse> {
    try {
        // 🛡️ لایه اعتبارسنجی اولیه (Sanitization)
        if (!date || !title.trim()) {
            return { success: false, error: "تاریخ و عنوان تسک نمی‌توانند خالی باشند." };
        }

        // 📝 درج دیتا در دیتابیس با Drizzle
        await db.insert(adminTasks).values({
            date,
            title: title.trim(),
            // timeSlot فرستاده نمی‌شود تا در دیتابیس null بماند (تسک شناور)
        });

        // ♻️ تازه‌سازی کش صفحه ادمین تا تسک جدید درجا روی فرانت‌آند ظاهر شود
        revalidatePath("/[locale]/admin/bookings", "page");

        return { success: true, message: "تسک با موفقیت ثبت شد." };

    } catch (error) {
        console.error("Error in createAdminTaskAction:", error);
        return {
            success: false,
            error: "خطایی در ثبت تسک رخ داد. لطفاً دوباره تلاش کنید."
        };
    }
}

/**
 * اختصاص یک زمان (Time Slot) مشخص به یک تسک از پیش ساخته شده
 * @param taskId آیدی یونیک تسک
 * @param timeSlot ساعتی که از MASTER_TIME_SLOTS انتخاب شده
 */
export async function assignTimeToTaskAction(
    taskId: string,
    timeSlot: string
): Promise<ActionResponse> {
    try {
        if (!taskId || !timeSlot) {
            return { success: false, error: "آیدی تسک و ساعت انتخابی نامعتبر است." };
        }

        // 📝 آپدیت کردن رکورد در دیتابیس
        await db.update(adminTasks)
            .set({ timeSlot })
            .where(eq(adminTasks.id, taskId));

        revalidatePath("/[locale]/admin/bookings", "page");

        return { success: true, message: "زمان با موفقیت به تسک اختصاص یافت." };

    } catch (error) {
        console.error("Error in assignTimeToTaskAction:", error);
        return { success: false, error: "خطا در زمان‌بندی تسک." };
    }
}


/**
 * تغییر وضعیت بلاک بودن یک روز (بلاک کردن در صورت باز بودن و بالعکس)
 * @param date فرمت متنی استاندارد YYYY-MM-DD
 * @param reason دلیل بلاک شدن (اختیاری)
 */
export async function toggleBlockDateAction(
  date: string,
  reason?: string
): Promise<ActionResponse> {
  try {
    if (!date) {
      return { success: false, error: "تاریخ نامعتبر است." };
    }

    // 🔍 ۱. اول چک می‌کنیم آیا این روز از قبل بلاک شده یا نه
    const existingBlock = await db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.date, date));

    if (existingBlock.length > 0) {
      // 🗑️ ۲. اگر بلاک بود -> رکورد را پاک کن تا روز آزاد شود (آن‌بلاک)
      await db.delete(blockedDates).where(eq(blockedDates.date, date));
      
      revalidatePath("/[locale]/admin/bookings", "page");
      return { success: true, message: "روز از حالت بلاک خارج شد." };
    } else {
      // 📝 ۳. اگر بلاک نبود -> یک رکورد جدید بساز تا روز بلاک شود
      await db.insert(blockedDates).values({
        date,
        reason: reason || "بلاک شده توسط ادمین",
      });
      
      revalidatePath("/[locale]/admin/bookings", "page");
      return { success: true, message: "روز با موفقیت بلاک شد." };
    }
    
  } catch (error) {
    console.error("Error in toggleBlockDateAction:", error);
    return { success: false, error: "خطا در تغییر وضعیت تاریخ." };
  }
}


/**
 * دریافت لیست ساعت‌های خالی (Available Slots) برای یک روز خاص
 * با در نظر گرفتن روزهای بلاک‌شده، رزروهای تایید شده و تسک‌های ادمین
 * @param dateStr فرمت متنی استاندارد YYYY-MM-DD
 */
export async function getAvailableSlotsAction(
  dateStr: string
): Promise<ActionResponse<string[]>> {
  try {
    // 🛡️ Guard Clause: اگر تاریخ نامعتبر بود، آرایه خالی برگردان
    if (!dateStr) {
      return { success: false, data: [] };
    }

    // 🛑 فیلتر اول: چک کردن اینکه آیا این روز توسط ادمین بلاک شده است؟
    const isDayBlocked = await db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.date, dateStr));

    // اگر روز بلاک بود، درجا متوقف می‌شویم (Early Return)
    if (isDayBlocked.length > 0) {
      return { 
        success: true, 
        message: "این روز تعطیل/غیرقابل انتخاب است.", 
        data: [] // هیچ ساعتی خالی نیست
      };
    }

    // 🙋‍♂️ فیلتر دوم: دریافت تایم‌های رزرو شده توسط کلاینت‌ها (فقط تایید شده‌ها)
    const takenBookings = await db
      .select({ timeSlot: bookings.timeSlot })
      .from(bookings)
      .where(
        and(
          eq(bookings.date, dateStr),
          inArray(bookings.status, ["ACCEPTED", "CONFIRMED"])
        )
      );

    // 👨‍💻 فیلتر سوم: دریافت تسک‌های زمان‌بندی شده ادمین (که تایم‌اسلات دارند)
    const takenTasks = await db
      .select({ timeSlot: adminTasks.timeSlot })
      .from(adminTasks)
      .where(
        and(
          eq(adminTasks.date, dateStr),
          isNotNull(adminTasks.timeSlot) // فقط تسک‌هایی که ساعتشان ست شده
        )
      );

    // 🔗 ادغام تمام تایم‌های پر شده (رزروها + تسک‌ها)
    // استفاده از Set برای جلوگیری از دیتای تکراری و پرفورمنس بالاتر
    const allTakenSlots = new Set([
      ...takenBookings.map((b) => b.timeSlot),
      ...takenTasks.map((t) => t.timeSlot)
    ]);

    // 🎯 استخراج تایم‌های خالی: مقایسه با تایم‌های مرجع (MASTER)
    const availableSlots = MASTER_TIME_SLOTS.filter(
      (slot) => !allTakenSlots.has(slot)
    );

    return { 
      success: true, 
      data: availableSlots 
    };

  } catch (error) {
    console.error("Error in getAvailableSlotsAction:", error);
    return { 
      success: false, 
      error: "خطا در دریافت زمان‌های خالی.", 
      data: [] 
    };
  }
}

/**
 * دریافت لیست تمام تسک‌های ادمین برای یک تاریخ مشخص
 * @param dateStr فرمت: YYYY-MM-DD
 */
export async function getAdminTasksAction(dateStr: string) {
  try {
    if (!dateStr) return { success: false, data: [] };

    const tasks = await db
      .select()
      .from(adminTasks)
      .where(eq(adminTasks.date, dateStr));

    return { success: true, data: tasks };
  } catch (error) {
    console.error("Error fetching admin tasks:", error);
    return { success: false, data: [], error: "خطا در بارگذاری تسک‌ها" };
  }
}