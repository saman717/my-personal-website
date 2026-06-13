import { useState, useEffect } from "react";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  getTaskTemplatesAction,
  createTaskTemplateAction,
  TaskPriority
} from "@/actions/tasks";
import { Task } from "@/types/task";
import { useTranslate } from "@/hooks/useTranslate";
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";

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
  const { t } = useTranslate();

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

  // 🌟 استیت‌های سیستم قالب‌ها
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [saveAsTemplate, setSaveAsTemplate] = useState<boolean>(false);

  const isEditMode = !!taskToEdit;

  // 🌟 موتور اسکنرِ تداخل: محاسبه سقف مجاز زمان بر اساس تسک‌های آینده (رفع باگ Overlap)
  const calculateMaxDuration = () => {
    if (timeSlot === "floating" || !slotCapacities) return 480; // حداکثر 8 ساعت

    const startIndex = MASTER_TIME_SLOTS.indexOf(timeSlot);
    if (startIndex === -1) return 480;

    let availableMins = 0;

    // از ساعت انتخابی تا آخر شب را اسکن می‌کنیم
    for (let i = startIndex; i < MASTER_TIME_SLOTS.length; i++) {
      const slot = MASTER_TIME_SLOTS[i];
      let usedInThisSlot = slotCapacities[slot] || 0;

      // در حالت ویرایش، زمانِ خود همین تسک را نادیده می‌گیریم
      if (isEditMode && taskToEdit?.timeSlot === slot) {
        usedInThisSlot = Math.max(0, usedInThisSlot - taskToEdit.duration);
      }

      // 🚨 اگر به ساعت‌های بعدی رسیدیم و دیدیم پر است، ترمز می‌کشیم!
      if (i !== startIndex && usedInThisSlot > 0) {
        break;
      }

      availableMins += 60; // اضافه کردن یک ساعت به ظرفیت
      if (availableMins >= 480) break; // سقف نهایی ۸ ساعت
    }

    // کسر کردن دقایقی که در همان ساعتِ اول اشغال شده
    const baseUsedInFirstSlot = isEditMode && taskToEdit?.timeSlot === timeSlot
      ? Math.max(0, (slotCapacities[timeSlot] || 0) - taskToEdit.duration)
      : (slotCapacities[timeSlot] || 0);

    return Math.max(availableMins - baseUsedInFirstSlot, 5);
  };

  const maxAllowedDuration = calculateMaxDuration();

  // دریافت قالب‌ها از دیتابیس در زمان باز شدن فرم
  useEffect(() => {
    if (isOpen && !isEditMode) {
      getTaskTemplatesAction().then(res => {
        if (res.success) setTemplates(res.data);
      });
    }
  }, [isOpen, isEditMode]);

  // محدودکننده خودکار مدت‌زمان در صورت تداخل
  useEffect(() => {
    if (timeSlot !== "floating" && duration > maxAllowedDuration) {
      setDuration(maxAllowedDuration > 0 ? maxAllowedDuration : 5);
    }
  }, [timeSlot, maxAllowedDuration]);

  // تنظیم مقادیر اولیه در زمان باز شدن مودال
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && taskToEdit) {
        setTitle(taskToEdit.title); setDescription(taskToEdit.description || ""); setPriority(taskToEdit.priority);
        setTimeSlot(taskToEdit.timeSlot || "floating"); setIsBlocking(taskToEdit.isBlocking); setDuration(taskToEdit.duration);
        setRecurrence((taskToEdit.recurrence || "none") as any); setCategory(taskToEdit.category || "free");
        setEnergyLevel((taskToEdit.energyLevel || "medium") as any); setEditScope("single");
      } else {
        setTitle(""); setDescription(""); setPriority("medium"); setTimeSlot(initialTimeSlot || "floating");
        setIsBlocking(false); setDuration(60); setRecurrence("none"); setCategory("work"); setEnergyLevel("medium"); setEditScope("single");
        setSelectedTemplateId(""); setSaveAsTemplate(false);
      }
    }
  }, [isOpen, initialTimeSlot, taskToEdit, isEditMode]);

  // تزریق داده‌های قالب به فرم
  const handleTemplateSelect = (tmplId: string) => {
    if (!tmplId) return;
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      setTitle(tmpl.title);
      setDuration(tmpl.duration);
      setPriority(tmpl.priority);
      setCategory(tmpl.category);
      setEnergyLevel(tmpl.energyLevel);
      setIsBlocking(tmpl.isBlocking);
      setDescription(tmpl.description || "");
      setSaveAsTemplate(false); // گارد ذخیره مجدد
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    if (timeSlot !== "floating" && duration > maxAllowedDuration) {
      alert("خطا: مدت زمان انتخابی شما با وظایف بعدی در این روز تداخل دارد!");
      return;
    }

    setIsSubmitting(true);
    const finalSlot = timeSlot === "floating" ? null : timeSlot;
    let res;

    if (isEditMode && taskToEdit) {
      res = await updateTaskAction(taskToEdit.id, title, finalSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel, editScope, selectedDateStr);
    } else {
      res = await createTaskAction(title, selectedDateStr, finalSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel);
    }

    if (res.success) {
      // ذخیره قالب جدید در صورت انتخاب تیک
      if (!isEditMode && saveAsTemplate && !selectedTemplateId) {
        await createTaskTemplateAction(title, duration, description, priority, category, energyLevel, isBlocking);
      }

      await onSuccess();
      onClose();
    } else {
      alert(res.error || t("adminTask.TaskModal.alert_error"));
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!taskToEdit?.id || !window.confirm(t("adminTask.TaskModal.alert_delete_confirm"))) return;
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
    editScope, setEditScope, isSubmitting, isEditMode, maxAllowedDuration, handleSubmit, handleDelete,

    selectedTemplateId, setSelectedTemplateId,
    saveAsTemplate, setSaveAsTemplate,
    templates, handleTemplateSelect
  };
}