import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  available: string;
  projectsCount: string;
  clientLabel: string;
}

export default function HeroImage({ src, alt, available, projectsCount, clientLabel }: HeroImageProps) {
  return (
    <div className="relative flex justify-center items-center px-14 py-6">
      {/* Accent radial glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,242,194,0.18) 0%, rgba(41,121,255,0.09) 45%, transparent 70%)',
          transform: 'scale(1.4)',
        }}
      />

      {/* Profile photo */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-[#2a2a3a] shadow-2xl shadow-black/60 z-10">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-[center_38%]"
          priority
        />
      </div>

      {/* Floating card 1: Projects count */}
      <div className="hero-card-1 absolute top-4 start-0 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-[#2a2a3a] shadow-lg shadow-black/50 whitespace-nowrap">
        <span className="text-sm" aria-hidden="true">🚀</span>
        <span className="text-xs font-semibold text-white">{projectsCount}</span>
      </div>

      {/* Floating card 2: Client label */}
      <div className="hero-card-2 absolute top-1/2 end-0 -translate-y-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-[#2a2a3a] shadow-lg shadow-black/50 whitespace-nowrap">
        <span className="text-sm" aria-hidden="true">🏢</span>
        <span className="text-xs font-semibold text-white">{clientLabel}</span>
      </div>

      {/* Floating card 3: Available for remote */}
      <div className="hero-card-3 absolute bottom-4 start-0 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-[#2a2a3a] shadow-lg shadow-black/50 whitespace-nowrap">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon-emerald)] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-neon-emerald)]" />
        </span>
        <span className="text-xs font-semibold text-[var(--color-neon-emerald)]">
          {available}
        </span>
      </div>
    </div>
  );
}
