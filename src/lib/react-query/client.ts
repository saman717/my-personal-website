// lib/react-query/client.ts
import { QueryClient } from "@tanstack/react-query";

// این نمونه در کل اپلیکیشن به صورت ثابت باقی می‌ماند
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});