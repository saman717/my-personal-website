import { pgTable, uuid, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

// ۱. جدول پیام‌های فرم تماس (Contact Form)

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  locale: text('locale').default('fa').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ۲. جدول مدیریت تسک‌ها (Personal Tasks)
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['todo', 'in_progress', 'done'] }).default('todo').notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).default('medium').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ۳. جدول پایش مسیر و زمان تردد ماشین (Commute Tracker)
export const commutes = pgTable('commutes', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').defaultNow().notNull(),
  departureTime: text('departure_time').notNull(), // ذخیره به فرمت "HH:MM"
  arrivalTime: text('arrival_time').notNull(),   // ذخیره به فرمت "HH:MM"
  durationMinutes: integer('duration_minutes').notNull(), // محاسبه تفاضل زمان در سرور و ذخیره عدد خالص برای میانگین‌گیری راحت
  trafficLevel: text('traffic_level', { enum: ['low', 'medium', 'heavy'] }).default('medium'),
});

// ۴. جدول توسعه آینده (Extensible Core) برای ربات‌ها، مقالات یا لاگ‌های PLC
export const extensibleLogs = pgTable('extensible_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleName: text('module_name').notNull(), // مثلاً "TELEGRAM_BOT" یا "PLC_EXPERIMENT"
  actionType: text('action_type').notNull(), // مثلاً "USER_SUBSCRIBED" یا "TEST_OVERWRITE"
  metaData: jsonb('meta_data'), // 🚀 شاهکار ارشد: یک ستون کاملاً داینامیک بدون ساختار ثابت برای هر نوع ایده در آینده!
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),

  // اطلاعات کاربر
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),

  // زمان‌بندی
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),

  // نوع و وضعیت
  meetingType: text('meeting_type', {
    enum: ['Online', 'In-Location'],
  }).notNull(),

  status: text('status', {
    enum: [
      'PENDING',
      'ACCEPTED',
      'CONFIRMED',
      'REJECTED',
    ],
  })
    .default('PENDING')
    .notNull(),

  // یادداشت‌ها
  clientNote: text('client_note'),
  adminNote: text('admin_note'),

  // فیلدهای سیستمی
  googleEventId: text('google_event_id'),

  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});