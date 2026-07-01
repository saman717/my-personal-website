"use client";

import React, { useState, useEffect, useRef } from "react";

// تعریف دقیق پراپ‌هایی که از پدر (SkillCard) می‌آیند
interface ProgressBarProps {
  percentage: number;
  label: string; // نام مهارت (مثلاً React)
  color?: string;
  forceGold?: boolean;
  isRTL: boolean;
  labels: {
    learning: string;
    proficient: string;
    expert: string;
  };
}

function getProgressColor(percentage: number, forceGold?: boolean): string {
  if (forceGold) return "#ffcc00";
  if (percentage <= 33) return "#ff4444";
  if (percentage <= 66) return "#ffcc05";
  return "rgba(57, 255, 20, 0.6)";
}

const easeOutQuad = (t: number) => t * (2 - t);

export default function ProgressBar({ 
  percentage, 
  label, 
  color, 
  forceGold, 
  isRTL, 
  labels 
}: ProgressBarProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);

  const progressColor = color || getProgressColor(percentage, forceGold);
  const ANIMATION_DURATION = 3000;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && percentage > 0) {
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const timeProgress = Math.min((timestamp - startTimestamp) / ANIMATION_DURATION, 1);
        
        const easedProgress = easeOutQuad(timeProgress);
        setCurrentPercentage(Math.floor(easedProgress * percentage));

        if (timeProgress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isVisible, percentage]);

  // تعیین متن سطح مهارت مستقیماً از روی پراپِ ترجمه شده
  let progressLabel: string;
  if (percentage <= 33) progressLabel = labels.learning;
  else if (percentage <= 66) progressLabel = labels.proficient;
  else progressLabel = labels.expert;

  const textAlign = isRTL ? "text-right" : "text-left";
  const barOrigin = isRTL ? { left: 0 } : { right: 0 };

  const progressBarElement = (
    <div className="flex-1 h-6 rounded-full bg-[#1E1E24] overflow-hidden relative">
      <div
        className="absolute inset-y-0 rounded-full transition-all ease-out"
        style={{
          width: `${isVisible ? percentage : 0}%`,
          backgroundColor: progressColor,
          transitionDuration: `${ANIMATION_DURATION}ms`,
          ...barOrigin,
        }}
      />
      <span className="absolute inset-0 flex items-center shadow-lg shadow-black justify-center text-[11px] font-bold text-white drop-shadow-2xl">
        {currentPercentage}%
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
    <div ref={containerRef} className="flex items-center gap-3 w-full group">
      {labelElement}
      {progressBarElement}
    </div>
  );
}