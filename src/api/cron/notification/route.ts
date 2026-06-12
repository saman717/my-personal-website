import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { tasks, bookings } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// تابع کمکی برای ارسال پیام به تلگرام تو
async function sendTelegramMessage(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown", // برای قشنگ‌تر شدن متون (بولد و...)
    }),
  });
}

export async function GET(request: Request) {
  try {
    // ۱. به دست آوردن تاریخ و ساعت فعلی سیستم
    const now = new Date();
    
    // تنظیم تایم‌زون ایران (یا هر جایی که هستی) برای ساعت و تاریخ دقیق
    const tehranDate = now.toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" });
    // تبدیل تاریخ فیلتر شده به فرمت استاندارد YYYY-MM-DD تو
    // (این بخش بسته به فرمت ذخیره سازی تو در دیتابیس هندل می‌شود، فرض می‌کنیم متد استاندارد امروز را به ما می‌دهد)
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // به دست آوردن ساعت فعلی به فرمت "HH:00" یا "HH:MM"
    const currentHour = now.getHours();
    const currentTimeSlot = `${currentHour.toString().padStart(2, '0')}:00`; 

    // 🎯 بخش اول: چک کردن تسک‌های ادمین برای این ساعت
    const todaysTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.date, todayStr),
          eq(tasks.timeSlot, currentTimeSlot)
        )
      );

    if (todaysTasks.length > 0) {
      for (const task of todaysTasks) {
        const message = `🔔 *یادآور تسک کاری*\n\nساعتِ *${currentTimeSlot}* رسیده و وقت انجام این تسک است:\n📌 *${task.title}*\n📝 ${task.description || "بدون توضیحات"}`;
        await sendTelegramMessage(message);
      }
    }

    // 🎯 بخش دوم: چک کردن رزروهای (Bookings) تایید شده برای این ساعت
    const currentBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.date, todayStr),
          eq(bookings.timeSlot, currentTimeSlot),
          eq(bookings.status, "CONFIRMED")
        )
      );

    if (currentBookings.length > 0) {
      for (const booking of currentBookings) {
        const message = `🤝 *یادآور جلسه و رزرو کلاینت*\n\nساعت *${currentTimeSlot}* با کلاینت جلسه داری:\n👤 نام: *${booking.clientName}*\nنوع جلسه: *${booking.meetingType}*\n✉️ ایمیل: ${booking.clientEmail}`;
        await sendTelegramMessage(message);
      }
    }

    return NextResponse.json({ success: true, message: "Notifications processed." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}