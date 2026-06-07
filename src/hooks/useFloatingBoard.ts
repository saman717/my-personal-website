import { useTranslate } from "@/hooks/useTranslate";
import { Task } from "@/types/task";

export function useFloatingBoard(tasks: Task[]) {
  const { t } = useTranslate();

  const emptyState = {
    icon: "🍃",
    message: t("adminTask.FloatingBoard.empty_message")
  };

  const title = t("adminTask.FloatingBoard.title");
  const footerHint = t("adminTask.FloatingBoard.footer_hint");

  return { title, emptyState, footerHint };
}