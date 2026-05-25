"use client";

import { motion, useTransform } from "framer-motion";
import WPLSoft from "@/WPLSoft"

interface TimelineItemProps {
    year: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    iconColor: string;
    position: "left" | "right";
    dotTopPercent: number;
    dotLeftPercent: number;
    cardOffsetX: number;
    cardOffsetY: number;
    yearOffsetX: number;
    yearOffsetY: number;
    // پراپ‌های جدید برای هماهنگی با اسکرول
    scrollYProgress: any;
    range: [number, number];
}

export default function TimelineItem({
    year,
    title,
    description,
    icon,
    iconColor,
    position,
    dotTopPercent,
    dotLeftPercent,
    cardOffsetX,
    cardOffsetY,
    yearOffsetX,
    yearOffsetY,
    scrollYProgress,
    range,
}: TimelineItemProps) {
    // محاسبه opacity و scale بر اساس پیشرفت خط
    const opacity = useTransform(scrollYProgress, range, [0.2, 10]);
    const scale = useTransform(scrollYProgress, range, [1, 1]);


    return (
        <>
            {/* نقطه روی خط */}
            <motion.div
                style={{
                    opacity,
                    top: `${dotTopPercent}%`,
                    left: `${dotLeftPercent}%`,
                    transform: "translate(-50%, -50%)"
                }}
                className="absolute z-10 w-3 h-3 bg-[#7c3aed] rounded-full shadow-[0_0_15px_rgba(124,58,237,0.6)]"
            />

            {/* کارت اطلاعات */}
            <motion.div
                style={{
                    opacity,
                    scale,
                    top: `${dotTopPercent + cardOffsetY}%`,
                    left: `${dotLeftPercent + cardOffsetX}%`,
                    transform: "translate(-50%, -50%)"
                }}
                className="absolute z-20 w-64 md:w-72 bg-[#1E1E24] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all shadow-xl"
            >
                {/* آیکون */}
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: iconColor }}
                >
                    {icon}
                </div>

                {/* عنوان */}
                <h3 className="text-white text-center text-lg font-bold mb-1">{title}</h3>

                {/* توضیحات */}
                <p className="text-gray-400 text-center text-sm leading-relaxed mb-3">
                    {description}
                </p>

                {/* باکس‌های تکنولوژی */}
                <div className="flex justify-center gap-2 text-white">
                    <WPLSoft />
                </div>
            </motion.div>

            {/* سال */}
            <motion.div
                style={{
                    opacity,
                    scale,
                    top: `${dotTopPercent + yearOffsetY}%`,
                    left: `${dotLeftPercent + yearOffsetX}%`,
                    transform: "translate(-50%, -50%)"
                }}
                className="absolute z-20 bg-[#1E1E24] px-4 py-1 rounded-md border border-white/5"
            >
                <span className="text-white text-lg font-bold">{year}</span>
            </motion.div>
        </>
    );
}