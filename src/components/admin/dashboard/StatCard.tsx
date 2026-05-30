"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  // تعیین تم رنگی نئونی کارت: 'emerald' | 'blue' | 'purple'
  variant?: "emerald" | "blue" | "purple";
}

const variantStyles = {
  emerald: {
    glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] hover:border-emerald-500/20",
    text: "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
  },
  blue: {
    glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.12)] hover:border-blue-500/20",
    text: "text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400"
  },
  purple: {
    glow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.12)] hover:border-purple-500/20",
    text: "text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400"
  }
};

export default function StatCard({ title, value, subtext, icon, variant = "emerald" }: StatCardProps) {
  const currentStyle = variantStyles[variant];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden bg-[#13131a]/40 border border-white/3 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between h-40 transition-all duration-300 group cursor-pointer ${currentStyle.glow}`}
    >
      {/* ردیف بالای کارت: عنوان و آیکون */}
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-medium text-gray-500 tracking-tight font-sans">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${currentStyle.iconBg}`}>
          {icon}
        </div>
      </div>

      {/* ردیف پایین کارت: دیتای عددی درخشان */}
      <div className="flex flex-col gap-0.5 mt-4">
        <h3 className={`text-3xl font-extrabold tracking-tight font-mono ${currentStyle.text}`}>
          {value}
        </h3>
        <span className="text-[10px] text-gray-600 font-medium">
          {subtext}
        </span>
      </div>
    </motion.div>
  );
}