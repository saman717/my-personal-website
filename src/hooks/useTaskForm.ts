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
import { MASTER_TIME_SLOTS } from "@/lib/calendar.config";

interface UseTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  selectedDateStr: string;
  initialTimeSlot: string | null;
  slotCapacities: Record<string, number>;
  taskToEdit?: Task | null;
  labels: any; // 🌟 اضافه کردن لیبل‌ها
}

export function useTaskForm(props: UseTaskFormProps) {
  // دسترسی مستقیم به لیبل‌های هشدار
  const alerts = props.labels?.alerts || {};

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

  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [saveAsTemplate, setSaveAsTemplate] = useState<boolean>(false);

  const isEditMode = !!props.taskToEdit;

  const calculateMaxDuration = () => {
    if (timeSlot === "floating" || !props.slotCapacities) return 480;

    const startIndex = MASTER_TIME_SLOTS.indexOf(timeSlot);
    if (startIndex === -1) return 480;

    let availableMins = 0;
    for (let i = startIndex; i < MASTER_TIME_SLOTS.length; i++) {
      const slot = MASTER_TIME_SLOTS[i];
      let usedInThisSlot = props.slotCapacities[slot] || 0;

      if (isEditMode && props.taskToEdit?.timeSlot === slot) {
        usedInThisSlot = Math.max(0, usedInThisSlot - props.taskToEdit.duration);
      }

      if (i !== startIndex && usedInThisSlot > 0) break;
      availableMins += 60;
      if (availableMins >= 480) break;
    }

    const baseUsedInFirstSlot = isEditMode && props.taskToEdit?.timeSlot === timeSlot
      ? Math.max(0, (props.slotCapacities[timeSlot] || 0) - props.taskToEdit.duration)
      : (props.slotCapacities[timeSlot] || 0);

    return Math.max(availableMins - baseUsedInFirstSlot, 5);
  };

  const maxAllowedDuration = calculateMaxDuration();

  useEffect(() => {
    if (props.isOpen && !isEditMode) {
      getTaskTemplatesAction().then(res => { if (res.success) setTemplates(res.data); });
    }
  }, [props.isOpen, isEditMode]);

  useEffect(() => {
    if (timeSlot !== "floating" && duration > maxAllowedDuration) {
      setDuration(maxAllowedDuration > 0 ? maxAllowedDuration : 5);
    }
  }, [timeSlot, maxAllowedDuration]);

  useEffect(() => {
    if (props.isOpen) {
      if (isEditMode && props.taskToEdit) {
        setTitle(props.taskToEdit.title); setDescription(props.taskToEdit.description || ""); setPriority(props.taskToEdit.priority);
        setTimeSlot(props.taskToEdit.timeSlot || "floating"); setIsBlocking(props.taskToEdit.isBlocking); setDuration(props.taskToEdit.duration);
        setRecurrence((props.taskToEdit.recurrence || "none") as any); setCategory(props.taskToEdit.category || "free");
        setEnergyLevel((props.taskToEdit.energyLevel || "medium") as any); setEditScope("single");
      } else {
        setTitle(""); setDescription(""); setPriority("medium"); setTimeSlot(props.initialTimeSlot || "floating");
        setIsBlocking(false); setDuration(60); setRecurrence("none"); setCategory("work"); setEnergyLevel("medium"); setEditScope("single");
        setSelectedTemplateId(""); setSaveAsTemplate(false);
      }
    }
  }, [props.isOpen, props.initialTimeSlot, props.taskToEdit, isEditMode]);

  const handleTemplateSelect = (tmplId: string) => {
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      setTitle(tmpl.title); setDuration(tmpl.duration); setPriority(tmpl.priority);
      setCategory(tmpl.category); setEnergyLevel(tmpl.energyLevel);
      setIsBlocking(tmpl.isBlocking); setDescription(tmpl.description || "");
      setSaveAsTemplate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    if (timeSlot !== "floating" && duration > maxAllowedDuration) {
      alert(alerts.overlap_error);
      return;
    }

    setIsSubmitting(true);
    const finalSlot = timeSlot === "floating" ? null : timeSlot;
    let res;

    if (isEditMode && props.taskToEdit) {
      res = await updateTaskAction(props.taskToEdit.id, title, finalSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel, editScope, props.selectedDateStr);
    } else {
      res = await createTaskAction(title, props.selectedDateStr, finalSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel);
    }

    if (res.success) {
      if (!isEditMode && saveAsTemplate && !selectedTemplateId) {
        await createTaskTemplateAction(title, duration, description, priority, category, energyLevel, isBlocking);
      }
      await props.onSuccess(); props.onClose();
    } else {
      alert(res.error || alerts.general_error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!props.taskToEdit?.id || !window.confirm(alerts.delete_confirm)) return;
    setIsSubmitting(true);
    const res = await deleteTaskAction(props.taskToEdit.id, editScope, props.selectedDateStr);
    if (res.success) {
      await props.onSuccess(); props.onClose();
    } else {
      alert(res.error || alerts.general_error);
    }
    setIsSubmitting(false);
  };

  return {
    title, setTitle, description, setDescription, priority, setPriority,
    timeSlot, setTimeSlot, isBlocking, setIsBlocking, duration, setDuration,
    recurrence, setRecurrence, category, setCategory, energyLevel, setEnergyLevel,
    editScope, setEditScope, isSubmitting, isEditMode, maxAllowedDuration, handleSubmit, handleDelete,
    selectedTemplateId, setSelectedTemplateId, saveAsTemplate, setSaveAsTemplate,
    templates, handleTemplateSelect
  };
}