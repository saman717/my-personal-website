import React from 'react';

interface TimelineItemType {
  id: number;
  year: string;
  title: string;
  tech: string;
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  dotX: number;
  dotY: number;
  yearX: number;
  yearY: number;
  icon: React.ReactNode;
}

// ۱. لیست دیتا همراه با مختصات فیکس در باکس ۱۲۰۰ در ۱۷۱۸
const timelineData: TimelineItemType[] = [
  {
    id: 1,
    year: "1402",
    title: "شروع ماجرا",
    tech: "HTML • CSS • Tailwind • wordpress",
    cardX: 60,      // موقعیت افقی کارت در کادر SVG
    cardY: 220,     // موقعیت عمودی کارت در کادر SVG
    cardWidth: 380,
    cardHeight: 400,
    dotX: 555,      // نقطه‌ی بنفش روی خط
    dotY: 335,
    yearX: 610,     // موقعیت باکس سال ۱۴۰۲
    yearY: 310,
    icon: (
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
        {/* آیکون پرچم تو - اینجا کدهای SVG یا تصویرش رو قرار بده */}
        <span className="text-3xl">🚩</span>
      </div>
    ),
  },
  {
    id: 2,
    year: "1403",
    title: "قدم به دنیای تعامل",
    tech: "JavaScript • Template Design • vue3.js",
    cardX: 740,
    cardY: 610,
    cardWidth: 380,
    cardHeight: 400,
    dotX: 345,
    dotY: 725,
    yearX: 230,
    yearY: 700,
    icon: (
      <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
        <span className="text-3xl">💻</span> {/* آیکون لپ‌تاپ UI/UX */}
      </div>
    ),
  },
  // سال ۱۴۰۴ هم به همین ترتیب اضافه می‌شود...
];