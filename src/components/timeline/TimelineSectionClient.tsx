"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';
import { geoPositions, GeoPositionItem } from '@/data/timelineData';

interface RenderableTimelineItem extends GeoPositionItem {
  translatedYear: string;
  translatedTitle: string;
  translatedTech: string;
}

// 🌟 اضافه شدن پراپ‌های معماری جدید
interface TimelineSectionClientProps {
  locale: string;
  labels: any; 
}

const TimelineCard: React.FC<{ item: RenderableTimelineItem }> = ({ item }) => {
  return (
    <div className="bg-[#131318] border border-gray-800/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl h-full justify-between transition-all duration-300 hover:border-gray-700 w-full">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1c1c24] flex items-center justify-center border border-gray-800/40 relative">
        <span className="text-3xl md:text-4xl">{item.icon}</span>
      </div>
      <h3 className="text-white font-bold text-xl md:text-2xl mb-2">{item.translatedTitle}</h3>
      <p className="text-gray-400 text-xs md:text-sm [direction:ltr] mb-6 font-medium">{item.translatedTech}</p>
      <div className="flex gap-2 md:gap-3 justify-center w-full">
        {[1, 2, 3, 4].map((box) => (
          <div key={box} className="w-10 h-10 md:w-12 md:h-12 border border-gray-800 rounded-xl bg-[#16161a]/80 shadow-inner" />
        ))}
      </div>
    </div>
  );
};

const TimelineDesktopRow: React.FC<{ item: RenderableTimelineItem; scrollYProgress: MotionValue<number> }> = ({ item, scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, item.scrollRange, [0.15, 1, 0.15]);
  const scale = useTransform(scrollYProgress, item.scrollRange, [0.95, 1, 0.95]);

  return (
    <motion.g style={{ opacity }} className="transition-opacity duration-200">
      <circle cx={item.dotX} cy={item.dotY} r="8" className="fill-[#8b5cf6] filter drop-shadow-[0_0_8px_#8b5cf6]" />
      <foreignObject x={item.yearX} y={item.yearY} width="120" height="54">
        <div className="bg-[#131318] border border-gray-800/80 rounded-lg flex items-center justify-center h-full text-white font-bold text-lg shadow-lg select-none">
          {item.translatedYear}
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

const EndCircles: React.FC<{ scrollYProgress: MotionValue<number> }> = ({ scrollYProgress }) => {
  const endCirclesOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 0.3, 0.7, 1]);
  const circle1Opacity = useTransform(scrollYProgress, [0.75, 0.82, 0.95, 1], [0, 0.5, 0.5, 0.5]);
  const circle2Opacity = useTransform(scrollYProgress, [0.80, 0.87, 0.95, 1], [0, 0.5, 0.5, 0.5]);
  const circle3Opacity = useTransform(scrollYProgress, [0.85, 0.92, 0.97, 1], [0, 0.3, 0.8, 1]);
  const circle3Scale = useTransform(scrollYProgress, [0.85, 0.92, 0.97, 1], [0.5, 0.9, 1.05, 1]);
  const circle3Color = useTransform(scrollYProgress, [0.85, 0.92, 0.97, 1], ["#4b5563", "#7c3aed", "#8b5cf6", "#a78bfa"]);
  const circle3Shadow = useTransform(scrollYProgress, [0.85, 0.92, 0.97, 1], [
    "drop-shadow(0px 0px 0px transparent)",
    "drop-shadow(0px 0px 4px rgba(139, 92, 246, 0.3))",
    "drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.6))",
    "drop-shadow(0px 0px 12px rgba(139, 92, 246, 0.8))"
  ]);

  return (
    <motion.g style={{ opacity: endCirclesOpacity }}>
      <motion.circle cx={600} cy={1760} r="6" style={{ opacity: circle1Opacity }} className="fill-gray-600" />
      <motion.circle cx={600} cy={1775} r="6" style={{ opacity: circle2Opacity }} className="fill-gray-600" />
      <motion.circle cx={600} cy={1795} r="8" style={{ opacity: circle3Opacity, scale: circle3Scale, fill: circle3Color, filter: circle3Shadow }} />
    </motion.g>
  );
};

export default function TimelineSectionClient({ locale, labels }: TimelineSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === 'fa';

  // 🌟 تابع جایگزین t برای خواندن داینامیک از آبجکت labels
  const getTranslation = (key: string) => {
    return key.split('.').reduce((obj: any, k: string) => obj?.[k], labels) || key;
  };

  const combinedData: RenderableTimelineItem[] = geoPositions.map((pos) => ({
    ...pos,
    translatedYear: getTranslation(pos.translationKeys.year),
    translatedTitle: getTranslation(pos.translationKeys.title),
    translatedTech: getTranslation(pos.translationKeys.tech),
  }));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const transformedProgress = useTransform(
    scrollYProgress,
    [0, 0.18, 0.44, 0.68, 0.88, 1],
    [0, 0.35, 0.55, 0.78, 0.92, 1]
  );

  const lineProgress = useSpring(transformedProgress, {
    stiffness: 85,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <section ref={sectionRef} className="w-full bg-[#0d0d12] py-16 md:py-20 flex flex-col items-center">
      <div className={`w-full max-w-300 px-6 flex justify-center`}>
        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-12 md:mb-24 relative after:content-[''] after:absolute after:-bottom-6 after:h-1 after:rounded-full after:bg-white/20 after:shadow-[0_0_5px_rgba(139,92,246,0.3)] after:transition-all after:duration-900 after:ease-out ${isRtl ? "text-right after:right-0 hover:after:-translate-x-45 after:w-20 hover:after:w-45 hover:after:right-[-60%] hover:after:bg-[#8b5cf6] hover:after:shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6,0_0_45px_#8b5cf6]" : "text-left after:left-0 after:w-20 hover:after:left-[9%] hover:after:w-80 hover:after:bg-[#8b5cf6] hover:after:shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6,0_0_45px_#8b5cf6]"}`}>
          {labels.title}
        </h2>
      </div>

      <div className="w-full max-w-300 px-4">
        <div className="hidden lg:block w-full">
          <svg viewBox="0 0 1200 1900" className="w-full h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path d="M 1150 150 C 850 200, 620 300, 560 450 C 480 650, 550 800, 640 950 C 750 1150, 620 1350, 560 1550 C 530 1650, 560 1700, 600 1750" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: lineProgress }} />
            {combinedData.map((item) => (
              <TimelineDesktopRow key={item.id} item={item} scrollYProgress={scrollYProgress} />
            ))}
            <EndCircles scrollYProgress={scrollYProgress} />
          </svg>
        </div>

        <div className={`block lg:hidden relative ${isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'} w-full`}>
          <div className={`absolute top-2 bottom-2 w-0.5 bg-linear-to-b from-white via-white/50 to-transparent ${isRtl ? 'right-3' : 'left-3'}`} />
          <div className={`absolute -bottom-2 w-4 h-4 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6] ${isRtl ? 'right-1.5' : 'left-1.5'}`} />
          <div className="flex flex-col gap-12 w-full">
            {combinedData.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0.3, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: "-100px" }} transition={{ type: "spring", stiffness: 70, damping: 14 }} className="relative w-full flex flex-col items-start px-10">
                <div className={`absolute top-6 w-3 h-3 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6] z-10 ${isRtl ? '-right-6' : '-left-6'}`} />
                <div className="bg-[#131318] border border-gray-800 text-white font-bold text-sm px-3 py-1 rounded-md mb-3 shadow-md">
                  {item.translatedYear}
                </div>
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