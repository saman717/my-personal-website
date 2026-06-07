"use client";
import React from "react";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";
import { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import { useTranslate } from "@/hooks/useTranslate"; // 🌟 ایمپورت هوک ترجمه خودت

interface TimelineBoardProps {
  displayDateStr: string;
  scheduledTasks: Task[];
  slotCapacities: Record<string, number>;
  onOpenModal: (slot: string | null, task?: Task | null) => void;
  onToggleGoal: (taskId: string, attempted: boolean, achieved: boolean, field: "attempt" | "achieve") => void;
}

export default function TimelineBoard({ displayDateStr, scheduledTasks, slotCapacities, onOpenModal, onToggleGoal }: TimelineBoardProps) {
  const { t } = useTranslate(); // 🌟 استخراج تابع ترجمه

  return (
    <div className="lg:col-span-2 bg-[#0d0d12]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-8">
      {/* هدر بخش تایم‌لاین */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          {t("adminTask.TimelineBoard.title").replace("{date}", displayDateStr)}
        </h3>
      </div>

      {/* خط زمانی خط‌کشی شده */}
      <div className="relative border-r-2 border-white/3 pr-6 space-y-8 before:content-[''] before:absolute before:top-0 before:-right-0.5 before:w-0.5 before:h-full before:bg-linear-to-b before:from-emerald-500/0 before:via-emerald-500/20 before:to-emerald-500/0">
        {MASTER_TIME_SLOTS.map((slot, index) => {
          const tasksForSlot = scheduledTasks.filter(t => t.timeSlot === slot);
          const totalMinutes = tasksForSlot.reduce((acc, curr) => acc + curr.duration, 0);

          return (
            <div key={index} className="relative group">
              {/* نقطه نئونی روی خط زمان */}
              <div className={`absolute -right-7.75 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#0d0d12] transition-all ${tasksForSlot.length > 0 ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-gray-700 group-hover:bg-emerald-500/50"}`}></div>

              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* برچسب ساعت و وضعیت پر شدن */}
                <div className="flex flex-col shrink-0 min-w-17.5 pt-3">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{slot}</span>
                  {tasksForSlot.length > 0 && (
                    <span className={`text-[9px] mt-1 ${totalMinutes > 60 ? "text-red-400" : "text-emerald-500/70"}`}>
                      {t("adminTask.TimelineBoard.minutes_filled").replace("{minutes}", String(totalMinutes))}
                    </span>
                  )}
                </div>

                {/* کارت‌ها و دکمه‌های افزودن */}
                <div className="flex-1 flex flex-col gap-2">
                  {tasksForSlot.length > 0 ? (
                    <>
                      <div className="flex flex-row flex-wrap gap-3">
                        {tasksForSlot.map(task => (
                          <TaskCard key={task.id} task={task} onEdit={onOpenModal} onToggleGoal={onToggleGoal} variant="timeline" />
                        ))}
                      </div>
                      {totalMinutes < 60 && (
                        <button onClick={() => onOpenModal(slot)} className="w-full text-center py-2 rounded-lg border border-dashed border-white/5 bg-white/1 hover:bg-white/3 text-[10px] text-gray-600 hover:text-emerald-400 transition-all">
                          {t("adminTask.TimelineBoard.add_another_task").replace("{minutes}", String(60 - totalMinutes))}
                        </button>
                      )}
                    </>
                  ) : (
                    <button onClick={() => onOpenModal(slot)} className="w-full text-right p-3 rounded-xl border border-dashed border-white/5 bg-white/1 hover:bg-white/3 hover:border-emerald-500/30 text-[11px] text-gray-600 hover:text-emerald-400 transition-all mt-1.5">
                      {t("adminTask.TimelineBoard.add_task")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}