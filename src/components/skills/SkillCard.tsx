"use client";

import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import FrontendIcon from "../../../public/icons/frontend.svg";
import BackendIcon from "../../../public/icons/backend.svg"
import DesignIcon from "../../../public/icons/design.svg";
import OtherIcon from "../../../public/icons/other.svg";
import StarIcon from "../../../public/icons/star.svg"
import { useState } from "react";

interface SkillItem {
  name: string;
  percentage: number;
}

interface SkillCardProps {
  title: string;
  iconKey?: string;
  skills: SkillItem[];
  delay?: number;
  // 🌟 پراپ‌های جدید برای اتصال به معماری i18n
  isRTL: boolean;
  progressLabels: {
    learning: string;
    proficient: string;
    expert: string;
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  frontend: FrontendIcon,
  backend: BackendIcon,
  design: DesignIcon,
  other: OtherIcon,
};

export default function SkillCard({ 
  title, 
  iconKey, 
  skills, 
  delay = 0,
  isRTL,
  progressLabels 
}: SkillCardProps) {
  
  const IconComponent = iconKey ? iconMap[iconKey] : null;
  const [isHovered, setIsHovered] = useState(false);

  const isAllPerfect = skills.every((skill) => skill.percentage === 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className="relative hover:scale-102  bg-[#1E1E24] rounded-2xl p-6 shadow-xl transition-all duration-600 overflow-hidden"
      style={
        isAllPerfect
          ? {
            border: "1px solid rgba(255, 204, 0, 0.3)",
            boxShadow:
              "0 0 15px rgba(255, 204, 0, 0.15), inset 0 0 15px rgba(255, 204, 0, 0.05)",
          }
          : {
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ⭐ ستاره طلایی - فقط کارت Expert */}
      {isAllPerfect && (
        <div className="absolute top-3 right-3 z-20 flex items-center justify-center">
          <div className="absolute w-10 h-10 rounded-full bg-[#ffcc00]/20 animate-ping" />
          <div className="absolute w-8 h-8 rounded-full bg-[#ffcc00]/30 animate-pulse" />
          <StarIcon className="w-6 h-6 relative z-10 drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
        </div>
      )}

      {/* نقطه نئون روی بوردر */}
      {isAllPerfect && isHovered && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none z-0">
          <div
            className="absolute rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#ffcc00",
              boxShadow: "0 0 8px 2px #ffcc00, 0 0 20px 6px #ffcc0066",
              animation: "border-spin 4s linear infinite",
            }}
          />
        </div>
      )}

      {/* محتوای کارت */}
      <div className="relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3"
            style={{
              borderColor: isAllPerfect
                ? "rgba(255, 204, 0, 0.5)"
                : "rgba(255, 255, 255, 0.3)",
            }}
          >
            {IconComponent ? (
              <IconComponent className="w-10 h-10" />
            ) : (
              <div className="w-10 h-10 rounded-full border border-white/20" />
            )}
          </div>
          <h3 className="text-white text-lg font-bold">{title}</h3>
        </div>

        <div className="space-y-3">
          {skills.map((skill, index) => (
            <ProgressBar
              key={index}
              percentage={skill.percentage}
              label={skill.name}
              forceGold={isAllPerfect}
              // 🌟 پاس دادن اطلاعات به پروگرس‌بار
              isRTL={isRTL}
              labels={progressLabels}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes border-spin {
          0%   { top: -3px; left: -3px; }
          25%  { top: -3px; left: calc(100% - 3px); }
          50%  { top: calc(100% - 3px); left: calc(100% - 3px); }
          75%  { top: calc(100% - 3px); left: -3px; }
          100% { top: -3px; left: -3px; }
        }
        @keyframes star-glow {
          0%   { opacity: 0.5; transform: scale(1.5); }
          100% { opacity: 1; transform: scale(2); }
        }
      `}</style>
    </motion.div>
  );
}