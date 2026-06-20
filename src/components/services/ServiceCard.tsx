"use client";

import React from "react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  web: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  ai: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  seo: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  db: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  )
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