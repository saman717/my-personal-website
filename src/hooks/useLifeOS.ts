import { useState, useEffect, useMemo } from "react";
import { getTasksForDateAction, updateTaskGoalsAction } from "@/actions/tasks";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";
import { Task } from "@/types/task";

export function useLifeOS(locale: string) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // استیت‌های مودال
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTimeSlot, setModalTimeSlot] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // محاسبات تاریخ
  const dateStr = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const displayDateStr = useMemo(() => {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(selectedDate);
  }, [selectedDate, locale]);

  // توابع کنترل مودال
  const handleOpenModal = (timeSlot: string | null = null, task: Task | null = null) => {
    setModalTimeSlot(timeSlot);
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  // دریافت اطلاعات از سرور
  const loadTasksForDate = async () => {
    setIsLoading(true);
    try {
      const res = await getTasksForDateAction(dateStr);
      if (res.success && res.data) {
        setTasks(res.data as unknown as Task[]);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // هندلر تیک زدن اهداف (Optimistic UI)
  const handleToggleGoal = async (taskId: string, currentAttempted: boolean, currentAchieved: boolean, field: "attempt" | "achieve") => {
    const newAttempted = field === "attempt" ? !currentAttempted : currentAttempted;
    const newAchieved = field === "achieve" ? !currentAchieved : (field === "attempt" && currentAttempted ? false : currentAchieved);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isAttempted: newAttempted, isAchieved: newAchieved } : t));
    await updateTaskGoalsAction(taskId, newAttempted, newAchieved, dateStr);
  };

  useEffect(() => {
    loadTasksForDate();
  }, [dateStr]);

  // تفکیک تسک‌ها
  const scheduledTasks = useMemo(() => tasks.filter(t => t.timeSlot !== null), [tasks]);
  const floatingTasks = useMemo(() => tasks.filter(t => t.timeSlot === null), [tasks]);

  // محاسبه ظرفیت
  const slotCapacities = useMemo(() => {
    const capacities: Record<string, number> = {};
    MASTER_TIME_SLOTS.forEach(slot => {
      const tasksInSlot = scheduledTasks.filter(t => t.timeSlot === slot);
      capacities[slot] = tasksInSlot.reduce((acc, curr) => acc + curr.duration, 0);
    });
    return capacities;
  }, [scheduledTasks]);

  return {
    selectedDate, setSelectedDate, dateStr, displayDateStr,
    isLoading, scheduledTasks, floatingTasks, slotCapacities,
    isModalOpen, modalTimeSlot, taskToEdit,
    handleOpenModal, handleCloseModal, handleToggleGoal, loadTasksForDate
  };
}