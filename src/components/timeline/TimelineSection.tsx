"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// ─── ۱. تایپ‌ها و دیتای یکپارچه ───────────────────────────────────────
interface TimelineItemType {
  id: number;
  year: string;
  title: string;
  tech: string;
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  dotX: number;
  dotY: number;
  yearX: number;
  yearY: number;
  icon: React.ReactNode;
  scrollRange: [number, number, number]; 
}

const timelineData: TimelineItemType[] = [
  {
    id: 1,
    year: "1402",
    title: "شروع ماجرا",
    tech: "HTML • CSS • Tailwind • wordpress",
    cardX: 60, cardY: 250, cardWidth: 380, cardHeight: 360,
    dotX: 560, dotY: 450, yearX: 610, yearY: 420,
    scrollRange: [0.02, 0.15, 0.32], 
    icon: (
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1c1c24] flex items-center justify-center border border-red-500/20 relative">
        <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">🚩</span>
      </div>
    ),
  },
  {
    id: 2,
    year: "1403",
    title: "قدم به دنیای تعامل",
    tech: "JavaScript • Template Design • vue3.js",
    cardX: 760, cardY: 750, cardWidth: 380, cardHeight: 360,
    dotX: 640, dotY: 950, yearX: 480, yearY: 920,
    scrollRange: [0.32, 0.52, 0.70], 
    icon: (
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1c1c24] flex items-center justify-center border border-blue-500/20">
        <div className="text-center">
          <span className="text-2xl md:text-3xl block text-blue-400 font-mono font-bold leading-none">UI/UX</span>
          <span className="text-lg md:text-xl block mt-1">💻</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    year: "1404",
    title: "گسترش مهارت‌ها",
    tech: "React • Node.js • PLC (delta)",
    cardX: 80, cardY: 1350, cardWidth: 380, cardHeight: 360,
    dotX: 560, dotY: 1550, yearX: 610, yearY: 1520,
    scrollRange: [0.70, 0.85, 0.98], 
    icon: (
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1c1c24] flex items-center justify-center border border-indigo-500/20">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" className="md:w-10 md:h-10">
          <circle cx="12" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
          <path d="M12 7v10M6 12h12" />
        </svg>
      </div>
    ),
  },
];

// ─── ۲. کامپوننت کارت (공통 - مشترک بین دسکتاپ و موبایل) ─────────────────
const TimelineCard: React.FC<{ item: TimelineItemType }> = ({ item }) => {
  return (
    <div className="bg-[#131318] border border-gray-800/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl h-full justify-between transition-all duration-300 hover:border-gray-700 w-full">
      <div className="mb-4">{item.icon}</div>
      <h3 className="text-white font-bold text-xl md:text-2xl mb-2">{item.title}</h3>
      <p className="text-gray-400 text-xs md:text-sm [direction:ltr] mb-6 font-medium">{item.tech}</p>
      <div className="flex gap-2 md:gap-3 justify-center w-full">
        {[1, 2, 3, 4].map((box) => (
          <div key={box} className="w-10 h-10 md:w-12 md:h-12 border border-gray-800 rounded-xl bg-[#16161a]/80 shadow-inner" />
        ))}
      </div>
    </div>
  );
};

// ─── ۳. کامپوننت مخصوص ردیف دسکتاپ (TimelineDesktopRow) ─────────────────
const TimelineDesktopRow: React.FC<{ item: TimelineItemType; scrollYProgress: MotionValue<number> }> = ({ item, scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, item.scrollRange, [0.15, 1, 0.15]);
  const scale = useTransform(scrollYProgress, item.scrollRange, [0.95, 1, 0.95]);

  return (
    <motion.g style={{ opacity }} className="transition-opacity duration-200">
      <circle cx={item.dotX} cy={item.dotY} r="8" className="fill-[#8b5cf6] filter drop-shadow-[0_0_8px_#8b5cf6]" />
      <foreignObject x={item.yearX} y={item.yearY} width="120" height="54">
        <div className="bg-[#131318] border border-gray-800/80 rounded-lg flex items-center justify-center h-full text-white font-bold text-lg shadow-lg select-none">
          {item.year}
        </div>
      </foreignObject>
      <foreignObject x={item.cardX} y={item.cardY} width={item.cardWidth} height={item.cardHeight} className="overflow-visible">
        <motion.div style={{ scale }} className="h-full w-full">
          <TimelineCard item={item} />
        </motion.div>
      </foreignObject>
    </motion.g>
  );
};

// ─── ۴. کامپوننت اصلی و پاسخگو (TimelineSection) ─────────────────
export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // سیستم محاسباتی اسکرول برای دسکتاپ
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lineProgress = useTransform(scrollYProgress, [0, 0.20, 0.55, 0.85, 1], [0, 0.35, 0.70, 0.95, 1]);

  const endDot1Scale = useTransform(scrollYProgress, [0.88, 0.92], [0, 1]);
  const endDot1Opacity = useTransform(scrollYProgress, [0.88, 0.92], [0, 1]);
  const endDot2Scale = useTransform(scrollYProgress, [0.92, 0.96], [0, 1]);
  const endDot2Opacity = useTransform(scrollYProgress, [0.92, 0.96], [0, 1]);
  const endDot3Scale = useTransform(scrollYProgress, [0.96, 1.00], [0, 1]);
  const endDot3Opacity = useTransform(scrollYProgress, [0.96, 1.00], [0, 1]);

  return (
    <section ref={sectionRef} className="w-full bg-[#0d0d12] py-16 md:py-20 flex flex-col items-center overflow-hidden">
      {/* هدر بخش */}
      <div className="w-full max-w-[1200px] px-6 flex justify-end">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-right mb-12 md:mb-24 relative after:content-[''] after:absolute after:-bottom-4 after:right-0 after:w-24 after:h-1 after:bg-white/10">
          مسیر حرفه‌ای
        </h2>
      </div>

      <div className="w-full max-w-[1200px] px-4">
        
        {/* 💻 آ) نمای دسکتاپ (رزولوشن بالا - منحنی پیچیده SVG) */}
        <div className="hidden md:block w-full">
          <svg viewBox="0 0 1200 1900" className="w-full h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M 1150 150 C 850 200, 620 300, 560 450 C 480 650, 550 800, 640 950 C 750 1150, 620 1350, 560 1550 C 530 1650, 560 1700, 600 1750"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: lineProgress }}
            />
            <g>
              <motion.circle cx="600" cy="1780" r="4" fill="white" style={{ opacity: endDot1Opacity, scale: endDot1Scale, transformOrigin: "600px 1780px" }} />
              <motion.circle cx="600" cy="1805" r="4" fill="white" style={{ opacity: endDot2Opacity, scale: endDot2Scale, transformOrigin: "600px 1805px" }} />
              <motion.circle cx="600" cy="1835" r="7" fill="#8b5cf6" className="filter drop-shadow-[0_0_8px_#8b5cf6]" style={{ opacity: endDot3Opacity, scale: endDot3Scale, transformOrigin: "600px 1835px" }} />
            </g>
            {timelineData.map((item) => (
              <TimelineDesktopRow key={item.id} item={item} scrollYProgress={scrollYProgress} />
            ))}
          </svg>
        </div>

        {/* 📱 ب) نمای موبایل (بهینه‌سازی شده، پرفورمنس بالا، بدون جَک و لَگ) */}
        <div className="block md:hidden relative pr-8 pl-2 w-full">
          
          {/* خط عمودی ثابت پس‌زمینه */}
          <div className="absolute right-3 top-2 bottom-2 w-[2px] bg-gradient-to-b from-white via-white/50 to-transparent" />
          
          {/* دایره پایانی مسیر موبایل */}
          <div className="absolute -bottom-2 right-[6px] w-4 h-4 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6]" />

          <div className="flex flex-col gap-12 w-full">
            {timelineData.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0.3, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                className="relative w-full flex flex-col items-start"
              >
                {/* دایره کوچک متصل به خط در موبایل */}
                <div className="absolute -right-[24px] top-6 w-3 h-3 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6] z-10" />
                
                {/* باکس سال در موبایل */}
                <div className="bg-[#131318] border border-gray-800 text-white font-bold text-sm px-3 py-1 rounded-md mb-3 shadow-md">
                  {item.year}
                </div>

                {/* خودِ کارت */}
                <div className="w-full">
                  <TimelineCard item={item} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}