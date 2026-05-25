"use client";

import Link from "next/link";
import ProjectTag from "./ProjectTag";
import { useTranslate } from "@/hooks/useTranslate";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imagePlaceholder?: string;
  projectLink?: string;
}

export default function ProjectCard({ 
  title, 
  description, 
  tags, 
  imagePlaceholder,
  projectLink = "#",
}: ProjectCardProps) {
  const { t } = useTranslate();

  return (
    <div className="group bg-[#1E1E24] rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
      {/* تصویر - کوچیک‌تر */}
      <div className="relative w-full aspect-video bg-[#181825] rounded-xl overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg font-bold opacity-50 group-hover:opacity-70 transition-opacity">
            {imagePlaceholder || title}
          </span>
        </div>
      </div>

      {/* عنوان و توضیحات - فشرده‌تر */}
      <div className="space-y-4 mb-4">
        <h3 className="text-white text-base font-bold leading-tight">{title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{description}</p>
      </div>

      {/* تگ‌ها - کوچیک‌تر */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {tags.map((tag, index) => (
          <ProjectTag key={index} label={tag} />
        ))}
      </div>

      {/* دکمه - کوچیک‌تر */}
      <Link
        href={projectLink}
        className="block w-full bg-[#E0E0E0] text-[#1E1E24] text-center py-2 rounded-lg text-sm font-medium hover:bg-white transition-all duration-300"
      >
        {t("projects.view_project")}
      </Link>
    </div>
  );
}