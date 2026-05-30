"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavLinkProps {
    href: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    badge?: string;
    badgeStyle?: string;
    isRtl?: boolean;
}

export default function NavLink({ href, icon, children, badge, badgeStyle, isRtl }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`relative flex items-center justify-between gap-3 px-4 md:px-5 py-2 md:py-1 rounded-xl text-xs md:text-sm transition-all duration-300 group ${
                isActive
                    ? "bg-[#1A1D23] text-neon-emerald"
                    : "text-gray-400 hover:text-white"
            }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                {icon && (
                    <div className={`flex-shrink-0 ${isActive ? "drop-shadow-[0_0_4px_var(--color-neon-emerald)]" : ""}`}>
                        {icon}
                    </div>
                )}
                <span className="font-medium tracking-tight truncate">
                    {children}
                </span>
            </div>

            {isActive && (
                <span
                    className={`absolute top-0 h-full w-1.5 bg-neon-emerald shadow-[0_0_12px_var(--color-neon-emerald)]
                    ${isRtl ? "left-0 rounded-r-lg" : "right-0 rounded-l-lg"}`}
                />
            )}

            {badge && (
                <span className={`absolute top-1/2 -translate-y-1/2 text-black px-2 py-0.5 rounded-md text-[10px] font-bold shadow-[0_0_10px_var(--color-neon-cyan)] bg-white/90 ${badgeStyle}`}>
                    {badge}
                </span>
            )}
        </Link>
    );
}