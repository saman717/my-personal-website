"use client";

import React from "react";
import { useLifeOS } from "@/hooks/useLifeOS";

import WeeklyNav from "@/components/admin/tasks/WeeklyNav";
import TaskModal from "@/components/admin/tasks/TaskModal";
import TimelineBoard from "@/components/admin/tasks/TimelineBoard";
import FloatingBoard from "@/components/admin/tasks/FloatingBoard";

interface AdminTasksPageContentProps {
  locale: string;
  labels: any;
}

export default function AdminTasksPageContent({ locale, labels }: AdminTasksPageContentProps) {
  const isRTL = locale === "fa";

  const {
    selectedDate, setSelectedDate, dateStr, displayDateStr,
    isLoading, scheduledTasks, floatingTasks, slotCapacities,
    isModalOpen, modalTimeSlot, taskToEdit,
    handleOpenModal, handleCloseModal, handleToggleGoal, loadTasksForDate
  } = useLifeOS(locale);

  return (
    <div className="space-y-6 w-full text-gray-200 pb-20" dir={isRTL ? "rtl" : "ltr"}>

      {/* هدر صفحه */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {labels?.AdminTasksPage?.title || "سیستم مدیریت وظایف (LifeOS)"}
          </h2>
          <p className="text-xs text-gray-500">
            {labels?.AdminTasksPage?.description || "برنامه‌ریزی، اولویت‌بندی و مدیریت تسک‌های روزانه"}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-6 py-2.5 rounded-xl shadow-[0_0_15px_#10b981] transition-all flex items-center justify-center gap-2"
        >
          {/* ⚡️ اصلاح شد: با اضافه شدن ?. و فالبک، دیگر فرآیند رندر به خاطر هایدریشن متوقف نمی‌شود */}
          <span>➕</span> {labels?.AdminTasksPage?.new_task_btn || "تسک جدید"}
        </button>
      </div>

      <WeeklyNav selectedDate={selectedDate} onSelectDate={setSelectedDate} locale={locale} />

      {isLoading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-[#0d0d12]/30 border border-white/3 rounded-2xl">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_#10b981] mb-3" />
          <p className="text-xs text-gray-500 animate-pulse">
            {labels?.AdminTasksPage?.loading || "در حال دریافت برنامه..."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TimelineBoard
            displayDateStr={displayDateStr}
            scheduledTasks={scheduledTasks}
            slotCapacities={slotCapacities}
            onOpenModal={handleOpenModal}
            onToggleGoal={handleToggleGoal}
            labels={labels?.TimelineBoard}
          />
          <FloatingBoard
            floatingTasks={floatingTasks}
            onOpenModal={handleOpenModal}
            onToggleGoal={handleToggleGoal}
            labels={labels} // ⚡️ اصلاح شد: ارسال مستقیم جهت پردازش هوک شناور
          />
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={loadTasksForDate}
        selectedDateStr={dateStr}
        initialTimeSlot={modalTimeSlot}
        slotCapacities={slotCapacities}
        taskToEdit={taskToEdit}
        locale={locale} // 🌟 ارسال لوکال فعال
        labels={labels?.TaskModal}
      />
    </div>
  );
}