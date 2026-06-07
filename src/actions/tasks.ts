"use server";

import { db } from "../db/index";
import { tasks, taskLogs } from "@/db/schema";
// 🌟 این خط را پیدا کن و inArray را به آن اضافه کن
import { or, and, eq, lte, ne, inArray, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly";

/**
 * ۱. دریافت تمام تسک‌های بازه‌ای (برای نمای تقویم هفتگی و روزانه)
 */
export async function getTasksForDateAction(dateStr: string): Promise<ActionResponse> {
  noStore();

  try {
    if (!dateStr) return { success: false, data: [], error: "تاریخ نامعتبر است" };

    // فقط تسک‌های مختص همین روز + تکرارشونده‌ها
    const candidateTasks = await db
      .select()
      .from(tasks)
      .where(
        or(
          eq(tasks.date, dateStr),
          and(ne(tasks.recurrence, "none"), lte(tasks.date, dateStr))
        )
      );

    const targetDate = new Date(dateStr);
    const targetDayOfWeek = targetDate.getDay();
    const targetDayOfMonth = targetDate.getDate();

    const filteredTasks = candidateTasks.filter(task => {
      const exceptions = JSON.parse(task.exceptionDates || "[]");
      if (exceptions.includes(dateStr)) return false;

      if (task.date === dateStr) return true;
      if (task.recurrence === "daily") return true;
      if (task.recurrence === "weekly" && new Date(task.date).getDay() === targetDayOfWeek) return true;
      if (task.recurrence === "monthly" && new Date(task.date).getDate() === targetDayOfMonth) return true;
      return false;
    });

    const taskIds = filteredTasks.map(t => t.id);
    let logsForToday: any[] = [];

    if (taskIds.length > 0) {
      logsForToday = await db
        .select()
        .from(taskLogs)
        .where(and(eq(taskLogs.date, dateStr), inArray(taskLogs.taskId, taskIds)));
    }

    const finalTasks = filteredTasks.map(task => {
      const todayLog = logsForToday.find(log => log.taskId === task.id);
      return {
        ...task,
        isAttempted: todayLog ? todayLog.isAttempted : false,
        isAchieved: todayLog ? todayLog.isAchieved : false,
      };
    });

    return { success: true, data: finalTasks };
  } catch (error) {
    console.error("Error in getTasksForDateAction:", error);
    return { success: false, data: [], error: "خطا در بارگذاری وظایف" };
  }
}
/**
 * ۲. ایجاد یک وظیفه جدید شخصی (کاملاً منطبق بر ساختار و ترتیب شلیک مودال)
 * ترتیب دقیق ورودی‌ها: (title, date, timeSlot, isBlocking, duration, description, priority)
 */
export async function createTaskAction(
  title: string,
  date: string,
  timeSlot: string | null = null,
  isBlocking: boolean = false,
  duration: number = 60,            // 🌟 پارامتر پنجم (عدد)
  description?: string,             // 🌟 پارامتر ششم (متن)
  priority: TaskPriority = "medium", // 🌟 پارامتر هفتم (متن)
  recurrence: TaskRecurrence = "none",   // 🌟 فیلد جدید
  category: string = "work",     // 🌟 فیلد جدید
  energyLevel: TaskPriority = "medium"
): Promise<ActionResponse> {
  try {
    if (!title.trim() || !date) {
      return { success: false, error: "عنوان و تاریخ وظیفه نمی‌تواند خالی باشد." };
    }

    // 🛡️ دفاع در برابر استرینگ خالیِ ورودی برای فیلد عددی
    const finalDuration = Number(duration) && !isNaN(Number(duration)) ? Number(duration) : 60;

    await db.insert(tasks).values({
      title: title.trim(),
      description: description && description.trim() !== "" ? description.trim() : null,
      priority: priority,
      status: "todo", // وضعیت اولیه
      date: date,
      timeSlot: timeSlot,
      isBlocking: isBlocking,
      duration: finalDuration, // مطمئن می‌شویم که حتماً عدد معتبر به دیتابیس تزریق می‌شود
      recurrence: recurrence,       // 🌟 ذخیره تکرار
      category: category,           // 🌟 ذخیره دسته‌بندی
      energyLevel: energyLevel,     // 🌟 ذخیره سطح انرژی
      isAttempted: false,           // 🌟 پیش‌فرض: تلاش نشده
      isAchieved: false,            // 🌟 پیش‌فرض: به هدف نرسیده
    });

    // پاک کردن کش مسیرها جهت رندر آنی فرانت‌اِند
    revalidatePath("/[locale]/admin/tasks", "page");
    if (isBlocking) revalidatePath("/[locale]/booking", "page");

    return { success: true, message: "وظیفه با موفقیت در سیستم ثبت شد." };
  } catch (error) {
    console.error("Error in createTaskAction SQL:", error);
    return { success: false, error: "خطا در ثبت وظیفه در دیتابیس" };
  }
}

/**
 * ۳. تغییر وضعیت یک وظیفه
 */
export async function updateTaskStatusAction(
  taskId: string,
  newStatus: TaskStatus
): Promise<ActionResponse> {
  try {
    if (!taskId || !newStatus) {
      return { success: false, error: "پارامترهای ارسالی نامعتبر هستند." };
    }

    await db
      .update(tasks)
      .set({
        status: newStatus,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, taskId));

    revalidatePath("/[locale]/admin/tasks", "page");
    return { success: true, message: "وضعیت تغییر کرد." };
  } catch (error) {
    console.error("Error in updateTaskStatusAction:", error);
    return { success: false, error: "خطا در به‌روزرسانی وضعیت" };
  }
}


/**
 * ۴. حذف کامل یک وظیفه
 */
/**
 * ۷. حذف هوشمند وظیفه (پشتیبانی از حذف تک‌نمونه یا حذف سراسری کارهای تکرارشونده)
 */
export async function deleteTaskAction(
  taskId: string,
  deleteMode: "single" | "all" = "all", // 🌟 حالت حذف: فقط امروز یا همه؟
  targetDateStr?: string // 🌟 تاریخ روزی که داریم مشاهده می‌کنیم
): Promise<ActionResponse> {
  try {
    if (!taskId) {
      return { success: false, error: "آیدی وظیفه نامعتبر است." };
    }

    // ۱. بررسی وجود تسک در دیتابیس
    const originalTask = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    if (!originalTask.length) {
      return { success: false, error: "وظیفه یافت نشد یا قبلاً حذف شده است." };
    }

    const task = originalTask[0];

    // ۲. اگر تسک تکرارشونده بود و کاربر خواست "فقط همین امروز" حذف شود
    if (deleteMode === "single" && task.recurrence !== "none" && targetDateStr) {

      const currentExceptions = JSON.parse(task.exceptionDates || "[]");

      // تاریخ امروز را به لیست سیاه (استثنائات) تسک اضافه می‌کنیم
      if (!currentExceptions.includes(targetDateStr)) {
        currentExceptions.push(targetDateStr);

        await db
          .update(tasks)
          .set({
            exceptionDates: JSON.stringify(currentExceptions),
            updatedAt: new Date()
          })
          .where(eq(tasks.id, taskId));
      }

    } else {
      // ۳. در غیر این صورت (تسک ساده است یا کاربر حذف سراسری را انتخاب کرده)
      await db.delete(tasks).where(eq(tasks.id, taskId));
    }

    revalidatePath("/[locale]/admin/tasks", "page");
    if (task.isBlocking) revalidatePath("/[locale]/booking", "page");

    return { success: true, message: "وظیفه با موفقیت از دامنه زمانی حذف شد." };
  } catch (error) {
    console.error("Error in deleteTaskAction:", error);
    return { success: false, error: "خطا در پردازش حذف وظیفه" };
  }
}

/**
 * ۵. دریافت قدیمی (Backward Compatibility برای جلوگیری از ارور کامپایل در سایر فایل‌ها)
 */
export async function getTasksAction(): Promise<ActionResponse> {
  try {
    const allTasks = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));
    return { success: true, data: allTasks };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

/**
 * ۵. آپدیت کردن تیک‌های عملکردی (سیستم عامل زندگی)
 */
/**
 * آپدیت تیک‌ها (ذخیره بر اساس تاریخ در جدول لاگ‌ها)
 */
export async function updateTaskGoalsAction(
  taskId: string,
  isAttempted: boolean,
  isAchieved: boolean,
  dateStr: string
): Promise<ActionResponse> {
  try {
    if (!taskId || !dateStr) return { success: false, error: "دیتا نامعتبر است." };

    const existingLog = await db
      .select()
      .from(taskLogs)
      .where(and(eq(taskLogs.taskId, taskId), eq(taskLogs.date, dateStr)));

    if (existingLog.length > 0) {
      await db.update(taskLogs).set({ isAttempted, isAchieved }).where(eq(taskLogs.id, existingLog[0].id));
    } else {
      await db.insert(taskLogs).values({ taskId, date: dateStr, isAttempted, isAchieved });
    }

    revalidatePath("/[locale]/admin/tasks", "page");
    return { success: true, message: "لاگ عملکرد ثبت شد." };
  } catch (error) {
    return { success: false, error: "خطا در ثبت وضعیت عملکرد" };
  }
}

/**
 * ۶. ویرایش هوشمند وظیفه (پشتیبانی از استثنائات کارهای تکرارشونده)
 */
export async function updateTaskAction(
  taskId: string,
  title: string,
  timeSlot: string | null,
  isBlocking: boolean,
  duration: number,
  description: string | null,
  priority: TaskPriority,
  recurrence: TaskRecurrence,
  category: string,
  energyLevel: TaskPriority,
  editMode: "single" | "all", // 🌟 نوع ویرایش: فقط همین روز یا همه؟
  targetDateStr: string // 🌟 تاریخی که داریم در آن ویرایش می‌کنیم
): Promise<ActionResponse> {
  try {
    const finalDuration = Number(duration) && !isNaN(Number(duration)) ? Number(duration) : 60;

    // گرفتن اطلاعات تسک اصلی
    const originalTask = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    if (!originalTask.length) return { success: false, error: "وظیفه یافت نشد." };

    const task = originalTask[0];

    // اگر تسک تکرارشونده است و کاربر گفت "فقط همین یک مورد را تغییر بده"
    if (editMode === "single" && task.recurrence !== "none") {

      // ۱. تاریخ امروز را به استثنائات تسک اصلی اضافه کن
      const currentExceptions = JSON.parse(task.exceptionDates || "[]");
      if (!currentExceptions.includes(targetDateStr)) {
        currentExceptions.push(targetDateStr);
        await db.update(tasks).set({ exceptionDates: JSON.stringify(currentExceptions) }).where(eq(tasks.id, taskId));
      }

      // ۲. یک تسک کاملاً جدید با تغییرات جدید برای همین روز بساز
      await db.insert(tasks).values({
        title: title.trim(),
        description: description && description.trim() !== "" ? description.trim() : null,
        priority: priority,
        status: task.status,
        date: targetDateStr, // فقط برای همین روز
        timeSlot: timeSlot,
        isBlocking: isBlocking,
        duration: finalDuration,
        recurrence: "none", // دیگر تکرارشونده نیست، یک نمونه مستقل است
        category: category,
        energyLevel: energyLevel,
        parentId: task.id, // به عنوان فرزند به تسک اصلی وصلش می‌کنیم
      });

    } else {
      // ویرایش عادی (تسک معمولی است یا کاربر گفت همه را تغییر بده)
      await db.update(tasks).set({
        title: title.trim(),
        timeSlot: timeSlot,
        isBlocking: isBlocking,
        duration: finalDuration,
        description: description && description.trim() !== "" ? description.trim() : null,
        priority: priority,
        recurrence: recurrence,
        category: category,
        energyLevel: energyLevel,
        updatedAt: new Date(),
      }).where(eq(tasks.id, taskId));
    }

    revalidatePath("/[locale]/admin/tasks", "page");
    return { success: true, message: "تغییرات با موفقیت اعمال شد." };
  } catch (error) {
    console.error("Error in updateTaskAction:", error);
    return { success: false, error: "خطا در اعمال تغییرات" };
  }
}
