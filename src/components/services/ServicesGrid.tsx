import React from "react";
import { t } from "@/lib/translate";
import ServiceCardAnimated from "./ServiceCardAnimated";

interface ServicesGridProps {
  locale: string;
}

export default async function ServicesGrid({ locale }: ServicesGridProps) {
  // خواندن متون به کمک ردیوسر سروریِ تو
  const s1_title = await t(locale, "services.core.s1_title");
  const s1_desc = await t(locale, "services.core.s1_desc");
  const s2_title = await t(locale, "services.core.s2_title");
  const s2_desc = await t(locale, "services.core.s2_desc");
  const s3_title = await t(locale, "services.core.s3_title");
  const s3_desc = await t(locale, "services.core.s3_desc");
  const s4_title = await t(locale, "services.core.s4_title");
  const s4_desc = await t(locale, "services.core.s4_desc");

  const services = [
    { title: s1_title, description: s1_desc, tags: ["Next.js", "TypeScript", "Supabase"], icon: "web" },
    { title: s2_title, description: s2_desc, tags: ["Python", "OpenCV", "Machine Vision"], icon: "ai" },
    { title: s3_title, description: s3_desc, tags: ["SEO Strategy", "Performance", "Data"], icon: "seo" },
    { title: s4_title, description: s4_desc, tags: ["Drizzle ORM", "Database", "AppSheet"], icon: "db" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {services.map((service, index) => (
        // فقط انیمیشن و هاور هر کارت کلاینتی می‌شود، نه کل گرید!
        <ServiceCardAnimated key={index} {...service} index={index} />
      ))}
    </section>
  );
}