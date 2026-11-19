import React from 'react';
import { LuZap, LuLink, LuBuilding2, LuGlobe, LuSettings } from 'react-icons/lu';

export type SkillLevel = 'core' | 'mid';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillDomain {
  id: 'web' | 'industrial';
  skills: Skill[];
}

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: 'web',
    skills: [
      { name: 'Next.js 15', level: 'core' },
      { name: 'TypeScript', level: 'core' },
      { name: 'React', level: 'core' },
      { name: 'Tailwind CSS', level: 'core' },
      { name: 'Supabase', level: 'mid' },
      { name: 'Drizzle ORM', level: 'mid' },
      { name: 'PostgreSQL', level: 'mid' },
      { name: 'SEO Architecture', level: 'mid' },
    ],
  },
  {
    id: 'industrial',
    skills: [
      { name: 'Python', level: 'core' },
      { name: 'PyQt5/PySide6', level: 'core' },
      { name: 'Modbus TCP', level: 'core' },
      { name: 'PLC Integration', level: 'core' },
      { name: 'Serial/RS-232', level: 'mid' },
      { name: 'Ethernet/TCP-IP', level: 'mid' },
      { name: 'Real-time Plotting', level: 'mid' },
    ],
  },
];

export interface ApproachTile {
  icon: React.ElementType;
  key: 'ship_first' | 'full_delivery' | 'domain_first';
}

export const APPROACH_TILES: ApproachTile[] = [
  { icon: LuZap,      key: 'ship_first' },
  { icon: LuLink,     key: 'full_delivery' },
  { icon: LuBuilding2, key: 'domain_first' },
];

export const DOMAIN_ICONS: Record<SkillDomain['id'], React.ElementType> = {
  web: LuGlobe,
  industrial: LuSettings,
};

export const LEVEL_COLORS: Record<SkillLevel, string> = {
  core: 'bg-[var(--color-neon-emerald)]',
  mid: 'bg-gray-500',
};
