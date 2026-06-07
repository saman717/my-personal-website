'use server';

import { db } from '../db/index';
import { contactMessages } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getContactMessages() {
  console.time("DB_FETCH_TIME"); //
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    console.timeEnd("DB_FETCH_TIME");
    return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: 'خطا در دریافت پیام‌ها' };
  }
}

export async function toggleMessageReadStatus(id: string, currentStatus: boolean) {
  try {
    await db
      .update(contactMessages)
      .set({ isRead: !currentStatus })
      .where(eq(contactMessages.id, id));

    revalidatePath('/[locale]/admin/messages', 'page');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'خطا در به‌روزرسانی' };
  }
}

export async function deleteMessageFromDb(id: string) {
  try {
    await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id));

    revalidatePath('/[locale]/admin/messages', 'page');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'خطا در حذف پیام' };
  }
}
export async function getRecentMessages(limit: number = 3) {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(limit);

    return {
      success: true,
      data: messages,
    };
  } catch (error) {
    return {
      success: false,
      error: "خطا در دریافت پیام‌ها",
    };
  }
}
export async function getMessagesStats() {
  try {
    const messages = await db.select().from(contactMessages);

    const now = new Date();

    // شروع امروز
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // شروع هفته
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);

    const totalMessages = messages.length;

    const unreadMessages = messages.filter(
      (msg) => !msg.isRead
    ).length;

    const todayMessages = messages.filter(
      (msg) =>
        new Date(msg.createdAt) >= todayStart
    ).length;

    const weekMessages = messages.filter(
      (msg) =>
        new Date(msg.createdAt) >= weekStart
    ).length;

    return {
      success: true,
      data: {
        totalMessages,
        unreadMessages,
        todayMessages,
        weekMessages,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "خطا در دریافت آمار پیام‌ها",
    };
  }
}