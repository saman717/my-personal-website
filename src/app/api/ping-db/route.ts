import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

// ─── Keep-alive برای Supabase free tier ──────────────────────────────────────
// این endpoint رو هر ۴ دقیقه یه‌بار با UptimeRobot/BetterStack ping کن
// تا DB هیچ‌وقت نخوابه و صفحات فوری لود بشن
export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true, ts: Date.now() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
