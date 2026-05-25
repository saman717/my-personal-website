"use client";

import { useTranslate } from "@/hooks/useTranslate";

interface ProgressBarProps {
  percentage: number;
  label: string;
  color?: string;
  forceGold?: boolean; // جدید: اگه همه ۱۰۰ باشن
}

function getProgressColor(percentage: number, forceGold?: boolean): string {
  if (forceGold) return "#ffcc00"; // طلایی برای همه ۱۰۰٪
  if (percentage <= 33) return "#ff4444";
  if (percentage <= 66) return "#ffcc00";
  return "rgba(57, 255, 20, 0.6)";
}

export default function ProgressBar({ percentage, label, color, forceGold }: ProgressBarProps) {
  const { t, locale } = useTranslate();
  const isRTL = locale === "fa";

  const progressColor = color || getProgressColor(percentage, forceGold);

  let progressLabelKey: string;
  if (percentage <= 33) progressLabelKey = "skills.progress_level.learning";
  else if (percentage <= 66) progressLabelKey = "skills.progress_level.proficient";
  else progressLabelKey = "skills.progress_level.expert";

  const progressLabel = t(progressLabelKey);

  const textAlign = isRTL ? "text-right" : "text-left";
  const barOrigin = isRTL ? { left: 0 } : { right: 0 };

  const progressBarElement = (
    <div className="flex-1 h-6 rounded-full bg-[#1E1E24] overflow-hidden relative">
      <div
        className="absolute inset-y-0 rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: progressColor,
        //   boxShadow: `0 0 10px ${progressColor}40`,
          ...barOrigin,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-md">
        {percentage}%
      </span>
    </div>
  );

  const labelElement = (
    <div className={`flex flex-col min-w-17.5 ${textAlign}`}>
      <span className="text-gray-300 text-sm font-medium leading-tight">
        {label}
      </span>
      <span
        className="text-[10px] font-medium leading-tight"
        style={{ color: progressColor }}
      >
        {progressLabel}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 w-full group">
      {isRTL ? (
        <>
          {labelElement}
          {progressBarElement}
        </>
      ) : (
        <>
          {labelElement}
          {progressBarElement}
        </>
      )}
    </div>
  );
}