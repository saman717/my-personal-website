"use client";
import React from "react";
import { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import { useFloatingBoard } from "@/hooks/useFloatingBoard";

interface FloatingBoardProps {
  floatingTasks: Task[];
  onOpenModal: (slot: string | null, task?: Task | null) => void;
  onToggleGoal: (taskId: string, attempted: boolean, achieved: boolean, field: "attempt" | "achieve") => void;
}

export default function FloatingBoard({ floatingTasks, onOpenModal, onToggleGoal }: FloatingBoardProps) {
  // جدا کردن منطق نمایش و ترجمه از ظاهر
  const { title, emptyState, footerHint } = useFloatingBoard(floatingTasks);

  return (
    <div className="lg:col-span-1 bg-[#0d0d12]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col h-[600px] lg:h-auto lg:sticky lg:top-6">

      {/* هدر */}
      <h3 className="text-sm font-bold text-white mb-6 border-b border-white/5 pb-4 flex justify-between items-center">
        <span>{title}</span>
        <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">{floatingTasks.length}</span>
      </h3>

      {/* لیست تسک‌ها */}
      <div className="flex-1 overflow-y-auto p-2 admin-neon-scrollbar space-y-4">
        {floatingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2 opacity-50">
            <span className="text-2xl">{emptyState.icon}</span>
            <p className="text-[10px]">{emptyState.message}</p>
          </div>
        ) : (
          floatingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onOpenModal}
              onToggleGoal={onToggleGoal}
              variant="floating"
            />
          ))
        )}
      </div>

      {/* فوتر توضیحات */}
      <p className="text-[9px] text-gray-500 mt-4 text-center">
        {footerHint}
      </p>
    </div>
  );
}