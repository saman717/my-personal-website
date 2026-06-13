import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, index } from 'drizzle-orm/pg-core';

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
  duration: integer('duration').default(60).notNull(),

  // 🌟 فیلدهای جدید برای تایم‌لاین و اتصال به تقویم رزرو
  date: text('date').notNull(), // YYYY-MM-DD
  timeSlot: text('time_slot'), // ساعت اختصاصی (در صورت null بودن، تسک شناور است)
  isBlocking: boolean('is_blocking').default(false).notNull(), // آیا تقویم کلاینت را قفل کند؟

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  recurrence: text("recurrence", { enum: ["none", "daily", "weekly", "monthly"] }).default("none").notNull(),
  category: text("category").default("work").notNull(),
  energyLevel: text("energy_level", { enum: ["low", "medium", "high"] }).default("medium").notNull(),
  isAttempted: boolean("is_attempted").default(false).notNull(), // آیا سراغش رفتم؟
  isAchieved: boolean("is_achieved").default(false).notNull(),   // آیا به هدفش رسیدم؟
  exceptionDates: text("exception_dates").default("[]").notNull(),
  parentId: uuid("parent_id"), // برای اتصال نمونه‌های ویرایش‌شده به قالب اصلی
}, (table) => {
  return {
    // 🚀 ایندکس برای لود فوق‌سریع تسک‌های یک هفته خاص
    dateIdx: index('tasks_date_idx').on(table.date),
  };
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
  meetingType: text('meeting_type', { enum: ['Online', 'In-Location'], }).notNull(),
  status: text('status', {
    enum: ['PENDING', 'ACCEPTED', 'CONFIRMED', 'REJECTED',],
  })
    .default('PENDING')
    .notNull(),
  // یادداشت‌ها
  clientNote: text('client_note'),
  adminNote: text('admin_note'),
  // فیلدهای سیستمی
  googleEventId: text('google_event_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// ۵. جدول تسک‌های زمان‌بندی شده ادمین (Admin Tasks)
export const adminTasks = pgTable('admin_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  // ذخیره تاریخ به فرمت متنی YYYY-MM-DD برای جلوگیری از باگ تایم‌زون
  // و هماهنگی کامل با جدول bookings
  date: text('date').notNull(),
  title: text('title').notNull(),
  // این فیلد نال‌پذیر است. وقتی ادمین در روز X تسکی اضافه می‌کند
  // لزوماً همان لحظه ساعت آن را مشخص نمی‌کند.
  timeSlot: text('time_slot'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    // 🚀 ایندکس‌گذاری: سرعت گرفتن تسک‌های یک روز خاص را فوق‌العاده بالا می‌برد
    dateIdx: index('admin_tasks_date_idx').on(table.date),
  };
});
// ۶. جدول روزهای بلاک شده دستی (Blocked Dates)
export const blockedDates = pgTable('blocked_dates', {
  id: uuid('id').defaultRandom().primaryKey(),

  // این فیلد unique است، چون یک روز را نمی‌توان دو بار بلاک کرد
  date: text('date').notNull().unique(),

  reason: text('reason'), // اختیاری: دلیل بلاک شدن (مثلاً "تعطیلات" یا "سفر کاری")
}, (table) => {
  return {
    // 🚀 ایندکس‌گذاری برای سرچ سریع در تقویم
    dateIdx: index('blocked_dates_date_idx').on(table.date),
  };
});

// این جدول جدید را در انتهای فایل schema.ts اضافه کن
export const taskLogs = pgTable("task_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  date: text("date").notNull(),
  isAttempted: boolean("is_attempted").default(false).notNull(),
  isAchieved: boolean("is_achieved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 📚 جدول قالب‌های آماده وظایف (Task Templates)
export const taskTemplates = pgTable('task_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  duration: integer('duration').default(60).notNull(),

  // اولویت اقدام
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).default('medium').notNull(),

  // دسته‌بندی موضوعی (work, personal, learning, ...)
  category: text('category').default('work').notNull(),

  // سطح انرژی مورد نیاز
  energyLevel: text('energy_level', { enum: ['low', 'medium', 'high'] }).default('medium').notNull(),

  // مسدودکننده بودن تقویم
  isBlocking: boolean('is_blocking').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});