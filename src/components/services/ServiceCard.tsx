"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuCode2, LuCamera, LuTrendingUp, LuDatabase } from 'react-icons/lu';

interface ServiceCardProps {
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  web: <LuCode2    size={20} className="text-emerald-400" />,
  ai:  <LuCamera   size={20} className="text-emerald-400" />,
  seo: <LuTrendingUp size={20} className="text-emerald-400" />,
  db:  <LuDatabase size={20} className="text-emerald-400" />,
};

export default function ServiceCard({ title, description, tags, icon }: ServiceCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.3)" }}
      className="bg-[#0f0f16] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col justify-between h-full transition-all duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
    >
      <div className="space-y-4">
        {/* آیکون مینیاتوری */}
        <div className="w-10 h-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
          {iconMap[icon]}
        </div>

        {/* عنوان و توضیحات */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-sm md:text-base tracking-tight group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>

      {/* بخش تگ‌های تک کلمه‌ای تکنولوژی */}
      <div className="flex flex-wrap gap-1.5 pt-5 mt-auto border-t border-white/5">
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/5 text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}