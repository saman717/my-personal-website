import React from "react";
import { t } from "@/lib/translate";

interface Props {
  locale: string;
}

export default async function ContactHero({ locale }: Props) {
  const title = await t(locale, "contact.hero.title");
  const subtitle = await t(locale, "contact.hero.subtitle");

  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
        {subtitle}
      </p>
    </section>
  );
}