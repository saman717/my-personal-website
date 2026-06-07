"use client";

import React from "react";
import { useLifeOS } from "@/hooks/useLifeOS";
import { useTranslate } from "@/hooks/useTranslate";

import WeeklyNav from "@/components/admin/tasks/WeeklyNav";
import TaskModal from "@/components/admin/tasks/TaskModal";
import TimelineBoard from "@/components/admin/tasks/TimelineBoard";
import FloatingBoard from "@/components/admin/tasks/FloatingBoard";

export default function AdminTasksPage() {
  const { locale, t } = useTranslate(); // 🌟 اضافه کردن تابع t از هوک ترجمه
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
          <h2 className="text-xl font-bold text-white tracking-wide">{t("adminTask.AdminTasksPage.title")}</h2>
          <p className="text-xs text-gray-500">{t("adminTask.AdminTasksPage.description")}</p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-6 py-2.5 rounded-xl shadow-[0_0_15px_#10b981] transition-all flex items-center justify-center gap-2"
        >
          <span>➕</span> {t("adminTask.AdminTasksPage.new_task_btn")}
        </button>
      </div>

      <WeeklyNav selectedDate={selectedDate} onSelectDate={setSelectedDate} locale={locale} />

      {isLoading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-[#0d0d12]/30 border border-white/3 rounded-2xl">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_#10b981] mb-3" />
          <p className="text-xs text-gray-500 animate-pulse">{t("adminTask.AdminTasksPage.loading")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TimelineBoard 
            displayDateStr={displayDateStr} 
            scheduledTasks={scheduledTasks} 
            slotCapacities={slotCapacities} 
            onOpenModal={handleOpenModal} 
            onToggleGoal={handleToggleGoal} 
          />
          <FloatingBoard 
            floatingTasks={floatingTasks} 
            onOpenModal={handleOpenModal} 
            onToggleGoal={handleToggleGoal} 
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
      />
    </div>
  );
}