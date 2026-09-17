"use client";

import React from "react";
import BookingTable from "@/components/admin/booking/BookingTable";
import BookingRules from "@/components/admin/booking/BookingRules";
import ProjectDetails from "@/components/admin/booking/ProjectDetails";
import SidePanel from "@/components/admin/booking/SidePanel";
import AdminCalendarManager from "@/components/admin/AdminCalendarManager";
import { useBookingManager } from "@/hooks/useBookingManager";

interface AdminBookingsPageContentProps {
    locale: string;
    labels: any;
}

export default function AdminBookingsPageContent({ locale, labels }: AdminBookingsPageContentProps) {
    const isRTL = locale === "fa";

    // 🌟 پاس دادن labels به هوک
    const {
        requests, loading, panelType, setPanelType, selectedRequest, 
        activeFilter, setActiveFilter, handleUpdateStatus, handleDeleteBooking, 
        handleOpenDetails, fetchBookings
    } = useBookingManager(locale, labels);

    const filters: { id: any; label: string }[] = [
        { id: "ALL", label: labels?.filterAll || "All" },
        { id: "PENDING", label: labels?.statusPending || "Pending" },
        { id: "ACCEPTED", label: labels?.statusAccepted || "Accepted" },
        { id: "CONFIRMED", label: labels?.statusConfirmed || "Confirmed" },
        { id: "REJECTED", label: labels?.statusRejected || "Rejected" },
    ];

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#07070a] py-10 px-4 md:px-8 text-white space-y-8">
            <AdminCalendarManager/>
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-white">{labels?.title || "Bookings"}</h1>
                    </div>
                    <button
                        onClick={() => setPanelType("RULES")}
                        className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all active:scale-95"
                    >
                        {labels?.globalRules || "Rules"}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 bg-[#111118]/50 p-1 rounded-xl w-full md:w-fit border border-white/5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeFilter === f.id
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Table Content */}
                <div className="w-full">
                    {loading && requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#0d0d12]/40 rounded-2xl border border-white/5">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-gray-500 italic">
                                {labels?.loading_table || "Loading..."}
                            </span>
                        </div>
                    ) : (
                        <BookingTable
                            locale={locale}
                            requests={requests}
                            selectedId={selectedRequest?.id || null}
                            onSelectRequest={handleOpenDetails}
                            filter={activeFilter}
                            onUpdateStatus={handleUpdateStatus}
                            onDeleteBooking={handleDeleteBooking}
                            labels={labels} // در صورت نیاز در داخل کامپوننت تیبل
                        />
                    )}
                </div>
            </div>

            {/* Side Panels */}
            <SidePanel isOpen={panelType !== null} onClose={() => setPanelType(null)} title={panelType === "RULES" ? (labels?.globalRules || "Rules") : (labels?.projectDesc || "Project Details")}>
                {panelType === "RULES" && <BookingRules locale={locale} labels={labels?.rules} />}
                {panelType === "DETAILS" && (
                    <ProjectDetails locale={locale} selectedRequest={selectedRequest} onActionSuccess={fetchBookings} />
                )}
            </SidePanel>
        </div>
    );
}