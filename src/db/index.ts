import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

// ─── Singleton pattern — جلوگیری از ساخت کانکشن جدید در هر HMR reload ──────
const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.pgClient ??
  postgres(connectionString, {
    prepare: false, // لازم برای pgbouncer transaction mode
    // در dev چند کانکشن همزمان داشته باشیم تا query ها parallel اجرا بشن
    // در production (Vercel serverless) هر invocation ایزوله‌ست و 1 کافیه
    max: process.env.NODE_ENV === 'production' ? 1 : 5,
    idle_timeout: 300,  // ۵ دقیقه کانکشن warm می‌مونه
    connect_timeout: 15,
    max_lifetime: 60 * 30, // ۳۰ دقیقه - بعدش کانکشن reset میشه
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgClient = client;
}

export const db = drizzle(client);

// Re-export dbRetry برای استفاده راحت در همه actions
export { dbRetry } from './retry';
