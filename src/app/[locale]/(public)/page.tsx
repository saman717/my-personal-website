import HeroSection from '@/components/home/HeroSection';
import SkillsSection from '@/components/skills/SkillsSection';
import ProjectsSection from '@/components/projects/ProjectsSection';
import TimelineSection from '@/components/timeline/TimelineSection';


export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <SkillsSection />
      <ProjectsSection />
      <TimelineSection />
    </>
  );
}