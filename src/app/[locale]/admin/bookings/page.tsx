"use client";

import React, { useState, use, useEffect } from "react";
import BookingTable, { BookingRequest } from "@/components/admin/booking/BookingTable";
import BookingRules from "@/components/admin/booking/BookingRules";
import ProjectDetails from "@/components/admin/booking/ProjectDetails";
import SidePanel from "@/components/admin/booking/SidePanel";
import { useTranslate } from "@/hooks/useTranslate";
import { getAdminBookingsAction, updateBookingStatusAction } from "@/actions/admin-bookings";

type FilterType =  "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED";

/**
 * تابع کمکی برای محاسبه زمان ثبت درخواست به صورت نسبی (مثلا: ۲ ساعت پیش)
 */
function getRelativeTime(dateString: string, locale: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // کمتر از یک دقیقه
    if (diffInSeconds < 60) {
        return locale === "fa" ? "لحظاتی پیش" : "Just now";
    }

    // کمتر از یک ساعت
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return locale === "fa" ? `${diffInMinutes} دقیقه پیش` : `${diffInMinutes} mins ago`;
    }

    // کمتر از یک شبانه‌روز
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return locale === "fa" ? `${diffInHours} ساعت پیش` : `${diffInHours} hours ago`;
    }

    // بازه روزها
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
        return locale === "fa" ? "دیروز" : "Yesterday";
    }
    if (diffInDays < 7) {
        return locale === "fa" ? `${diffInDays} روز پیش` : `${diffInDays} days ago`;
    }

    // بیشتر از یک هفته، تاریخ مطلق نمایش داده می‌شود
    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" });
}


export default function AdminBookingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t } = useTranslate();
    const isRTL = locale === "fa";
    // در بدنه تابع AdminBookingsPage، بعد از fetchBookings قرار دهید:

const handleUpdateStatus = async (id: string, newStatus: "ACCEPTED" | "REJECTED" | "CONFIRMED") => {
    // فرض بر این است که updateBookingStatusAction را ایمپورت کرده‌اید
    const response = await updateBookingStatusAction(id, newStatus);
    
    if (response?.success) {
        await fetchBookings(); // رفرش لیست
    } else {
        alert("خطا در به‌روزرسانی وضعیت");
    }
};

    // تعریف استیت‌ها برای ذخیره درخواست‌ها و مدیریت وضعیت لودینگ
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [panelType, setPanelType] = useState<"RULES" | "DETAILS" | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

    // تابع دریافت دیتا از سرور اکشن و فرمت‌دهی آن به ساختار BookingRequest
    const fetchBookings = async () => {
        setLoading(true);
        const response = await getAdminBookingsAction();

        if (response.success && response.data) {
            const formattedData: BookingRequest[] = response.data.map((item: any) => {
                const dateObj = new Date(item.createdAt);

                return {
                    id: String(item.id),
                    clientName: item.clientName,
                    clientEmail: item.clientEmail,
                    date: item.date,
                    timeSlot: item.timeSlot,
                    meetingType: item.meetingType,
                    status: item.status,

                    // 🌟 این دو خط باید دقیقاً به این شکل باشند:
                    clientNote: item.clientNote || "",
                    adminNote: item.adminNote || "", // <--- این خط را اضافه کنید

                    createdAt: dateObj.toISOString(),
                    day: dateObj.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { weekday: "long" }),
                    createdLabel: getRelativeTime(item.createdAt, locale),
                };
            });

            setRequests(formattedData);

            // همگام‌سازی سایدبار باز شده با آخرین اطلاعات تغییر یافته در دیتابیس
            if (selectedRequest) {
                const updatedSelected = formattedData.find(r => r.id === selectedRequest.id);
                if (updatedSelected) {
                    setSelectedRequest(updatedSelected);
                }
            }
        }
        setLoading(false);
    };

    // بارگذاری لیست در اولین اجرای کامپوننت یا با تغییر زبان
    useEffect(() => {
        fetchBookings();
    }, [locale]);

    const handleOpenDetails = (req: BookingRequest) => {
        setSelectedRequest(req);
        setPanelType("DETAILS");
    };

    const filters: { id: FilterType; label: string }[] = [
        { id: "ALL", label: t("adminBooking.filterAll") || "All" },
        { id: "PENDING", label: t("adminBooking.statusPending") || "Pending" },
        { id: "ACCEPTED", label: t("adminBooking.statusAccepted") || "Accepted" },
        { id: "CONFIRMED", label: t("adminBooking.statusConfirmed") || "Confirmed" },
    ];

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#07070a] py-10 px-4 md:px-8 text-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                {/* هدر صفحه */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            {t("adminBooking.title")}
                        </h1>
                    </div>
                    <button
                        onClick={() => setPanelType("RULES")}
                        className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all active:scale-95"
                    >
                        {t("adminBooking.globalRules")}
                    </button>
                </div>

                {/* تب‌های فیلتر */}
                <div className="flex gap-2 bg-[#111118]/50 p-1 rounded-xl w-fit border border-white/5">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeFilter === f.id
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* مدیریت لودینگ شیک نئونی و نمایش جدول */}
                <div className="w-full">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#0d0d12]/40 rounded-2xl border border-white/5">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-gray-500 italic">
                                {isRTL ? "در حال بارگذاری لیست جلسات..." : "Loading booking requests..."}
                            </span>
                        </div>
                    ) : (
                        <BookingTable
                            locale={locale}
                            requests={requests}
                            selectedId={selectedRequest?.id || null}
                            onSelectRequest={handleOpenDetails}
                            filter={activeFilter}
                            onUpdateStatus={handleUpdateStatus} // این خط اضافه شود
                        />
                    )}
                </div>
            </div>

            {/* پنل کشویی کناری */}
            <SidePanel
                isOpen={panelType !== null}
                onClose={() => setPanelType(null)}
                title={panelType === "RULES" ? t("adminBooking.globalRules") : t("adminBooking.projectDesc")}
            >
                {panelType === "RULES" && <BookingRules locale={locale} />}
                {panelType === "DETAILS" && (
                    <ProjectDetails
                        locale={locale}
                        selectedRequest={selectedRequest}
                        onActionSuccess={fetchBookings} // رفرش آنی داده‌ها پس از تایید یا رد درخواست در سایدبار
                    />
                )}
            </SidePanel>
        </div>
    );
}