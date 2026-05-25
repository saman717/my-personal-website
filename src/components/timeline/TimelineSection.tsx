"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import CurvedLine from "./CurvedLine";
import TimelineItem from "./TimelineItem";


// ✅ تنظیمات انیمیشن هر کارت (محدوده پیشرفت خط)
// می‌توانید این مقادیر را تغییر دهید تا زمان ظهور هر کارت را کاستوم کنید
const itemRanges: [number, number][] = [
  [0.09, 0.5], // کارت اول: از 0% تا 15%
  [0.3, 1], // کارت دوم: از 10% تا 30%
  [0.5, 1], // کارت سوم: از 25% تا 50%
  [0.7, 1]  // کارت چهارم: از 40% تا 70%
];

const timelineData = [
  {
    id: 1,
    year: "1402",
    title: "شروع ماجرا",
    description: "HTML • CSS • Tailwind • WordPress",
    position: "right" as const,
    iconColor: "#ef4444",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
        <path d="M4 21V4L12 7L20 4V17L12 20L4 17Z" fill="currentColor" opacity="0.9" />
      </svg>
    ),
    dotTopPercent: 8.2,
    dotLeftPercent: 42.1,
    cardOffsetX: 30,
    cardOffsetY: 0,
    yearOffsetX: -10,
    yearOffsetY: -1,
  },
  {
    id: 2,
    year: "1403",
    title: "قدم به دنیای تعامل",
    description: "JavaScript • Template Design • Vue3.js",
    position: "left" as const,
    iconColor: "#3b82f6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    dotTopPercent: 30,
    dotLeftPercent: 76.8,
    cardOffsetX: -50,
    cardOffsetY: -5,
    yearOffsetX: 5,
    yearOffsetY: -1,
  },
  {
    id: 3,
    year: "1404",
    title: "گسترش مهارت‌ها",
    description: "React • Node.js • PLC (delta)",
    position: "right" as const,
    iconColor: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
        <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    dotTopPercent: 49,
    dotLeftPercent: 26.9,
    cardOffsetX: 46,
    cardOffsetY: -4,
    yearOffsetX: -10,
    yearOffsetY: 0,
  },
  {
    id: 4,
    year: "1405",
    title: "ادامه مسیر",
    description: "Next.js • TypeScript • Docker",
    position: "left" as const,
    iconColor: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    dotTopPercent: 61.8,
    dotLeftPercent: 56.8,
    cardOffsetX: -45,
    cardOffsetY: -2.5,
    yearOffsetX: 10,
    yearOffsetY: -0.8,
  },
];

export default function TimelineSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end end"], // خط از ورود بخش شروع می‌شود
  });
  const customProgress = useTransform(scrollYProgress, (value) => {
    // اگر مقدار نامعتبر است
    if (value === undefined || value < 0) return 0;
    if (value > 1) return 1;

    // کارت اول: 0% تا 15% اسکرول
    if (value < 0.15) {
      // سرعت 1.5 برابر (سریع)
      return value * 1.2;
    }
    // کارت دوم: 15% تا 35% اسکرول
    else if (value < 0.25) {
      // سرعت 1.2 برابر
      return 0.05 + (value - 0.01);
    }
    // کارت سوم: 35% تا 65% اسکرول
    else if (value < 0.475) {
      // سرعت 2 برابر (خیلی سریع)
      return 0.21 + (value - 0.09);
    }
    else if (value < 0.675) {
      // سرعت 2 برابر (خیلی سریع)
      return 0.22 + (value - 0.09);
    }
    else if (value < 0.775) {
      // سرعت 2 برابر (خیلی سریع)
      return 0.25 + (value - 0.09);
    }
  });

  return (
    <section ref={ref} className="relative w-full bg-[#0d0d12] ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-right">مسیر حرفه‌ای</h2>

        <div className="relative w-full h-auto min-h-[350vh]">
          <CurvedLine scrollYProgress={customProgress} />

          {timelineData.map((item, index) => (
            <TimelineItem
              key={item.id}
              year={item.year}
              title={item.title}
              description={item.description}
              icon={item.icon}
              iconColor={item.iconColor}
              position={item.position}
              dotTopPercent={item.dotTopPercent}
              dotLeftPercent={item.dotLeftPercent}
              cardOffsetX={item.cardOffsetX}
              cardOffsetY={item.cardOffsetY}
              yearOffsetX={item.yearOffsetX}
              yearOffsetY={item.yearOffsetY}
              // ✅ پاس دادن متغیر اسکرول و محدوده
              scrollYProgress={scrollYProgress}
              range={itemRanges[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}