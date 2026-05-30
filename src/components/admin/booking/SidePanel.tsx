"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SidePanel({ isOpen, onClose, title, children }: SidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#07070a]/60 backdrop-blur-sm z-40"
          />
          
          {/* Slider */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-100 bg-[#0d0d12] border-l border-white/5 z-50 p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}