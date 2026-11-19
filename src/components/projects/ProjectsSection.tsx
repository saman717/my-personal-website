import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { getDictionary } from "@/lib/translate";
import { getPublishedProjects } from "@/lib/queries/projects";

interface ProjectsSectionProps {
  locale: string;
}

export default async function ProjectsSection({ locale }: ProjectsSectionProps) {
  const [dict, projects] = await Promise.all([
    getDictionary(locale),
    getPublishedProjects(locale, 3).catch(() => []),
  ]);

  const labels = dict.projects;
  const isRTL = locale === "fa";

  return (
    <section id="projects" className="relative py-20 bg-[#0d0d12] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className={`flex flex-col sm:flex-row justify-between items-end gap-4 mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {labels.section_title}
          </h2>
          <Link
            href={`/${locale}/portfolio`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            <span>{labels.view_more}</span>
            <span className="text-lg">{isRTL ? "←" : "→"}</span>
          </Link>
        </div>

        {/* Project cards grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-15 justify-center gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.brief ?? ""}
                tags={project.techs.map((t) => t.name)}
                image={project.image}
                projectLink={`/${locale}/portfolio/${project.slug}`}
                viewProjectLabel={labels.view_project}
              />
            ))}
          </div>
        ) : null}

        {/* View all link */}
        <div className="flex justify-center mt-10">
          <Link
            href={`/${locale}/portfolio`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all duration-200 text-sm font-medium"
          >
            <span>{labels.view_all}</span>
            <span className="text-base">{isRTL ? "←" : "→"}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
