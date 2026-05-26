"use client";

import React, { useState } from "react";

interface ContactInfoLabels {
    heading: string;
    description: string;
    emailLabel: string;
    phoneLabel: string;
    copied: string;
    scheduleMeeting: string;
}

interface ContactInfoProps {
    email: string;
    phone: string;
    socialCount?: number;
    labels: ContactInfoLabels;
    isRTL: boolean;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
    email,
    phone,
    socialCount = 5,
    labels,
    isRTL
}) => {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 2000);
    };

    return (
        <div
            className={`w-full max-w-100 space-y-9 ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "ltr" : "rtl"}
        >
            {/* تیتر و کپشن */}
            <div className={`space-y-4 ${isRTL ? "text-left" : "text-right"}`}>
                <h2 className="text-2xl md:text-[32px] text-white leading-snug tracking-tight">
                    {labels.heading}
                </h2>
                <p className={`text-gray-400 text-sm md:text-[15px] leading-7 font-normal ${isRTL ? "pl-2" : "pr-2"}`}>
                    {labels.description}
                </p>
            </div>

            {/* باکس‌های ارتباطی با کادر نئون فیروزه‌ای ظریف */}
            <div className="space-y-12 font-mono">
                {/* ایمیل */}
                <div
                    onClick={() => handleCopy(email, "email")}
                    className="select-box flex items-center justify-between bg-[#0b0c10]/90 border border-emerald-500/30 rounded-xl p-4 text-sm cursor-pointer hover:border-emerald-500/60 transition-all duration-300 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <span className="text-gray-400 font-sans text-xs md:text-sm font-medium order-2 select-none group-hover:text-white transition-colors">
                                {labels.emailLabel} :
                            </span>
                        </div>
                        <div>
                            <span className={`text-emerald-400 w-full order-1 select-all tracking-wide text-xs md:text-[14px] ${isRTL ? "text-left pl-2" : "text-right pr-2"}`}>
                                {email}
                            </span>
                        </div>
                    </div>
                    {copiedText === "email" && (
                        <span className={`absolute -top-6 bg-emerald-500 text-black text-[10px] font-sans px-2 py-0.5 rounded shadow-md animate-bounce ${isRTL ? "left-2" : "right-2"}`}>
                            {labels.copied}
                        </span>
                    )}
                </div>

                {/* شماره تماس */}
                <div
                    onClick={() => handleCopy(phone, "phone")}
                    className="select-box flex items-center justify-between bg-[#0b0c10]/90 border border-emerald-500/30 rounded-xl p-4 text-sm cursor-pointer hover:border-emerald-500/60 transition-all duration-300 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <span className="text-gray-400 font-sans text-xs md:text-sm font-medium order-2 select-none group-hover:text-white transition-colors">
                                {labels.phoneLabel} :
                            </span>
                        </div>
                        <div>
                            <span className={`text-emerald-400 w-full order-1 select-all tracking-wide text-sm ${isRTL ? "text-left pl-2" : "text-right pr-2"}`}>
                                {phone}
                            </span>
                        </div>
                    </div>

                    {copiedText === "phone" && (
                        <span className={`absolute -top-6 bg-emerald-500 text-black text-[10px] font-sans px-2 py-0.5 rounded shadow-md animate-bounce ${isRTL ? "left-2" : "right-2"}`}>
                            {labels.copied}
                        </span>
                    )}
                </div>
            </div>

            {/* شبکه‌های اجتماعی */}
            <div className="flex items-center justify-center gap-3 py-1">
                {Array.from({ length: socialCount }).map((_, index) => (
                    <a
                        key={index}
                        href="#"
                        className="w-12 h-12 border border-gray-700/70 rounded-xl hover:border-white hover:bg-white/2 transition-all duration-300 flex items-center justify-center shadow-inner group"
                        aria-label={`Social Link ${index + 1}`}
                    >
                        <div className="w-5 h-5 rounded-md border border-gray-600/40 bg-transparent group-hover:border-gray-400" />
                    </a>
                ))}
            </div>

            {/* دکمه تعیین وقت با کادر گرادینت نئونی واقعی */}
            <div className="relative group rounded-xl p-px bg-linear-to-l  from-emerald-500 via-emerald-400 to-purple-600 shadow-[0_0_25px_rgba(16,185,129,0.12)] hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-500 ">

                <button
                    onClick={() => console.log("Calendar Opened")}
                    className="w-full flex items-center justify-between bg-[#090a0f] rounded-[11px] p-4 text-white font-semibold transition-all duration-300 cursor-pointer"
                >
                    <span className="text-base md:text-lg tracking-wide">
                        {labels.scheduleMeeting}
                    </span>

                    {/* باکس مربع شکل بنفش داخل دکمه */}
                    <div className="w-7 h-7 border border-purple-500/80 rounded-md bg-purple-500/5 shadow-[inset_0_0_8px_rgba(168,85,247,0.2)]" />
                </button>



            </div>
        </div>
    );
};