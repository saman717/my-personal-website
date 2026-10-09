import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

// fail-fast: بدون این، postgres() به localhost وصل می‌شود و تا timeout هنگ می‌کند
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables.'
  );
}

const isProd = process.env.NODE_ENV === 'production';

// ─── Singleton — جلوگیری از ساخت کانکشن جدید در هر HMR reload (فقط dev) ────
const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.pgClient ??
  postgres(connectionString, {
    // لازم برای pgbouncer transaction mode (port 6543)
    prepare: false,

    // چند کانکشن تا Promise.all واقعاً parallel اجرا شود.
    // با max:1 کوئری‌های موازی پشت سر هم صف می‌کشند و latency دو برابر می‌شود.
    max: 3,

    // ⚠️ حیاتی برای Vercel serverless:
    // بین دو request، تابع freeze می‌شود و سوکت TCP بی‌صدا می‌میرد.
    // با idle_timeout بلند (مثلاً ۳۰۰ ثانیه) درخواست بعدی یک سوکت مُرده را
    // برمی‌دارد و تا TCP timeout (دقیقه‌ها) هنگ می‌کند.
    // مقدار کوتاه باعث می‌شود کانکشن قبل از freeze بسته شود.
    idle_timeout: isProd ? 20 : 120,

    // سقف عمر کانکشن — کوتاه در production
    max_lifetime: isProd ? 60 * 5 : 60 * 30,

    // کوتاه‌تر از ۱۵ ثانیه تا در بدترین حالت هم کل request زیر ~۱۵ ثانیه بماند
    connect_timeout: 10,
  });

if (!isProd) {
  globalForDb.pgClient = client;
}

export const db = drizzle(client);

// Re-export dbRetry برای استفاده راحت در همه actions
export { dbRetry } from './retry';
