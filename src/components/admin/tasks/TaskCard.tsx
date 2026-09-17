"use client";

import React from "react";
import { Task } from "@/types/task";

const priorityStyles: Record<string, string> = {
  low: "border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
  medium: "border-yellow-400/30 bg-yellow-400/5 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.1)]",
  high: "border-red-500/30 bg-red-500/5 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
};

interface TaskCardProps {
  task: Task;
  onEdit: (slot: string | null, task: Task) => void;
  onToggleGoal: (taskId: string, attempted: boolean, achieved: boolean, field: "attempt" | "achieve") => void;
  variant: "timeline" | "floating";
  labels: any; // 🌟 دریافت لیبل‌ها
}

export default function TaskCard({ task, onEdit, onToggleGoal, variant, labels }: TaskCardProps) {
  const l = labels || {}; // گارد امنیتی

  const wrapperClass = variant === "timeline"
    ? "flex-1 min-w-[240px] p-4 rounded-xl border flex flex-col gap-3 transition-all hover:scale-[1.01] cursor-pointer"
    : "p-4 rounded-xl border flex flex-col gap-3 cursor-pointer transition-transform hover:scale-[1.02]";

  return (
    <div onClick={() => onEdit(task.timeSlot, task)} className={`${wrapperClass} ${priorityStyles[task.priority]}`}>
      <div className="flex items-start justify-between gap-2">
        <h4 className={`text-xs font-bold transition-all ${task.isAchieved ? "text-gray-500 line-through" : "text-white"}`}>
          {task.title}
        </h4>
        <span className="shrink-0 text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
          ⏱️ {l.minutes?.replace("{count}", String(task.duration)) || `${task.duration}m`}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
          {l.categories?.[task.category] || task.category}
        </span>

        <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded border ${
            task.energyLevel === "high" ? "bg-red-500/10 border-red-500/20 text-red-400" :
            task.energyLevel === "medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
          {l.energy?.prefix || "Energy:"} {l.energy?.[task.energyLevel] || task.energyLevel}
        </span>

        {task.isBlocking && (
          <span className="text-[8px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
            {l.blocking || "Blocking"}
          </span>
        )}
      </div>

      {task.description && (
        <p className={`text-[10px] line-clamp-2 ${task.isAchieved ? "text-gray-600" : "text-gray-400"}`}>
          {task.description}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-start gap-5" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`relative flex items-center justify-center w-4 h-4 rounded border transition-all ${task.isAttempted ? "bg-blue-500/20 border-blue-500/50" : "bg-[#07070a] border-white/10 group-hover:border-blue-500/50"}`}>
            <input type="checkbox" checked={task.isAttempted} onChange={() => onToggleGoal(task.id, task.isAttempted, task.isAchieved, "attempt")} className="sr-only" />
            <svg className={`w-3 h-3 text-blue-400 transition-all duration-200 ${task.isAttempted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className={`text-[10px] font-bold select-none transition-colors ${task.isAttempted ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}>
            {l.done_label || "Done"}
          </span>
        </label>

        <label className={`flex items-center gap-2 ${!task.isAttempted ? "opacity-40 cursor-not-allowed" : "cursor-pointer group"}`}>
          <div className={`relative flex items-center justify-center w-4 h-4 rounded border transition-all ${task.isAchieved ? "bg-emerald-500/20 border-emerald-500/50" : "bg-[#07070a] border-white/10 group-hover:border-emerald-500/50"}`}>
            <input type="checkbox" disabled={!task.isAttempted} checked={task.isAchieved} onChange={() => onToggleGoal(task.id, task.isAttempted, task.isAchieved, "achieve")} className="sr-only" />
            <svg className={`w-3 h-3 text-emerald-400 transition-all duration-200 ${task.isAchieved ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className={`text-[10px] font-bold select-none transition-colors ${task.isAchieved ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"}`}>
            {l.achieved_label || "Achieved"}
          </span>
        </label>
      </div>
    </div>
  );
}