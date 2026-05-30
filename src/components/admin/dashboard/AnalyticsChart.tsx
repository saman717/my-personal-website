"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useTranslate } from "@/hooks/useTranslate";

// دیتای تستی خام (بدون وابستگی به زبان)
const rawData = [
  { dayKey: "Mon", views: 25, messages: 5 },
  { dayKey: "Tue", views: 95, messages: 12 },
  { dayKey: "Wed", views: 60, messages: 8 },
  { dayKey: "Thu", views: 160, messages: 22 },
  { dayKey: "Fri", views: 120, messages: 18 },
  { dayKey: "Sat", views: 145, messages: 15 },
  { dayKey: "Sun", views: 190, messages: 28 },
];

export default function AnalyticsChart() {
  const { t } = useTranslate();

  // 🌍 ترجمه داینامیک نام روزها برای محور X نمودار
  const localizedData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      dayName: t(`admin.dashboard.chart.days.${item.dayKey}`)
    }));
  }, [t]);

  // کامپوننت اختصاصی Tooltip با پشتیبانی از دوزبانه
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0d0d12]/90 border border-white/10 backdrop-blur-xl p-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] font-mono text-xs flex flex-col gap-1.5" dir="ltr">
          <p className="text-gray-400 font-bold mb-0.5">{payload[0].payload.dayName}</p>
          <p className="text-emerald-400">{t("admin.dashboard.chart.views")}: <span className="font-bold text-white">{payload[0].value}</span></p>
          <p className="text-blue-400">{t("admin.dashboard.chart.messages")}: <span className="font-bold text-white">{payload[1].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#13131a]/40 border border-white/[0.03] backdrop-blur-md rounded-2xl p-6 w-full lg:col-span-2 flex flex-col gap-4 h-[350px]">
      
      {/* هدر بالایی نمودار */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-bold text-white tracking-tight">{t("admin.dashboard.chart.title")}</h4>
          <p className="text-[10px] text-gray-500">{t("admin.dashboard.chart.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t("admin.dashboard.chart.views")}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> {t("admin.dashboard.chart.messages")}
          </div>
        </div>
      </div>

      {/* بدنه نمودار */}
      <div className="flex-1 w-full text-[10px] font-mono" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={localizedData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis dataKey="dayName" stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
            <Area type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMessages)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}