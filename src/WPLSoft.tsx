import * as React from "react";

const IconPLC = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.width || 100}
    height={props.height || 100}
    {...props}
  >
    {/* جعبه اصلی PLC */}
    <rect x="15" y="20" width="70" height="60" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
    
    {/* برچسب PLC */}
    <text x="50" y="40" fontFamily="sans-serif" fontSize="12" fill="#60a5fa" textAnchor="middle" fontWeight="bold">PLC</text>
    
    {/* چراغ‌های LED (4 عدد) */}
    <circle cx="30" cy="55" r="3" fill="#10b981" />
    <circle cx="42" cy="55" r="3" fill="#10b981" />
    <circle cx="54" cy="55" r="3" fill="#f59e0b" />
    <circle cx="66" cy="55" r="3" fill="#ef4444" />
    
    {/* پورت‌های ورودی (چپ) */}
    <rect x="10" y="30" width="8" height="4" rx="1" fill="#475569" />
    <rect x="10" y="40" width="8" height="4" rx="1" fill="#475569" />
    <rect x="10" y="50" width="8" height="4" rx="1" fill="#475569" />
    <rect x="10" y="60" width="8" height="4" rx="1" fill="#475569" />
    
    {/* پورت‌های خروجی (راست) */}
    <rect x="82" y="30" width="8" height="4" rx="1" fill="#475569" />
    <rect x="82" y="40" width="8" height="4" rx="1" fill="#475569" />
    <rect x="82" y="50" width="8" height="4" rx="1" fill="#475569" />
    <rect x="82" y="60" width="8" height="4" rx="1" fill="#475569" />
    
    {/* سیم‌های ورودی */}
    <path d="M10,32 L2,32" stroke="#ef4444" strokeWidth="1.5" fill="none" />
    <path d="M10,42 L2,42" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
    <path d="M10,52 L2,52" stroke="#10b981" strokeWidth="1.5" fill="none" />
    <path d="M10,62 L2,62" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    
    {/* سیم‌های خروجی */}
    <path d="M90,32 L98,32" stroke="#34d399" strokeWidth="1.5" fill="none" />
    <path d="M90,42 L98,42" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
    <path d="M90,52 L98,52" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    <path d="M90,62 L98,62" stroke="#ef4444" strokeWidth="1.5" fill="none" />
    
    {/* نماد AND gate (دروازه منطقی) */}
    <path d="M35,70 L35,78 L50,78 L50,70" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
    <path d="M50,70 L50,78" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
    <circle cx="42.5" cy="74" r="2" fill="#60a5fa" />
  </svg>
);

export default IconPLC;