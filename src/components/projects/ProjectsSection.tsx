import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { getDictionary } from "@/lib/translate"; // وارد کردن ابزار سروری

const tagsData = [
  ["node.js", "node.js", "node.js"],
  ["Next.js", "Tailwind", "MongoDB"],
  ["React", "Chart.js", "Node.js"],
];

interface ProjectsSectionProps {
  locale: string;
}

export default async function ProjectsSection({ locale }: ProjectsSectionProps) {
  // 🌟 لود دیتا کاملاً سمت سرور
  const dict = await getDictionary(locale);
  const labels = dict.projects;
  const isRTL = locale === "fa";

  const projects = [
    { key: 0, link: "/projects/telegram-bot" },
    { key: 1, link: "/projects/ecommerce" },
    { key: 2, link: "/projects/dashboard" },
  ];

  return (
    <section id="projects" className="relative py-20 bg-[#0d0d12] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* هدر بخش */}
        <div className={`flex flex-col sm:flex-row justify-between items-end gap-4 mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
          
          {/* عنوان */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {labels.title}
          </h2>
          
          {/* لینک مشاهده بیشتر */}
          <Link
            href={`/${locale}/projects`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            <span>{labels.view_more}</span>
            <span className="text-lg">{isRTL ? "←" : "→"}</span>
          </Link>
          
        </div>
        
        {/* گرید کارت‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-15 justify-center gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={labels.items[index].title}
              description={labels.items[index].description}
              tags={tagsData[index]}
              projectLink={`/${locale}${project.link}`}
              viewProjectLabel={labels.view_project} // 🌟 پراپ جدید برای متن دکمه
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}