'use server';

import { db } from '../db/index';
import { contactMessages } from '@/db/schema';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(1, { message: 'fullName' }),
  phone: z.string()
    .min(11, { message: 'phone' })
    .max(14, { message: 'phone' }),
  email: z.string().email({ message: 'email' }),
  message: z.string().min(1, { message: 'message' }),
  locale: z.string().default('fa'),
});

type ContactField = 'fullName' | 'phone' | 'email' | 'message';

// 🌟 تابع اختصاصی برای ارسال اعلان به تلگرام شما
async function notifyAdminViaTelegram(data: { name: string; email: string; phone: string; message: string; locale: string }) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // اگر توکن‌ها ست نشده باشند، بی‌صدا رد شو تا کل سیستم کرش نکند
  if (!botToken || !chatId) {
    console.warn('Telegram environment variables are missing!');
    return;
  }

  try {
    // قشنگ‌سازی فرمت پیام با Markdown تلگرام
    const telegramText =
      `📩 *پیام جدید از فرم تماس سایت!*\n\n` +
      `👤 *نام فرستنده:* ${data.name}\n` +
      `📞 *شماره تماس:* \`${data.phone}\`\n` +
      `✉️ *ایمیل:* ${data.email}\n` +
      `🌐 *زبان سایت:* \`${data.locale.toUpperCase()}\`\n\n` +
      `💬 *متن پیام:*\n"${data.message}"`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // ارسال درخواست به سرور تلگرام با Timeout کوتاه
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText,
        parse_mode: 'Markdown',
      }),
    });
  } catch (tgError) {
    // اگر تلگرام فیلتر بود یا تایم‌اوت خورد، فقط لاگ بینداز تا عملیات کاربر اصلی متوقف نشود
    console.error('Failed to send Telegram notification:', tgError);
  }
}

export async function sendContactMessage(formData: unknown) {
  try {
    const parsed = contactSchema.safeParse(formData);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const field = firstIssue?.message as ContactField | undefined;

      return {
        success: false,
        isValidationError: true,
        field: field ?? 'message',
      };
    }

    const validatedData = parsed.data;

    // ۱. ثبت پیام در دیتابیس Supabase
    const [newMessage] = await db.insert(contactMessages).values({
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
      locale: validatedData.locale,
    }).returning();

    // ۲. 🚀 شلیک آنی نوتیفیکیشن به تلگرام شما (بدون await تا کاربر منتظر پاسخ تلگرام نماند)
    // این پترن سرعت پاسخ‌دهی اکشن را به شدت بالا نگه می‌دارد
    notifyAdminViaTelegram({
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
      locale: validatedData.locale,
    });

    return {
      success: true,
      messageId: newMessage.id,
    };
  } catch (error) {
    console.error('Database Error:', error);

    return {
      success: false,
      isValidationError: false,
      field: 'message',
    };
  }
}