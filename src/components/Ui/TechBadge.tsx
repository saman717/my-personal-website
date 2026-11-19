import React from 'react';

interface TechBadgeProps {
  name: string;
  icon: React.ElementType;
  color: string;
  url: string;
}

export default function TechBadge({ name, icon: Icon, color, url }: TechBadgeProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c24] border border-white/[0.08] text-[11px] text-gray-300 font-medium hover:border-white/20 hover:text-white transition-colors duration-200 no-underline"
    >
      <Icon size={16} style={{ color }} />
      {name}
    </a>
  );
}
