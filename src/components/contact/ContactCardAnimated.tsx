"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  label: string;
  value?: string;
  href?: string;
  isSocial?: boolean;
  links?: { name: string; href: string }[];
  index: number;
  forceLtr?: boolean;
}

export default function ContactCardAnimated({ label, value, href, isSocial, links = [], index, forceLtr }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#0f0f16] border border-white/5 p-5 md:p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-xl overflow-hidden"
    >
      <div className="space-y-4">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded">
          {label}
        </span>

        {isSocial ? (
          <div className="flex gap-4">
            {links?.map((link, i) => (
              <a 
                key={i} 
                href={link.href} 
                target="_blank" 
                rel="noreferrer"
                className="text-white font-bold text-base sm:text-lg md:text-xl hover:text-emerald-400 border-b border-white/10 hover:border-emerald-400/50 transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>
        ) : (
          <div className="block w-full">
            {href ? (
              <a 
                href={href} 
                dir={forceLtr ? "ltr" : undefined} 
                // 🌟 اضافه شدن break-all برای جلوگیری از بیرون‌زدگی در موبایل
                className="text-white font-bold text-lg sm:text-xl md:text-2xl hover:text-emerald-400 transition-colors inline-block break-all"
              >
                <bdi>{value}</bdi> 
              </a>
            ) : (
              <span 
                dir={forceLtr ? "ltr" : undefined}
                // 🌟 اضافه شدن break-all
                className="text-white font-bold text-lg sm:text-xl md:text-2xl cursor-default inline-block break-all"
              >
                <bdi>{value}</bdi>
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </motion.div>
  );
}