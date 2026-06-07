"use client";

import React from "react";
import { useTranslate } from "@/hooks/useTranslate";

export interface BookingRequest {
    id: string;
    clientName: string;
    clientEmail: string;
    avatar?: string;
    date: string;
    day: string;
    timeSlot: string;
    createdAt: string;
    createdLabel: string;
    meetingType: "Online" | "In-Location";
    status: "PENDING" | "ACCEPTED" | "CONFIRMED" | "REJECTED";
    clientNote: string;
    adminNote: string;
}

interface BookingTableProps {
    locale: string;
    requests: BookingRequest[];
    selectedId: string | null;
    onSelectRequest: (request: BookingRequest) => void;
    filter: "ALL" | "PENDING" | "ACCEPTED" | "CONFIRMED" | "REJECTED";
    onUpdateStatus: (id: string, newStatus: "ACCEPTED" | "REJECTED" | "CONFIRMED") => void;
    onDeleteBooking: (id: string) => void;
}

export default function BookingTable({ locale, requests, selectedId, onSelectRequest, filter, onUpdateStatus, onDeleteBooking }: BookingTableProps) {
    const { t } = useTranslate();
    const isRTL = locale === "fa";

    const filteredRequests = requests.filter((req) => {
        if (filter === "ALL") return true;
        return req.status === filter;
    });

    return (
        <div className="w-full bg-transparent md:bg-[#0d0d12]/60 md:backdrop-blur-3xl rounded-none md:rounded-2xl border-none md:border md:border-white/5 overflow-hidden">
            {/* مخفی کردن اسکرول‌بار مرورگر در صورت وجود باگ‌های پیکسلی */}
            <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left border-collapse block md:table md:table-fixed" dir={isRTL ? "rtl" : "ltr"}>
                    <thead className="hidden md:table-header-group">
                        <tr className="border-b border-white/5 bg-[#111118]/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            {/* 🌟 مهندسی دقیق عرض ستون‌ها به درصد تا جدول ۱۰۰٪ قفل شود */}
                            <th className="py-4 px-2 lg:px-4 text-start w-[25%]">{t("adminBooking.tableClient")}</th>
                            <th className="py-4 px-2 lg:px-4 text-start w-[15%]">{t("adminBooking.tableTime")}</th>
                            <th className="py-4 px-2 lg:px-4 text-start w-[15%]">{t("adminBooking.tableCreated")}</th>
                            <th className="py-4 px-2 lg:px-4 text-start w-[18%]">{t("adminBooking.tableType")}</th>
                            <th className="py-4 px-2 lg:px-4 text-center w-[27%]">{t("adminBooking.tableStatus")}</th>
                        </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                        {filteredRequests.map((req) => {
                            const isSelected = selectedId === req.id;
                            const isActionable = req.status !== "CONFIRMED" && req.status !== "REJECTED";

                            const newLocal = "flex-[3] md:flex-none opacity-100 pointer-events-auto";
                            return (
                                <tr
                                    key={req.id}
                                    onClick={() => onSelectRequest(req)}
                                    className={`block md:table-row cursor-pointer transition-all duration-200 w-full mb-4 md:mb-0 rounded-2xl md:rounded-none bg-[#111118]/40 md:bg-transparent border border-white/5 md:border-none md:border-b hover:bg-white/2
                                    ${isSelected ? "md:bg-emerald-500/4 border-emerald-500/20 md:border-emerald-500/0 md:border-l-2 md:border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]" : ""}
                                `}
                                >
                                    {/* اطلاعات کاربر */}
                                    {/* 🌟 کلید حل اسکرول افقی: md:max-w-0 اضافه شد */}
                                    <td className="flex md:table-cell items-center py-4 px-4 md:px-2 lg:px-4 w-full md:max-w-0 border-b border-white/5 md:border-none bg-black/20 md:bg-transparent rounded-t-2xl md:rounded-none">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-11 h-11 md:w-10 md:h-10 shrink-0 rounded-full bg-linear-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm border border-white/10 overflow-hidden">
                                                {req.avatar ? <img src={req.avatar} alt="" className="w-full h-full object-cover" /> : req.clientName[0]}
                                            </div>

                                            {/* 🌟 لایه نگهدارنده: items-start در فارسی خودش به راست و در انگلیسی به چپ می‌چسبد */}
                                            <div className="flex flex-col min-w-0 w-full items-start">

                                                {/* نام کلاینت */}
                                                <span className="text-sm font-semibold text-white truncate max-w-full">
                                                    {req.clientName}
                                                </span>

                                                {/* 🌟 حل قطعی ایمیل: dir="ltr" + text-left + max-w-full */}
                                                <span dir="ltr" className="text-xs text-gray-500 truncate max-w-full text-left">
                                                    {req.clientEmail}
                                                </span>

                                            </div>
                                        </div>
                                    </td>

                                    {/* زمان */}
                                    <td className="flex flex-nowrap md:table-cell justify-between items-center gap-2 py-3 md:py-4 px-4 md:px-2 lg:px-4 w-full md:max-w-0 text-sm border-b border-white/5 md:border-none">
                                        <span className="md:hidden block w-max min-w-max shrink-0 whitespace-nowrap text-xs text-gray-400 font-medium uppercase tracking-wider">
                                            {t("adminBooking.tableTime")}
                                        </span>
                                        <span className="block truncate text-end md:text-start text-gray-300 font-medium tracking-wide">
                                            {req.timeSlot}
                                        </span>
                                    </td>

                                    {/* تاریخ */}
                                    <td className="flex md:table-cell justify-between items-center py-3 md:py-4 px-4 md:px-2 lg:px-4 w-full md:max-w-0 text-xs text-gray-400 italic border-b border-white/5 md:border-none">
                                        <span className="md:hidden text-xs text-gray-400 font-medium uppercase tracking-wider not-italic whitespace-nowrap">
                                            {t("adminBooking.tableCreated")}
                                        </span>
                                        <span className="block truncate text-end md:text-start">{req.createdLabel}</span>
                                    </td>

                                    {/* نوع قرار */}
                                    <td className="flex md:table-cell justify-between items-center py-3 md:py-4 px-4 md:px-2 lg:px-4 w-full md:max-w-0 text-sm border-b border-white/5 md:border-none">
                                        <span className="md:hidden text-xs text-gray-400 font-medium uppercase tracking-wider shrink-0">{t("adminBooking.tableType")}</span>
                                        <div className="flex md:justify-start justify-end w-full min-w-0">
                                            {req.meetingType === "Online" ? (
                                                <span className="flex items-center gap-1.5 text-blue-400 font-medium truncate">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                                                    <span className="truncate">{t("adminBooking.typeOnline")}</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-purple-400 font-medium truncate">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                    <span className="truncate">{t("adminBooking.typeInLocation")}</span>
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* وضعیت و دکمه‌ها */}
                                    <td className="block md:table-cell py-4 px-4 md:px-2 lg:px-4 w-full bg-black/10 md:bg-transparent rounded-b-2xl md:rounded-none" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex flex-col md:flex-row items-center justify-between md:justify-end w-full gap-4 md:gap-0">

                                            {/* لیبل وضعیت و بج */}
                                            <div className="flex items-center justify-between w-full md:w-auto border-b border-white/5 pb-3 md:border-none md:pb-0 shrink-0">
                                                <span className="md:hidden text-xs text-gray-400 font-medium uppercase tracking-wider shrink-0">
                                                    {t("adminBooking.tableStatus")}
                                                </span>

                                                <div className="w-auto md:w-26.25 flex justify-end md:justify-center shrink-0">
                                                    {req.status === "PENDING" && (
                                                        <span className="px-3 md:w-full h-7 md:h-6 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded-lg md:rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                            {t("adminBooking.statusPending")}
                                                        </span>
                                                    )}
                                                    {req.status === "ACCEPTED" && (
                                                        <span className="px-3 md:w-full h-7 md:h-6 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded-lg md:rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                            {t("adminBooking.statusAccepted")}
                                                        </span>
                                                    )}
                                                    {req.status === "CONFIRMED" && (
                                                        <span className="px-2 md:w-full h-7 md:h-6 flex items-center justify-center gap-1 text-[10px] md:text-[9px] font-extrabold tracking-wider uppercase rounded-lg md:rounded-md bg-cyan-950/40 border border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)] select-none">
                                                            <svg className="w-3.5 h-3.5 md:w-3 md:h-3 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                            </svg>
                                                            <span className="truncate">{t("adminBooking.statusConfirmed")}</span>
                                                            <span className="relative flex h-1.5 w-1.5 md:h-1 md:w-1 shrink-0 ml-0.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-full w-full bg-cyan-500"></span>
                                                            </span>
                                                        </span>
                                                    )}
                                                    {req.status === "REJECTED" && (
                                                        <span className="px-3 md:w-full h-7 md:h-6 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded-lg md:rounded bg-red-500/10 border border-red-500/20 text-red-400">
                                                            {t("adminBooking.statusRejected")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* دکمه‌های عملیاتی */}
                                            <div className="flex items-center w-full md:w-auto gap-2 shrink-0">
                                                <div className={`flex items-center gap-2 md:gap-1.5 md:w-25 md:border-l border-white/5 md:pl-2 md:shrink-0 transition-all duration-200 ${isActionable
                                                        ? newLocal
                                                        : "hidden md:flex md:flex-none opacity-0 pointer-events-none select-none"
                                                    }`}>
                                                    <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(req.id, "ACCEPTED"); }} className="flex-1 md:flex-none md:w-7.5 h-10 md:h-8 flex justify-center items-center rounded-xl md:rounded text-emerald-400 bg-emerald-500/10 md:bg-transparent hover:bg-emerald-500/20 transition-all active:scale-95" title="Accept">
                                                        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(req.id, "CONFIRMED"); }} className="flex-1 md:flex-none md:w-7.5 h-10 md:h-8 flex justify-center items-center rounded-xl md:rounded text-teal-400 bg-teal-500/10 md:bg-transparent hover:bg-teal-500/20 transition-all active:scale-95" title="Confirm Final">
                                                        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(req.id, "REJECTED"); }} className="flex-1 md:flex-none md:w-7.5 h-10 md:h-8 flex justify-center items-center rounded-xl md:rounded text-red-400 bg-red-500/10 md:bg-transparent hover:bg-red-500/20 transition-all active:scale-95" title="Reject">
                                                        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>

                                                <div className="flex shrink-0 flex-1 md:flex-none md:w-8 justify-center md:border-none border-l border-white/5 pl-2 md:pl-0">
                                                    <button onClick={(e) => { e.stopPropagation(); onDeleteBooking(req.id); }} className="w-full h-10 md:h-8 flex justify-center items-center rounded-xl md:rounded text-red-500/90 bg-red-500/10 md:bg-transparent hover:bg-red-500/30 hover:text-red-400 transition-all active:scale-95 md:border border-transparent hover:border-red-500/20" title="Permanently Delete">
                                                        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}