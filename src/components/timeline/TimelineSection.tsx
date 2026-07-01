import React from "react";
import { getDictionary } from "@/lib/translate";
import TimelineSectionClient from "./TimelineSectionClient";

interface TimelineSectionProps {
  locale: string;
}

export default async function TimelineSection({ locale }: TimelineSectionProps) {
  // لود دیتا کاملاً سمت سرور
  const dict = await getDictionary(locale);

  return (
    <TimelineSectionClient 
      locale={locale} 
      labels={dict.timeline} // پاس دادن کل آبجکتِ تایم‌لاین به کلاینت
    />
  );
}