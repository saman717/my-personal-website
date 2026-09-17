"use client";

import React from "react";

// تعریف اینترفیس در خود فایل برای حذف وابستگی به فایل‌های دیگر
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
    labels: any; 
}

export default function BookingTable({ 
    locale, requests, selectedId, onSelectRequest, filter, onUpdateStatus, onDeleteBooking, labels 
}: BookingTableProps) {
    const isRTL = locale === "fa";
    const tableLabels = labels?.table || {}; 

    const filteredRequests = requests.filter((req) => {
        if (filter === "ALL") return true;
        return req.status === filter;
    });

    return (
        <div className="w-full bg-transparent md:bg-[#0d0d12]/60 md:backdrop-blur-3xl rounded-none md:rounded-2xl border-none md:border md:border-white/5 overflow-hidden">
            <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left border-collapse block md:table md:table-fixed" dir={isRTL ? "rtl" : "ltr"}>
                    <thead className="hidden md:table-header-group">
                        <tr className="border-b border-white/5 bg-[#111118]/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-4 text-start w-[25%]">{tableLabels.client || "Client"}</th>
                            <th className="py-4 px-4 text-start w-[15%]">{tableLabels.time || "Time"}</th>
                            <th className="py-4 px-4 text-start w-[15%]">{tableLabels.created || "Created"}</th>
                            <th className="py-4 px-4 text-start w-[18%]">{tableLabels.type || "Type"}</th>
                            <th className="py-4 px-4 text-center w-[27%]">{tableLabels.status || "Status"}</th>
                        </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                        {filteredRequests.map((req) => {
                            const isSelected = selectedId === req.id;
                            return (
                                <tr key={req.id} onClick={() => onSelectRequest(req)} className={`block md:table-row cursor-pointer transition-all w-full mb-4 md:mb-0 rounded-2xl md:rounded-none bg-[#111118]/40 md:bg-transparent border border-white/5 md:border-none md:border-b hover:bg-white/2 ${isSelected ? "md:bg-emerald-500/4 border-emerald-500/20 md:border-l-2 md:border-l-emerald-500" : ""}`}>
                                    
                                    {/* Client */}
                                    <td className="flex md:table-cell items-center py-4 px-4 w-full md:max-w-0 border-b border-white/5 md:border-none bg-black/20 md:bg-transparent rounded-t-2xl md:rounded-none">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                                                {req.avatar ? <img src={req.avatar} alt="" /> : req.clientName[0]}
                                            </div>
                                            <div className="flex flex-col min-w-0 items-start">
                                                <span className="text-sm font-semibold text-white truncate w-full">{req.clientName}</span>
                                                <span dir="ltr" className="text-xs text-gray-500 truncate w-full text-left">{req.clientEmail}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Time */}
                                    <td className="flex md:table-cell justify-between items-center py-4 px-4 w-full text-sm border-b border-white/5 md:border-none">
                                        <span className="md:hidden text-xs text-gray-400">{tableLabels.time}</span>
                                        <span className="text-gray-300 font-medium">{req.timeSlot}</span>
                                    </td>

                                    {/* Created */}
                                    <td className="flex md:table-cell justify-between items-center py-4 px-4 w-full text-xs text-gray-400 border-b border-white/5 md:border-none">
                                        <span className="md:hidden text-xs text-gray-400">{tableLabels.created}</span>
                                        <span className="text-right md:text-left">{req.createdLabel}</span>
                                    </td>

                                    {/* Type */}
                                    <td className="flex md:table-cell justify-between items-center py-4 px-4 w-full text-sm border-b border-white/5 md:border-none">
                                        <span className="md:hidden text-xs text-gray-400">{tableLabels.type}</span>
                                        <span className={req.meetingType === "Online" ? "text-blue-400" : "text-purple-400"}>
                                            {req.meetingType === "Online" ? tableLabels.typeOnline : tableLabels.typeInLocation}
                                        </span>
                                    </td>

                                    {/* Status & Actions */}
                                    <td className="block md:table-cell py-4 px-4 w-full bg-black/10 md:bg-transparent rounded-b-2xl md:rounded-none">
                                        {/* اینجا دکمه‌های عملیاتی را قرار بده */}
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