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

// ─── Portfolio ────────────────────────────────────────────────────────────────

// ۷. جدول اصلی پروژه‌ها
export const portfolioProjects = pgTable('portfolio_projects', {
  id:          uuid('id').defaultRandom().primaryKey(),
  slug:        text('slug').notNull().unique(),
  status:      text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  sortOrder:   integer('sort_order').default(0).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sortIdx: index('portfolio_projects_sort_idx').on(table.sortOrder),
}));

// ۸. ترجمه‌های هر پروژه (fa / en)
export const portfolioProjectTranslations = pgTable('portfolio_project_translations', {
  id:             uuid('id').defaultRandom().primaryKey(),
  projectId:      uuid('project_id').references(() => portfolioProjects.id, { onDelete: 'cascade' }).notNull(),
  locale:         text('locale', { enum: ['fa', 'en'] }).notNull(),
  title:          text('title').notNull(),
  brief:          text('brief').notNull(),
  badge:          text('badge'),
  metaRole:       text('meta_role'),
  metaPlatform:   text('meta_platform'),
  metaCategory:   text('meta_category'),
  metaStatus:     text('meta_status'),
  challengeTitle: text('challenge_title'),
  challengeText:  text('challenge_text'),
  solutionTitle:  text('solution_title'),
  solutionSteps:  jsonb('solution_steps').$type<{ step: string; detail?: string }[]>(),
  resultsTitle:   text('results_title'),
  resultsItems:   jsonb('results_items').$type<{ label: string; value: string }[]>(),
  techStackTitle: text('tech_stack_title'),
  createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ۹. محتوای HTML آزاد (مجزا برای توسعه‌پذیری)
export const portfolioProjectContent = pgTable('portfolio_project_content', {
  id:          uuid('id').defaultRandom().primaryKey(),
  projectId:   uuid('project_id').references(() => portfolioProjects.id, { onDelete: 'cascade' }).notNull(),
  locale:      text('locale', { enum: ['fa', 'en'] }).notNull(),
  contentHtml: text('content_html').default('').notNull(),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ۱۰. تکنولوژی‌ها (جدول مستقل)
export const portfolioTechnologies = pgTable('portfolio_technologies', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  icon:      text('icon'),
  website:   text('website'), // آدرس سایت رسمی — برای لینک‌دهی در صفحات public
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ۱۱. رابط پروژه ↔ تکنولوژی
export const portfolioProjectTechnologies = pgTable('portfolio_project_technologies', {
  projectId:    uuid('project_id').references(() => portfolioProjects.id, { onDelete: 'cascade' }).notNull(),
  technologyId: uuid('technology_id').references(() => portfolioTechnologies.id, { onDelete: 'cascade' }).notNull(),
});

// ۱۲. تصاویر هر پروژه
export const portfolioProjectImages = pgTable('portfolio_project_images', {
  id:        uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => portfolioProjects.id, { onDelete: 'cascade' }).notNull(),
  url:       text('url').notNull(),
  alt:       text('alt'),
  isPrimary: integer('is_primary').default(0).notNull(), // 1 = primary, 0 = not (Supabase stores as integer)
  sortOrder: integer('sort_order').default(0).notNull(),
});

// ۱۳. لینک‌های هر پروژه (github, demo, ...)
export const portfolioProjectLinks = pgTable('portfolio_project_links', {
  id:        uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => portfolioProjects.id, { onDelete: 'cascade' }).notNull(),
  type:      text('type').notNull(), // 'github' | 'demo' | 'case_study' | ...
  url:       text('url').notNull(),
  label:     text('label'),
  sortOrder: integer('sort_order').default(0).notNull(),
});
