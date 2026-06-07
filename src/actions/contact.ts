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

    const [newMessage] = await db.insert(contactMessages).values({
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
      locale: validatedData.locale,
    }).returning();

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