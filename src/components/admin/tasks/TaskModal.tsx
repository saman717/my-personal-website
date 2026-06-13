"use client";

import React from "react";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";
import { useTaskForm } from "@/hooks/useTaskForm";
import { Task } from "@/types/task";
import { useTranslate } from "@/hooks/useTranslate";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  selectedDateStr: string;
  initialTimeSlot: string | null;
  slotCapacities: Record<string, number>;
  taskToEdit?: Task | null;
}

export default function TaskModal(props: TaskModalProps) {
  const { t, locale } = useTranslate();

  const {
    title, setTitle, description, setDescription, priority, setPriority,
    timeSlot, setTimeSlot, isBlocking, setIsBlocking, duration, setDuration,
    recurrence, setRecurrence, category, setCategory, energyLevel, setEnergyLevel,
    editScope, setEditScope, isSubmitting, isEditMode, handleSubmit, handleDelete,
    maxAllowedDuration, 
    selectedTemplateId, setSelectedTemplateId,
    saveAsTemplate, setSaveAsTemplate,
    templates = [], 
    handleTemplateSelect
  } = useTaskForm(props);

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir={locale === "fa" ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={props.onClose} />

      <div className="relative bg-[#0d0d12] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-4 md:p-5 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${isEditMode ? "bg-amber-500 shadow-amber-500" : "bg-emerald-500 shadow-emerald-500"}`} />
            {isEditMode ? t("adminTask.TaskModal.title_edit") : t("adminTask.TaskModal.title_create").replace("{date}", props.selectedDateStr)}
          </h3>
          <button onClick={props.onClose} className="text-gray-500 hover:text-white text-2xl leading-none transition-colors">×</button>
        </div>

        <form id="task-form" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 admin-neon-scrollbar">

            {/* Templates */}
            {!isEditMode && templates.length > 0 && (
              <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 mb-2">
                <label className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">📚 انتخاب از قالب‌های آماده</label>
                <select
                  value={selectedTemplateId || ""}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    if (e.target.value) handleTemplateSelect(e.target.value);
                  }}
                  className="bg-[#07070a] border border-purple-500/30 text-xs text-purple-200 rounded-xl px-3 h-10 focus:outline-none focus:border-purple-500/50 w-full transition-all"
                >
                  <option value="">-- تسک اختصاصی و جدید --</option>
                  {templates.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>{tmpl.title} ({tmpl.duration} دقیقه)</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.task_title_label")}</label>
              <input type="text" required placeholder={t("adminTask.TaskModal.task_title_placeholder")} value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#07070a] border border-white/5 rounded-xl px-4 h-11 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all w-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.time_slot_label")}</label>
                {/* 🌟 بخش اصلی که فیکس شد تا null نفرستد */}
                <select 
                  value={timeSlot || "floating"} 
                  onChange={(e) => setTimeSlot(e.target.value)} 
                  className="bg-[#07070a] border border-white/5 text-xs text-gray-300 rounded-xl px-3 h-11 focus:outline-none w-full"
                >
                  <option value="floating">{t("adminTask.TaskModal.floating_slot")}</option>
                  {MASTER_TIME_SLOTS.map((slot) => {
                    const availableMinutes = 60 - (props.slotCapacities?.[slot] || 0);
                    const isCurrentSlot = isEditMode && props.taskToEdit?.timeSlot === slot;
                    return <option key={slot} value={slot} disabled={availableMinutes <= 0 && !isCurrentSlot}>{slot}</option>;
                  })}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.priority_label")}</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="bg-[#07070a] border border-white/5 text-xs text-gray-300 rounded-xl px-3 h-11 focus:outline-none w-full">
                  <option value="low">{t("adminTask.TaskModal.priority_low")}</option>
                  <option value="medium">{t("adminTask.TaskModal.priority_medium")}</option>
                  <option value="high">{t("adminTask.TaskModal.priority_high")}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.duration_label")}</label>
                <input
                  type="number"
                  min="5"
                  max={maxAllowedDuration}
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Math.min(Number(e.target.value), maxAllowedDuration))}
                  className="bg-[#07070a] border border-white/5 text-xs text-emerald-400 font-bold rounded-xl px-3 h-11 text-center focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.recurrence_label")}</label>
                <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as any)} className="bg-[#07070a] border border-white/5 text-xs text-gray-300 rounded-xl px-3 h-11 focus:outline-none w-full">
                  <option value="none">{t("adminTask.TaskModal.recurrence_none")}</option>
                  <option value="daily">{t("adminTask.TaskModal.recurrence_daily")}</option>
                  <option value="weekly">{t("adminTask.TaskModal.recurrence_weekly")}</option>
                  <option value="monthly">{t("adminTask.TaskModal.recurrence_monthly")}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.category_label")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-[#07070a] border border-white/5 text-xs text-gray-300 rounded-xl px-3 h-11 focus:outline-none w-full">
                  <option value="work">{t("adminTask.TaskModal.category_work")}</option>
                  <option value="personal">{t("adminTask.TaskModal.category_personal")}</option>
                  <option value="learning">{t("adminTask.TaskModal.category_learning")}</option>
                  <option value="health">{t("adminTask.TaskModal.category_health")}</option>
                  <option value="free">{t("adminTask.TaskModal.category_free")}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.energy_label")}</label>
                <select value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value as any)} className="bg-[#07070a] border border-white/5 text-xs text-gray-300 rounded-xl px-3 h-11 focus:outline-none w-full">
                  <option value="low">{t("adminTask.TaskModal.energy_low")}</option>
                  <option value="medium">{t("adminTask.TaskModal.energy_medium")}</option>
                  <option value="high">{t("adminTask.TaskModal.energy_high")}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t("adminTask.TaskModal.description_label")}</label>
              <textarea rows={3} placeholder={t("adminTask.TaskModal.description_placeholder")} value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#07070a] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none resize-none w-full" />
            </div>

            <div className="p-3 sm:p-4 rounded-xl border border-white/3 bg-white/[0.01] flex items-center justify-between cursor-pointer w-full" onClick={() => setIsBlocking(!isBlocking)}>
              <div className="pr-3">
                <h4 className="text-xs font-bold text-gray-200">{t("adminTask.TaskModal.blocking_title")}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{t("adminTask.TaskModal.blocking_desc")}</p>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ${isBlocking ? "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-gray-700"}`}>
                <div className={`absolute top-0.5 ${locale === "en" ? "left-0.5" : "right-0.5"} w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isBlocking ? (locale === "en" ? "translate-x-5" : "-translate-x-5") : "translate-x-0"}`} />
              </div>
            </div>

            {/* Save Template */}
            {!isEditMode && (
              <label className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 transition-colors ${selectedTemplateId ? "opacity-50 cursor-not-allowed bg-black/20" : "cursor-pointer hover:bg-white/5"}`}>
                <div className={`relative flex items-center justify-center w-5 h-5 rounded border transition-all ${saveAsTemplate && !selectedTemplateId ? "bg-emerald-500 border-emerald-500" : "bg-[#07070a] border-white/20"}`}>
                  <input
                    type="checkbox"
                    disabled={!!selectedTemplateId}
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                    className="sr-only"
                  />
                  <svg className={`w-3.5 h-3.5 text-black transition-all duration-200 ${saveAsTemplate && !selectedTemplateId ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block select-none">💾 ذخیره ترکیب فعلی به عنوان قالب جدید</span>
                  <span className="text-[9px] text-gray-500 block">برای استفاده سریع در روزهای آینده</span>
                </div>
              </label>
            )}

            {isEditMode && props.taskToEdit?.recurrence !== "none" && (
              <div className="p-3 sm:p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 w-full">
                <h4 className="text-xs font-bold text-amber-400 mb-3">⚠️ دامنه تغییرات وظیفه تکرارشونده</h4>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="editScope" checked={editScope === "single"} onChange={() => setEditScope("single")} className="accent-amber-500 w-4 h-4" />
                    <span className="text-[11px] text-gray-300 font-medium">فقط در همین روز</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="editScope" checked={editScope === "all"} onChange={() => setEditScope("all")} className="accent-amber-500 w-4 h-4" />
                    <span className="text-[11px] text-gray-300 font-medium">در تمام روزها</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 p-4 border-t border-white/5 bg-[#0a0a0f] flex flex-col sm:flex-row gap-3">
            {isEditMode && (
              <button type="button" onClick={handleDelete} disabled={isSubmitting} className="w-full sm:w-auto px-4 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold text-xs py-3 sm:py-2.5 rounded-xl transition-all order-3 sm:order-1">
                {t("adminTask.TaskModal.btn_delete")}
              </button>
            )}
            <button type="button" onClick={props.onClose} className="w-full sm:flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs py-3 sm:py-2.5 rounded-xl transition-all order-2">
              {t("adminTask.TaskModal.btn_cancel")}
            </button>
            <button type="submit" disabled={isSubmitting || !title.trim()} className={`w-full sm:flex-1 font-bold text-xs py-3 sm:py-2.5 rounded-xl transition-all order-1 sm:order-3 ${isEditMode ? "bg-amber-500 hover:bg-amber-600 text-black shadow-[0_0_15px_#f59e0b]" : "bg-emerald-500 hover:bg-emerald-600 text-black shadow-[0_0_15px_#10b981]"}`}>
              {isSubmitting ? t("adminTask.TaskModal.btn_submitting") : isEditMode ? t("adminTask.TaskModal.btn_submit_edit") : t("adminTask.TaskModal.btn_submit_create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}