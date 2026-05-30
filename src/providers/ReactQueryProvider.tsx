// providers/ReactQueryProvider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client"; // 👈 این مسیر را چک کن
import { ReactNode } from "react";

export function ReactQueryProvider({ children }: { children: ReactNode }) { // 👈 حتماً از export named استفاده کن
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}