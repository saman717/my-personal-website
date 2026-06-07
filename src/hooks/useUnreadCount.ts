import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { MessageType } from "@/types/contact";

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.messages,
    // کوئری فانکشن را اینجا لازم نیست بنویسی اگر قبلاً در `useMessages` لود شده، 
    // اما برای اینکه خطای Fetch ندهد، یک تابع خالی یا شرطی می‌گذاریم:
    queryFn: () => Promise.resolve([]), 
    
    // این قسمت جادویی است:
    // فقط از کش استفاده کن و اگر در کش نبود، درخواست جدید نفرست (مگر اینکه حتماً بخواهی)
    enabled: false, 
    
    // تبدیل دیتای کامل پیام‌ها به عددِ پیام‌های نخوانده
    select: (data: MessageType[] | undefined) => {
      if (!data) return 0;
      return data.filter((msg) => !msg.isRead).length;
    },
    
    // استفاده از کشِ موجود
    staleTime: Infinity,
  });
}