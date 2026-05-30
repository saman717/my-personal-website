'use server';

import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { z } from 'zod';

// ولیدیشن ورودی‌ها دقیقاً مطابق با نیازهای فرانت‌اَند شما
const contactSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(11).max(14),
  email: z.string().email(),
  message: z.string().min(5),
  locale: z.string().default('fa'),
});

// ... کدهای قبلی (Zod validation و غیره)

export async function sendContactMessage(formData: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(formData);

    const [newMessage] = await db.insert(contactMessages).values({
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone, // 🚀 حالا این فیلد مستقیماً به دیتابیس فرستاده می‌شود
      message: validatedData.message,
      locale: validatedData.locale,
    }).returning();

    return { success: true, messageId: newMessage.id };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to save message' };
  }
}