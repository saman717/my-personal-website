"use client";

import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";

export default function BookingRules({ locale }: { locale: string }) {
  const { t } = useTranslate();
  const isRTL = locale === "fa";

  const [buffer, setBuffer] = useState<number>(15);
  const [horizon, setHorizon] = useState<number>(30);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full bg-[#0d0d12]/60 backdrop-blur-3xl p-5 rounded-2xl border border-white/5 flex flex-col gap-5">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <span className="w-1 h-3 rounded bg-emerald-500" />
        {t("adminBooking.globalRules")}
      </h3>

      {/* تنظیم بافر تایم */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400 flex justify-between">
          <span>{t("adminBooking.bufferTime")}</span>
          <span className="text-emerald-400 font-bold">{buffer} MINS</span>
        </label>
        <div className="flex items-center gap-3 bg-[#111118]/80 px-3 py-2 rounded-xl border border-white/5">
          <input 
            type="range" min="5" max="60" step="5" value={buffer} 
            onChange={(e) => setBuffer(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* تنظیم مایلستون مانیتورینگ آینده */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400 flex justify-between">
          <span>{t("adminBooking.noticeHorizon")}</span>
          <span className="text-emerald-400 font-bold">{horizon} DAYS ahead</span>
        </label>
        <input 
          type="range" min="7" max="90" value={horizon} 
          onChange={(e) => setHorizon(Number(e.target.value))}
          className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
}