"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

type ToastType =
  | "success"
  | "error"
  | "loading-orange"
  | "loading-white";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  isExiting?: boolean;
}

const ToastContext = createContext<{
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => number;

  updateToast: (
    id: number,
    message: string,
    type: ToastType,
    duration?: number
  ) => void;

  dismissToast: (id: number) => void;
} | null>(null);

export const ToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutIdsRef = React.useRef<Map<number, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isExiting: true } : t
      )
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration = 4000) => {
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message, type }]);

      // اصلاح شرط: اگر نوع توست هیچ‌کدام از لودینگ‌ها نبود، تایمر حذف خودکار فعال شود
      if (type !== "loading-orange" && type !== "loading-white") {
        const timeoutId = setTimeout(() => {
          dismissToast(id);
        }, duration);
        timeoutIdsRef.current.set(id, timeoutId);
      }

      return id;
    },
    [dismissToast]
  );

  const updateToast = useCallback(
    (id: number, message: string, type: ToastType, duration = 4000) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, message, type } : t))
      );

      // اصلاح شرط: وقتی لودینگ تبدیل به success یا error شد، حالا باید تایمر حذف خودکار براش ست بشه
      if (type !== "loading-orange" && type !== "loading-white") {
        const existingTimeout = timeoutIdsRef.current.get(id);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        const timeoutId = setTimeout(() => {
          dismissToast(id);
        }, duration);
        timeoutIdsRef.current.set(id, timeoutId);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        updateToast,
        dismissToast,
      }}
    >
      {children}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 ${t.isExiting
              ? "animate-toast-out"
              : "animate-toast-in"
              } ${t.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-neon-success"

                : t.type === "error"
                  ? "bg-red-950/40 border-red-500/40 text-red-200 shadow-neon-error"

                  : t.type === "loading-white"
                    ? "bg-white/10 border-white/20 text-white shadow-[0_0_25px_rgba(255,255,255,0.12)]"

                    : "bg-orange-950/40 border-orange-500/40 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
              }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {t.type === "success" ? (
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : t.type === "error" ? (
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01"
                  />
                </svg>
              ) : (
                <svg
                  className={`w-5 h-5 animate-spin ${t.type === "loading-white"
                    ? "text-white"
                    : "text-orange-400"
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeOpacity="0.25"
                  />
                  <path d="M22 12a10 10 0 0 1-10 10" />
                </svg>
              )}
            </div>

            <div className="flex-1 text-sm font-medium leading-relaxed select-none">
              {t.message}
            </div>

            <button
              onClick={() => dismissToast(t.id)}
              className="mt-0.5 flex-shrink-0 text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer text-xs bg-white/5 hover:bg-white/10 p-1 rounded-md"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used within a ToastProvider"
    );
  }

  return context;
};