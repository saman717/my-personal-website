import { getDictionary } from '@/lib/translate';
import { SKILL_DOMAINS, APPROACH_TILES, DOMAIN_ICONS, LEVEL_COLORS } from '@/data/skills.config';

interface SkillsSectionProps {
  locale: string;
}

export default async function SkillsSection({ locale }: SkillsSectionProps) {
  const dict = await getDictionary(locale);
  const s = dict.skills;

  return (
    <section id="skills" className="relative py-20 bg-[#0d0d12]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-[#13131a] border border-[#2a2a3a] text-[var(--color-neon-emerald)] mb-4">
            {s.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">{s.title}</h2>
          <p className="text-gray-400 text-base sm:text-lg">{s.subtitle}</p>
        </div>

        {/* Domain cards — dir="rtl" on the layout ancestor reverses column order naturally */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {SKILL_DOMAINS.map((domain) => {
            const title = domain.id === 'web' ? s.web_title : s.industrial_title;
            const desc  = domain.id === 'web' ? s.web_desc  : s.industrial_desc;

            return (
              <div
                key={domain.id}
                className="flex-1 bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-6 hover:border-[#3a3a4a] transition-colors duration-300 motion-reduce:transition-none"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 mb-3">
                  {(() => { const DomainIcon = DOMAIN_ICONS[domain.id]; const color = domain.id === 'web' ? '#4f8ef7' : '#34d399'; return <DomainIcon size={20} style={{ color }} aria-hidden />; })()}
                  <h3 className="text-white text-lg font-bold">{title}</h3>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-5">{desc}</p>

                {/* Skill chips */}
                <ul className="flex flex-wrap gap-2" role="list" aria-label={title}>
                  {domain.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07070a] border border-[#2a2a3a] text-xs text-gray-300 font-medium"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${LEVEL_COLORS[skill.level]}`}
                        aria-label={skill.level}
                      />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Approach tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {APPROACH_TILES.map((tile) => {
            const label = s[`approach_${tile.key}`];
            const desc  = s[`approach_${tile.key}_desc`];

            return (
              <div
                key={tile.key}
                className="flex flex-col items-center text-center gap-2 p-5 rounded-xl bg-[#13131a] border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors duration-300 motion-reduce:transition-none"
              >
                {(() => { const TileIcon = tile.icon; return <TileIcon size={24} aria-hidden  color="#4f8ef7"  />; })()}
                <span className="text-sm font-semibold text-white">{label}</span>
                <span className="text-xs text-gray-400 leading-relaxed">{desc}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
