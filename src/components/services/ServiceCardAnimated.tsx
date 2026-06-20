"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  description: string;
  tags?: string[]; // علامت سوال اضافه شد
  icon: string;
  index: number;
}

export default function ServiceCardAnimated({ title, description, tags = [], icon, index }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.25)" }}
      className="bg-[#0f0f16] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-full transition-colors duration-300 group"
    >
      <div className="space-y-4">
        <div className="w-9 h-9 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">{title}</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed font-normal">{description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 pt-4 mt-4 border-t border-white/5">
        {/* این علامت سوال تضمین میکنه که ارور مپ دیگه هرگز برنگرده */}
        {tags?.map((tag, idx) => (
          <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5 text-gray-400">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}