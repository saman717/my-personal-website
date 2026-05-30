// hooks/useMessageMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { toggleMessageReadStatus, deleteMessageFromDb } from "@/actions/messages";
import { useToast } from "@/context/ToastContext";
import { MessageType } from "@/types/types";

export function useMessageMutations() {
  const queryClient = useQueryClient();
  const { showToast, updateToast } = useToast(); // اضافه کردن updateToast

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const res = await toggleMessageReadStatus(id, currentStatus);
      if (!res.success) throw new Error();
      return res;
    },
    onMutate: async ({ id, currentStatus }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.messages });
      const previousMessages = queryClient.getQueryData<MessageType[]>(queryKeys.messages);
      
      queryClient.setQueryData<MessageType[]>(queryKeys.messages, (old = []) =>
        old.map((m) => (m.id === id ? { ...m, isRead: !currentStatus } : m))
      );

      // ۱. ساخت توست در حال لودینگ
      const toastId = showToast(
        currentStatus ? "در حال تغییر به خوانده نشده..." : "در حال تغییر به خوانده شده...",
        "loading-orange"
      );

      // ۲. پاس دادن toastId و previousMessages به عنوان context به مراحل بعدی
      return { previousMessages, toastId };
    },
    onError: (_, __, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKeys.messages, context.previousMessages);
      }
      // ۳. آپدیت کردن همان توست قبلی در صورت بروز خطا
      if (context?.toastId) {
        updateToast(context.toastId, "خطا در بروزرسانی وضعیت پیام", "error");
      }
    },
    onSuccess: (_, variables, context) => {
      // ۴. آپدیت کردن همان توست قبلی در صورت موفقیت
      if (context?.toastId) {
        updateToast(
          context.toastId,
          variables.currentStatus ? "پیام به عنوان خوانده نشده علامت‌گذاری شد." : "پیام به عنوان خوانده شده علامت‌گذاری شد.",
          "success"
        );
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteMessageFromDb(id);
      if (!res.success) throw new Error();
      return res;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.messages });
      const previousMessages = queryClient.getQueryData<MessageType[]>(queryKeys.messages);

      queryClient.setQueryData<MessageType[]>(queryKeys.messages, (old = []) =>
        old.filter((m) => m.id !== id)
      );

      // ۱. ساخت توست در حال لودینگ حذف
      const toastId = showToast("در حال حذف پیام...", "loading-orange");

      return { previousMessages, toastId };
    },
    onError: (_, __, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKeys.messages, context.previousMessages);
      }
      // ۲. آپدیت توست در صورت خطا
      if (context?.toastId) {
        updateToast(context.toastId, "حذف پیام ناموفق بود. دوباره تلاش کنید.", "error");
      }
    },
    onSuccess: (_, __, context) => {
      // ۳. آپدیت توست در صورت موفقیت
      if (context?.toastId) {
        updateToast(context.toastId, "پیام با موفقیت حذف شد.", "success");
      }
    },
  });

  return { toggleReadMutation, deleteMutation };
}