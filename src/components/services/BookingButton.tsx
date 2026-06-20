"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BookingButtonProps {
  text: string;
}

export default function BookingButton({ text }: BookingButtonProps) {
  // گرفتن زبان فعلی صفحه از آدرس مرورگر
  const params = useParams();
  const locale = params?.locale || "fa"; 

  return (
    // لینک داینامیک که بر اساس زبان کاربر ساخته می‌شود
    <Link href={`/${locale}/booking`} className="inline-block w-full sm:w-auto">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center w-full sm:w-auto px-8 h-11 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer"
      >
        {text}
      </motion.div>
    </Link>
  );
}