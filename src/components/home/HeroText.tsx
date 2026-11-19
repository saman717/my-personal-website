import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import { LuLinkedin } from 'react-icons/lu';

interface HeroTextProps {
  isRTL: boolean;
  eyebrow: string;
  headline1: string;
  headline2: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

const STACK_PILLS = ['Next.js', 'TypeScript', 'React', 'Python', 'PyQt5', 'Supabase'];

export default function HeroText({
  isRTL,
  eyebrow,
  headline1,
  headline2,
  sub,
  ctaPrimary,
  ctaSecondary,
}: HeroTextProps) {
  const alignClass = isRTL ? 'lg:text-right' : 'lg:text-left';
  const itemsClass = isRTL ? 'lg:justify-end' : 'lg:justify-start';

  return (
    <div className={`space-y-6 text-center ${alignClass}`}>
      {/* Eyebrow pill */}
      <div className={`flex justify-start   `}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-[#13131a] border border-[#2a2a3a] text-(--color-neon-emerald)">
          {eyebrow}
        </span>
      </div>

      {/* H1 */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
        {headline1}{' '}
        <span className="bg-gradient-to-r from-[var(--color-neon-emerald)] to-[var(--color-neon-blue)] bg-clip-text text-transparent">
          {headline2}
        </span>
      </h1>

      {/* Sub description */}
      <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:ms-0 lg:me-0">
        {sub}
      </p>

      {/* CTA Buttons */}
      <div className={`flex flex-wrap items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} ${itemsClass} gap-4 pt-2`}>
        <Link
          href="#projects"
          className="bg-[#E0E0E0] text-[#1E1E24] px-8 py-3 rounded-lg font-medium hover:bg-white transition-all duration-300 shadow-lg shadow-black/20"
        >
          {ctaPrimary}
        </Link>
        <a
          href="/cv.pdf"
          download
          className="bg-[#13131a] text-gray-300 px-8 py-3 rounded-lg font-medium border border-[#2a2a3a] hover:bg-[#1E1E24] hover:text-white transition-all duration-300"
        >
          {ctaSecondary}
        </a>
      </div>

      {/* Stack pills */}
      <div className={`flex flex-wrap justify-center ${isRTL ? 'flex-row-reverse' : ''} ${itemsClass} gap-2 pt-1`}>
        {STACK_PILLS.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-xs font-medium rounded-full bg-[#13131a] border border-[#2a2a3a] text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Social links */}
      <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''} ${itemsClass} gap-5 pt-1`}>
        <a
          href="https://github.com/saman717"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <SiGithub size={22} aria-hidden />
        </a>
        <a
          href="https://www.linkedin.com/in/saman-khoshnoud"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-gray-400 hover:text-[var(--color-neon-cyan)] transition-colors duration-300"
        >
          <LuLinkedin size={22} aria-hidden />
        </a>
      </div>
    </div>
  );
}
