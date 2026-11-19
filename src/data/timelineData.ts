import React from 'react';
import {
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiWordpress,
  SiReact,
  SiTypescript,
  SiFigma,
  SiNextdotjs,
  SiPython,
  SiSupabase,
  SiPostgresql,
} from 'react-icons/si';
import { LuFlag, LuMonitor, LuSettings } from 'react-icons/lu';

export interface TechItem {
  name: string;
  icon: React.ElementType;
  color: string;
  url: string;
}

export interface GeoPositionItem {
  id: number;
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  dotX: number;
  dotY: number;
  yearX: number;
  yearY: number;
  scrollRange: [number, number, number];
  icon: React.ElementType;
  iconColor: string;
  techs: TechItem[];
  translationKeys: {
    year: string;
    title: string;
    tech: string;
  };
}

export const geoPositions: GeoPositionItem[] = [
  {
    id: 1,
    cardX: 60, cardY: 250, cardWidth: 380, cardHeight: 360,
    dotX: 560, dotY: 450, yearX: 610, yearY: 420,
    scrollRange: [0.02, 0.15, 0.5],
    icon: LuFlag,
    iconColor: '#ef4444',
    techs: [
      { name: 'HTML5',     icon: SiHtml5,       color: '#E34F26', url: 'https://developer.mozilla.org/docs/Web/HTML' },
      { name: 'CSS3',      icon: SiCss,         color: '#1572B6', url: 'https://developer.mozilla.org/docs/Web/CSS'  },
      { name: 'Tailwind',  icon: SiTailwindcss, color: '#06B6D4', url: 'https://tailwindcss.com'                     },
      { name: 'WordPress', icon: SiWordpress,   color: '#21759B', url: 'https://wordpress.org'                       },
    ],
    translationKeys: { year: "item_1_year", title: "item_1_title", tech: "item_1_tech" }
  },
  {
    id: 2,
    cardX: 760, cardY: 750, cardWidth: 380, cardHeight: 360,
    dotX: 640, dotY: 950, yearX: 480, yearY: 920,
    scrollRange: [0.32, 0.52, 0.9],
    icon: LuMonitor,
    iconColor: '#60a5fa',
    techs: [
      { name: 'React',      icon: SiReact,      color: '#61DAFB', url: 'https://react.dev'          },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', url: 'https://typescriptlang.org' },
      { name: 'Figma',      icon: SiFigma,      color: '#F24E1E', url: 'https://figma.com'          },
    ],
    translationKeys: { year: "item_2_year", title: "item_2_title", tech: "item_2_tech" }
  },
  {
    id: 3,
    cardX: 80, cardY: 1350, cardWidth: 380, cardHeight: 360,
    dotX: 560, dotY: 1550, yearX: 610, yearY: 1520,
    scrollRange: [0.70, 0.85, 1.5],
    icon: LuSettings,
    iconColor: '#4f8ef7',
    techs: [
      { name: 'Next.js',    icon: SiNextdotjs,  color: '#ffffff', url: 'https://nextjs.org'      },
      { name: 'Python',     icon: SiPython,     color: '#3776AB', url: 'https://python.org'      },
      { name: 'Supabase',   icon: SiSupabase,   color: '#3FCF8E', url: 'https://supabase.com'    },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', url: 'https://postgresql.org'  },
    ],
    translationKeys: { year: "item_3_year", title: "item_3_title", tech: "item_3_tech" }
  },
];
