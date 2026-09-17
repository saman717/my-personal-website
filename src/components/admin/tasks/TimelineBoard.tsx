"use client";

import React from "react";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";
import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface TimelineBoardProps {
  displayDateStr: string;
  scheduledTasks: Task[];
  slotCapacities: Record<string, number>;
  onOpenModal: (slot: string | null, task?: Task | null) => void;
  onToggleGoal: (taskId: string, attempted: boolean, achieved: boolean, field: "attempt" | "achieve") => void;
  labels: any; 
}

function parseSlotToMinutes(slot: string): number {
  const [timePart, period] = slot.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  const hours = period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
  return hours * 60 + m;
}

export default function TimelineBoard({
  displayDateStr,
  scheduledTasks,
  slotCapacities,
  onOpenModal,
  onToggleGoal,
  labels
}: TimelineBoardProps) {

  return (
    <div className="lg:col-span-2 bg-[#0d0d12]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-8">
      {/* هدر بخش تایم‌لاین */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          {labels?.title ? labels.title.replace("{date}", displayDateStr) : `برنامه زمانی روز ${displayDateStr}`}
        </h3>
      </div>

      {/* خط زمانی خط‌کشی شده */}
      <div className="relative border-r-2 border-white/3 pr-6 space-y-8 before:content-[''] before:absolute before:top-0 before:-right-0.5 before:w-0.5 before:h-full before:bg-linear-to-b before:from-emerald-500/0 before:via-emerald-500/20 before:to-emerald-500/0">
        {MASTER_TIME_SLOTS.map((slot, index) => {

          const tasksForSlot = scheduledTasks.filter(t => t.timeSlot === slot);
          const totalMinutesRaw = tasksForSlot.reduce((acc, curr) => acc + Number(curr.duration || 0), 0);
          const slotStart = parseSlotToMinutes(slot);

          const ongoingTask = scheduledTasks.find(task => {
            if (!task.timeSlot || task.duration <= 60) return false;
            const taskStart = parseSlotToMinutes(task.timeSlot);
            const taskEnd = taskStart + task.duration;
            return slotStart > taskStart && slotStart < taskEnd;
          });

          const minutesOccupiedByOngoing = ongoingTask
            ? Math.min(
              parseSlotToMinutes(ongoingTask.timeSlot!) + ongoingTask.duration - slotStart,
              60
            )
            : 0;

          return (
            <div key={index} className="relative group">
              {/* نقطه نئونی روی خط زمان */}
              <div className={`absolute -right-7.75 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#0d0d12] transition-all ${tasksForSlot.length > 0 || ongoingTask ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-gray-700 group-hover:bg-emerald-500/50"}`}></div>

              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* برچسب ساعت */}
                <div className="flex flex-col shrink-0 min-w-17.5 pt-3">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{slot}</span>

                  {(tasksForSlot.length > 0 || ongoingTask) && (() => {
                    const totalOccupied = Math.min(totalMinutesRaw + minutesOccupiedByOngoing, 60);
                    return (
                      <span className={`text-[9px] mt-1 ${totalOccupied >= 60 ? "text-red-400" : "text-emerald-500/70"}`}>
                        {labels?.minutes_filled ? labels.minutes_filled.replace("{minutes}", String(totalOccupied)) : `${totalOccupied} دقیقه پر شده`}
                      </span>
                    );
                  })()}
                </div>

                {/* کارت‌ها و دکمه‌ها */}
                <div className="flex-1 flex flex-col gap-2">

                  {/* بنر وظایف طولانی */}
                  {ongoingTask && (
                    <div className="w-full p-3.5 rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5 text-[11px] text-purple-300 select-none flex items-center justify-between shadow-[inset_0_0_12px_rgba(168,85,247,0.01)]">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                        <span className="font-medium text-gray-400">
                          {labels?.ongoing_task_prefix || "🔒 ادامه وظیفه:"} <strong className="text-purple-400 font-bold">{ongoingTask.title}</strong>
                        </span>
                      </span>
                      <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-purple-400">
                        {minutesOccupiedByOngoing} {labels?.occupied_suffix || "دقیقه اشغال شده"}
                      </span>
                    </div>
                  )}

                  {/* کارت‌های تسک‌ها */}
                  {tasksForSlot.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-3">
                      {tasksForSlot.map(task => (
                        <TaskCard key={task.id} labels={labels?.TaskCard} task={task} onEdit={onOpenModal} onToggleGoal={onToggleGoal} variant="timeline" />
                      ))}
                    </div>
                  )}

                  {/* دکمه افزودن */}
                  {(() => {
                    const totalOccupied = totalMinutesRaw + minutesOccupiedByOngoing;
                    if (totalOccupied < 60) {
                      return (
                        <button onClick={() => onOpenModal(slot)} className="w-full text-center py-2 rounded-lg border border-dashed border-white/5 bg-white/1 hover:bg-white/3 text-[10px] text-gray-600 hover:text-emerald-400 transition-all">
                          {labels?.add_another_task ? labels.add_another_task.replace("{minutes}", String(60 - totalOccupied)) : `+ افزودن وظیفه دیگر (${60 - totalOccupied} دقیقه باقی‌مانده)`}
                        </button>
                      );
                    }
                    if (!tasksForSlot.length && !ongoingTask) {
                      return (
                        <button onClick={() => onOpenModal(slot)} className="w-full text-right p-3 rounded-xl border border-dashed border-white/5 bg-white/1 hover:bg-white/3 hover:border-emerald-500/30 text-[11px] text-gray-600 hover:text-emerald-400 transition-all mt-1.5">
                          {labels?.add_task || "+ افزودن وظیفه جدید برای این ساعت"}
                        </button>
                      );
                    }
                    return null;
                  })()}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}