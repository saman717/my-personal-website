import { TaskStatus, TaskPriority } from "@/actions/tasks";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
  timeSlot: string | null;
  isBlocking: boolean;
  createdAt: string;
  updatedAt: string;
  duration: number;
  recurrence: string;
  category: string;
  energyLevel: string;
  isAttempted: boolean;
  isAchieved: boolean;
}