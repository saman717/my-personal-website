import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts', // آدرس فایل اسکیمای تو
  out: './src/db/migrations',   // پوشه‌ای که فایل‌های SQL تو باید آنجا ساخته شوند
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});