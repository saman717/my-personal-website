// data/timelineData.ts

export interface GeoPositionItem {
  id: number;
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  dotX: number;
  dotY: number;
  yearX: number;
  yearY: number;
  scrollRange: [number, number, number];
  icon: string;
  // کلیدهای متناظر در فایل JSON برای خواندن داینامیک
  translationKeys: {
    year: string;
    title: string;
    tech: string;
  };
}

export const geoPositions: GeoPositionItem[] = [
  { 
    id: 1, 
    cardX: 60, cardY: 250, cardWidth: 380, cardHeight: 360, 
    dotX: 560, dotY: 450, yearX: 610, yearY: 420, 
    scrollRange: [0.02, 0.15, 0.32], 
    icon: "🚩",
    translationKeys: { year: "item_1_year", title: "item_1_title", tech: "item_1_tech" }
  },
  { 
    id: 2, 
    cardX: 760, cardY: 750, cardWidth: 380, cardHeight: 360, 
    dotX: 640, dotY: 950, yearX: 480, yearY: 920, 
    scrollRange: [0.32, 0.52, 0.70], 
    icon: "💻",
    translationKeys: { year: "item_2_year", title: "item_2_title", tech: "item_2_tech" }
  },
  { 
    id: 3, 
    cardX: 80, cardY: 1350, cardWidth: 380, cardHeight: 360, 
    dotX: 560, dotY: 1550, yearX: 610, yearY: 1520, 
    scrollRange: [0.70, 0.85, 0.98], 
    icon: "⚙️",
    translationKeys: { year: "item_3_year", title: "item_3_title", tech: "item_3_tech" }
  },
];