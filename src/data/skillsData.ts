export interface SkillItem {
  name: string;
  percentage: number;
}

export interface SkillCategory {
  titleKey: string;   // کلید ترجمه برای عنوان کارت
  skills: SkillItem[];
}

export const skillsData: SkillCategory[] = [
  {
    titleKey: "skills.frontend",
    skills: [
      { name: "React", percentage: 100 },
      { name: "Next.js", percentage: 100 },
      { name: "Tailwind", percentage: 100 },
      { name: "TypeScript", percentage: 100 },
    ],
  },
  {
    titleKey: "skills.backend",
    skills: [
      { name: "Node.js", percentage: 80 },
      { name: "Python", percentage: 75 },
      { name: "Django", percentage: 70 },
      { name: "PostgreSQL", percentage: 75 },
    ],
  },
  {
    titleKey: "skills.design",
    skills: [
      { name: "Figma", percentage: 85 },
      { name: "Photoshop", percentage: 70 },
      { name: "UI/UX", percentage: 80 },
      { name: "Illustrator", percentage: 65 },
    ],
  },
  {
    titleKey: "skills.other",
    skills: [
      { name: "Git", percentage: 90 },
      { name: "Docker", percentage: 70 },
      { name: "Linux", percentage: 75 },
      { name: "CI/CD", percentage: 65 },
    ],
  },
];