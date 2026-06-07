"use client";

import React, { useState, useEffect } from "react";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";
import { 
  createAdminTaskAction, 
  toggleBlockDateAction, 
  assignTimeToTaskAction,
  getAdminTasksAction 
} from "@/actions/admin-calendar"; 
import { getAvailableSlotsAction } from "@/actions/booking";

interface TaskItem {
  id: string;
  date: string;
  title: string;
  timeSlot: string | null;
  createdAt: Date;
}

export default function AdminCalendarManager() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isDayBlocked, setIsDayBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFormattedDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const dateStr = getFormattedDateString(selectedDate);

  const refreshData = async () => {
    setIsLoading(true);
    const tasksRes = await getAdminTasksAction(dateStr);
    if (tasksRes.success) setTasks(tasksRes.data as TaskItem[]);

    const slotsRes = await getAvailableSlotsAction(dateStr);
    setIsDayBlocked(slotsRes.message === "این روز تعطیل است");
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [dateStr]);

  const handleToggleBlock = async () => {
    setIsSubmitting(true);
    const res = await toggleBlockDateAction(dateStr);
    if (res.success) {
      await refreshData();
    }
    setIsSubmitting(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await createAdminTaskAction(dateStr, taskTitle);
    if (res.success) {
      setTaskTitle("");
      await refreshData();
    }
    setIsSubmitting(false);
  };

  // 🌟 تابع اختصاص ساعت به تسک ادمین
  const handleAssignTime = async (taskId: string, timeSlot: string) => {
    const finalSlot = timeSlot === "floating" ? null : timeSlot;
    const res = await assignTimeToTaskAction(taskId, finalSlot || "");
    if (res.success) {
      await refreshData();
    }
  };

  // 🗓️ توابع جابجایی سریع روزها برای ادمین
  const changeDateByAmount = (amount: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full text-gray-200">
      
      {/* 🔮 ستون اول: ناوبر تاریخ (Date Navigator) و وضعیت بلاک */}
      <div className="bg-[#0d0d12]/60 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 relative flex flex-col justify-between min-h-[320px]">
        <div>
          <h3 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">
            📅 مدیریت زمان و تاریخ
          </h3>

          {/* 🌟 بخش جدید: کنترلر و ناوبری پیشرفته تاریخ */}
          <div className="flex flex-col gap-2.5 mb-5">
            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">انتخاب تاریخ جهت مدیریت</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changeDateByAmount(-1)}
                className="bg-[#07070a] border border-white/5 hover:border-emerald-500/30 w-10 h-10 rounded-xl flex items-center justify-center text-xs transition-all"
              >
                ◀
              </button>
              <input 
                type="date" 
                value={dateStr}
                onChange={(e) => {
                  if(e.target.value) setSelectedDate(new Date(e.target.value));
                }}
                className="flex-1 text-center bg-[#07070a] border border-white/5 rounded-xl h-10 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500/50 transition-all custom-calendar-input"
              />
              <button 
                onClick={() => changeDateByAmount(1)}
                className="bg-[#07070a] border border-white/5 hover:border-emerald-500/30 w-10 h-10 rounded-xl flex items-center justify-center text-xs transition-all"
              >
                ▶
              </button>
            </div>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="text-[10px] text-center text-emerald-500/70 hover:text-emerald-400 font-bold transition-all mt-1"
            >
              بازگشت به امروز
            </button>
          </div>
          
          {/* گوی وضعیت نئونی داینامیک */}
          <div className="flex items-center gap-2 mb-4 bg-[#07070a]/50 p-3 rounded-xl border border-white/[0.02]">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isDayBlocked ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'}`} />
            <span className="text-xs font-medium">
              {isLoading ? "در حال پایش..." : isDayBlocked ? "این روز کلاً مسدود است" : "این روز باز و قابل رزرو است"}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleToggleBlock}
          disabled={isSubmitting || isLoading}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 border mt-4 ${
            isDayBlocked 
              ? "bg-red-500/5 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-red-500"
              : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500"
          } disabled:opacity-50`}
        >
          {isSubmitting ? "در حال اعمال..." : isDayBlocked ? "🔓 باز کردن این روز" : "🔒 مسدود کردن کل روز"}
        </button>
      </div>

      {/* 📝 ستون دوم و سوم: مدیریت تسک‌ها و زمان‌بندی */}
      <form onSubmit={handleAddTask} className="lg:col-span-2 bg-[#0d0d12]/60 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">
            ⚡ تسک‌های شناور و تخصیص اسلات زمانی
          </h3>
          
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="عنوان تسک جدید (مثلاً: جلسه با نوید در کافه)..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              disabled={isSubmitting || isDayBlocked}
              className="flex-1 bg-[#07070a] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all disabled:opacity-30"
            />
            <button 
              type="submit"
              disabled={isSubmitting || !taskTitle.trim() || isDayBlocked}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-900/20 disabled:text-gray-600 text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-[0_0_15px_#10b981] disabled:shadow-none transition-all shrink-0"
            >
              افزودن
            </button>
          </div>

          {/* لیست تسک‌ها */}
          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-3 admin-neon-scrollbar">
            {isLoading ? (
              <p className="text-xs text-gray-500 text-center py-8 animate-pulse">در حال خواندن تسک‌های سرور...</p>
            ) : tasks.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">تسکی برای این روز ثبت نشده است.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-[#07070a]/40 border border-white/[0.02]">
                  <span className="text-xs font-medium text-gray-300">{task.title}</span>
                  
                  {/* 🌟 بخش جدید: دراپ‌داون فوق‌العاده شیکِ انتخاب اسلات زمانی ۸ تا ۲۱ برای هر تسک */}
                  <select
                    value={task.timeSlot || "floating"}
                    onChange={(e) => handleAssignTime(task.id, e.target.value)}
                    className="bg-[#07070a] border border-white/5 text-[11px] text-emerald-400 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500/40 transition-all cursor-pointer"
                  >
                    <option value="floating" className="bg-[#0d0d12] text-gray-400">🕒 شناور (بدون زمان)</option>
                    {MASTER_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#0d0d12] text-gray-200">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </div>
      </form>

    </div>
  );
}