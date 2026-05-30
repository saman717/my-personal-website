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
}

export default function BookingTable({ locale, requests, selectedId, onSelectRequest, filter, onUpdateStatus }: BookingTableProps) {
    const { t } = useTranslate();
    const isRTL = locale === "fa";

    // منطق فیلتر کردن
    const filteredRequests = requests.filter((req) => {
        if (filter === "ALL") return true;
        return req.status === filter;
    });

    return (
        <div className="w-full bg-[#0d0d12]/60 backdrop-blur-3xl rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
                    <thead>
                        <tr className="border-b border-white/5 bg-[#111118]/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-6 text-start">{t("adminBooking.tableClient")}</th>
                            <th className="py-4 px-6 text-start">{t("adminBooking.tableTime")}</th>
                            <th className="py-4 px-6 text-start">{t("adminBooking.tableCreated")}</th>
                            <th className="py-4 px-6 text-start">{t("adminBooking.tableType")}</th>
                            <th className="py-4 px-6 text-center">{t("adminBooking.tableStatus")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {/* نکته کلیدی: استفاده از filteredRequests به جای requests */}
                        {filteredRequests.map((req) => {
                            const isSelected = selectedId === req.id;
                            return (
                                <tr
                                    key={req.id}
                                    onClick={() => onSelectRequest(req)}
                                    className={`cursor-pointer transition-all duration-200 hover:bg-white/[0.02]
                                    ${isSelected ? "bg-emerald-500/[0.04] border-l-2 border-l-emerald-500" : ""}
                                `}
                                >
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm border border-white/10 overflow-hidden">
                                            {req.avatar ? <img src={req.avatar} alt="" /> : req.clientName[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-white">{req.clientName}</span>
                                            <span className="text-xs text-gray-500">{req.clientEmail}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-300 font-medium tracking-wide">
                                        {req.timeSlot}
                                    </td>
                                    <td className="py-4 px-6 text-xs text-gray-400 italic">
                                        {req.createdLabel}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        {req.meetingType === "Online" ? (
                                            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                Google Meet
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                In Location
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            {req.status === "PENDING" && (
                                                <span className="w-21 h-6.5 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                    {t("adminBooking.statusPending")}
                                                </span>
                                            )}

                                            {req.status === "ACCEPTED" && (
                                                <span className="w-21 h-6.5 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                    {t("adminBooking.statusAccepted")}
                                                </span>
                                            )}

                                            {req.status === "CONFIRMED" && (
                                                <span className="w-21 h-6.5 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded bg-teal-500/10 border border-teal-500/20 text-teal-400">
                                                    {t("adminBooking.statusConfirmed")}
                                                </span>
                                            )}

                                            {req.status === "REJECTED" && (
                                                <span className="w-21 h-6.5 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase rounded bg-red-500/10 border border-red-500/20 text-red-400">
                                                    {t("adminBooking.statusRejected")}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1.5 ml-2 border-l border-white/5 pl-2">
                                                {/* دکمه تایید */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(req.id, "ACCEPTED"); }}
                                                    className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </button>

                                                {/* دکمه تقویم */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); /* لاجیک تقویم */ }}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </button>

                                                {/* دکمه رد کردن */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(req.id, "REJECTED"); }}
                                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
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