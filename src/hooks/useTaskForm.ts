import { useState, useEffect } from "react";
import { createTaskAction, updateTaskAction, deleteTaskAction, TaskPriority } from "@/actions/tasks";
import { Task } from "@/types/task";
import { useTranslate } from "@/hooks/useTranslate"; // 🌟 ایمپورت هوک ترجمه خودت

interface UseTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  selectedDateStr: string;
  initialTimeSlot: string | null;
  slotCapacities: Record<string, number>;
  taskToEdit?: Task | null;
}

export function useTaskForm({ isOpen, onClose, onSuccess, selectedDateStr, initialTimeSlot, slotCapacities, taskToEdit }: UseTaskFormProps) {
  const { t } = useTranslate(); // 🌟 دریافت تابع t

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [timeSlot, setTimeSlot] = useState<string>("floating");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duration, setDuration] = useState<number>(60);
  const [recurrence, setRecurrence] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [category, setCategory] = useState("free");
  const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high">("medium");
  const [editScope, setEditScope] = useState<"single" | "all">("single");

  const isEditMode = !!taskToEdit;

  const currentSlotUsedMinutes = timeSlot !== "floating" && slotCapacities ? (slotCapacities[timeSlot] || 0) : 0;
  const baseUsed = isEditMode && taskToEdit?.timeSlot === timeSlot ? (currentSlotUsedMinutes - (taskToEdit?.duration || 0)) : currentSlotUsedMinutes;
  const maxAllowedDuration = timeSlot !== "floating" ? (60 - baseUsed) : 480;

  useEffect(() => {
    if (duration > maxAllowedDuration && timeSlot !== "floating") setDuration(maxAllowedDuration > 0 ? maxAllowedDuration : 5);
  }, [timeSlot, maxAllowedDuration]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && taskToEdit) {
        setTitle(taskToEdit.title); setDescription(taskToEdit.description || ""); setPriority(taskToEdit.priority);
        setTimeSlot(taskToEdit.timeSlot || "floating"); setIsBlocking(taskToEdit.isBlocking); setDuration(taskToEdit.duration);
        setRecurrence((taskToEdit.recurrence || "none") as any); setCategory(taskToEdit.category || "free");
        setEnergyLevel((taskToEdit.energyLevel || "medium") as any); setEditScope("single");
      } else {
        setTitle(""); setDescription(""); setPriority("medium"); setTimeSlot(initialTimeSlot || "floating");
        setIsBlocking(false); setDuration(60); setRecurrence("none"); setCategory("free"); setEnergyLevel("medium"); setEditScope("single");
      }
    }
  }, [isOpen, initialTimeSlot, taskToEdit, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const finalSlot = timeSlot === "floating" ? null : timeSlot;
    let res;

    if (isEditMode && taskToEdit) {
      res = await updateTaskAction(taskToEdit.id, title, finalSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel, editScope, selectedDateStr);
    } else {
      res = await createTaskAction(title, selectedDateStr, finalSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel);
    }

    if (res.success) {
      await onSuccess(); onClose();
    } else {
      alert(res.error || t("adminTask.TaskModal.alert_error")); // 🌟 مسیر تو در فایل json
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!taskToEdit?.id || !window.confirm(t("adminTask.TaskModal.alert_delete_confirm"))) return; // 🌟 مسیر تو در فایل json
    setIsSubmitting(true);
    const res = await deleteTaskAction(taskToEdit.id, editScope, selectedDateStr);
    if (res.success) {
      await onSuccess(); onClose();
    } else {
      alert(res.error || t("adminTask.TaskModal.alert_error"));
    }
    setIsSubmitting(false);
  };

  return {
    title, setTitle, description, setDescription, priority, setPriority,
    timeSlot, setTimeSlot, isBlocking, setIsBlocking, duration, setDuration,
    recurrence, setRecurrence, category, setCategory, energyLevel, setEnergyLevel,
    editScope, setEditScope, isSubmitting, isEditMode, maxAllowedDuration, handleSubmit, handleDelete
  };
}