import { Task } from "@/types/task";

interface FloatingBoardLabels {
  title?: string;
  empty_message?: string;
  footer_hint?: string;
}

export function useFloatingBoard(tasks: Task[], labels: FloatingBoardLabels) {
  // 🌟 حذف هوک قدیمی و استفاده از پراپ ورودی با گارد ایمن
  const emptyState = {
    icon: "🍃",
    message: labels?.empty_message || "List is empty."
  };

  const title = labels?.title || "Floating Tasks";
  const footerHint = labels?.footer_hint || "";

  return { title, emptyState, footerHint };
}