"use client";

import { motion } from "framer-motion";

interface CurvedLineProps {
  scrollYProgress: any; // MotionValue از useScroll
}

export default function CurvedLine({ scrollYProgress }: CurvedLineProps) {
  return (
    <svg
      viewBox="0 0 1200 1718"
      className="absolute inset-0 w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* خط اصلی سفید - طول آن به اسکرول وابسته است */}
      <motion.path
        id="curve-path"
        d="
 
 M 500 -150 
  C 1100 250, 1000 400, 700 550 
  C 400 700, 200 750, 400 950 
  C 600 1150, 900 1200, 800 1300
  C 780 1305, 770 1295, 760 1310
  C 745 1320, 740 1305, 735 1320
  C 720 1335, 715 1315, 710 1330
  C 695 1345, 690 1325, 680 1340
  C 670 1355, 665 1335, 655 1350
  C 645 1365, 640 1345, 630 1360
  C 620 1375, 615 1355, 605 1370
  C 595 1385, 590 1365, 580 1380
  C 595 1385, 590 1365, 580 1380
  C 595 1385, 590 1365, 580 1380

  
   
   
  "
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        style={{ pathLength: scrollYProgress }} // طول خط با اسکرول تغییر می‌کند
      />

      {/* خط تار برای زیبایی (Glow) */}
      <motion.path
        d="
          M 500 -150 
          C 1100 250, 1000 400, 700 550 
          C 400 700, 200 750, 400 950 
          C 600 1150, 900 1200, 800 1300
          C 750 1350, 700 1400, 750 1450
        "
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="30"
        filter="blur(10px)"
        style={{ pathLength: scrollYProgress }} // هماهنگ با خط اصلی
      />
    </svg>
  );
}