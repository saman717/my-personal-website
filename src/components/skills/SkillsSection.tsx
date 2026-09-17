import React from "react";
import { getDictionary } from "@/lib/translate";
import SkillsSectionClient from "./SkillsSectionClient";

interface SkillsSectionProps {
  locale: string;
}

export default async function SkillsSection({ locale }: SkillsSectionProps) {
  // لود کاملاً بهینه و سمت سرور فایل ترجمه
  const dict = await getDictionary(locale);

  return (
    <SkillsSectionClient labels={dict.skills} locale={"locale"} />
  );
}