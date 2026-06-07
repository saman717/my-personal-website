"use client";

import React, { useState, use, useEffect, useRef } from "react";
import BookingTable, { BookingRequest } from "@/components/admin/booking/BookingTable";
import BookingRules from "@/components/admin/booking/BookingRules";
import ProjectDetails from "@/components/admin/booking/ProjectDetails";
import SidePanel from "@/components/admin/booking/SidePanel";
import { useTranslate } from "@/hooks/useTranslate";
import { useToast } from "@/context/ToastContext";
import { getAdminBookingsAction, updateBookingStatusAction, deleteBookingAction } from "@/actions/admin-bookings";
import AdminCalendarManager from "@/components/admin/AdminCalendarManager";

type FilterType = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED";

function getRelativeTime(dateString: string, locale: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return locale === "fa" ? "لحظاتی پیش" : "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return locale === "fa" ? `${diffInMinutes} دقیقه پیش` : `${diffInMinutes} mins ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return locale === "fa" ? `${diffInHours} ساعت پیش` : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
        return locale === "fa" ? "دیروز" : "Yesterday";
    }
    if (diffInDays < 7) {
        return locale === "fa" ? `${diffInDays} روز پیش` : `${diffInDays} days ago`;
    }

    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" });
}

export default function AdminBookingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t } = useTranslate();
    const { showToast, updateToast, dismissToast } = useToast();
    const isRTL = locale === "fa";

    // رفرنس‌های هوشمند کانتکست نوتیفیکیشن
    const loadingToastIdRef = useRef<number | null>(null);
    const hasInitialLoadedRef = useRef<boolean>(false);

    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [panelType, setPanelType] = useState<"RULES" | "DETAILS" | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

    // تابع اصلی دریافت داتا با هندل کردن حالت‌های توست
    const fetchBookings = async () => {
        setLoading(true);

        if (!hasInitialLoadedRef.current && !loadingToastIdRef.current) {
            loadingToastIdRef.current = showToast(
                locale === "fa" ? "در حال بارگذاری درخواست‌های رزرو..." : "Loading booking requests...",
                "loading-white"
            );
        }

        try {
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
                        clientNote: item.clientNote || "",
                        adminNote: item.adminNote || "",
                        createdAt: dateObj.toISOString(),
                        day: dateObj.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { weekday: "long" }),
                        createdLabel: getRelativeTime(item.createdAt, locale),
                    };
                });

                setRequests(formattedData);

                if (selectedRequest) {
                    const updatedSelected = formattedData.find(r => r.id === selectedRequest.id);
                    if (updatedSelected) {
                        setSelectedRequest(updatedSelected);
                    }
                }

                if (loadingToastIdRef.current) {
                    updateToast(
                        loadingToastIdRef.current,
                        locale === "fa" ? "درخواست‌ها با موفقیت بارگذاری شدند." : "Bookings loaded successfully.",
                        "success"
                    );
                    loadingToastIdRef.current = null;
                    hasInitialLoadedRef.current = true;
                }
            } else {
                if (loadingToastIdRef.current) {
                    updateToast(
                        loadingToastIdRef.current,
                        locale === "fa" ? (response.error ?? "خطا در دریافت اطلاعات") : "Failed to load bookings.",
                        "error"
                    );
                    loadingToastIdRef.current = null;
                }
            }
        } catch (error) {
            if (loadingToastIdRef.current) {
                updateToast(
                    loadingToastIdRef.current,
                    locale === "fa" ? "خطا در اتصال به دیتابیس یا سرور" : "Database or network connection failed.",
                    "error"
                );
                loadingToastIdRef.current = null;
            }
        } finally { // 🌟 باگ سینتکس برطرف شد (اضافه شدن finally)
            setLoading(false);
        }
    };

    // تغییر وضعیت دکمه‌ها با استفاده از توست و گارد امنیتی کلاینت
    const handleUpdateStatus = async (id: string, newStatus: "ACCEPTED" | "REJECTED" | "CONFIRMED") => {
        const target = requests.find(r => r.id === id);
        if (target && (target.status === "CONFIRMED" || target.status === "REJECTED")) {
            showToast(locale === "fa" ? "این جلسه قفل شده و قابل تغییر نیست." : "This session is locked.", "error");
            return;
        }

        const actionToastId = showToast(
            locale === "fa" ? "در حال به‌روزرسانی وضعیت..." : "Updating status...",
            "loading-orange"
        );

        try {
            const response = await updateBookingStatusAction(id, newStatus);

            if (response?.success) {
                await fetchBookings();
                updateToast(
                    actionToastId,
                    locale === "fa" ? "وضعیت با موفقیت تغییر کرد." : "Status updated successfully.",
                    "success"
                );
            } else {
                updateToast(
                    actionToastId,
                    locale === "fa" ? (response?.error ?? "خطا در عملیات") : "Failed to update status.",
                    "error"
                );
            }
        } catch (error) {
            updateToast(
                actionToastId,
                locale === "fa" ? "خطایی در ارتباط با سرور رخ داد." : "Server connection error.",
                "error"
            );
        }
    };

    const handleDeleteBooking = async (id: string) => {
        const isConfirmed = window.confirm(
            locale === "fa"
                ? "آیا از حذف کامل و قطعی این درخواست رزرو اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
                : "Are you sure you want to permanently delete this booking request? This action cannot be undone."
        );

        if (!isConfirmed) return;

        const deleteToastId = showToast(
            locale === "fa" ? "در حال حذف درخواست..." : "Deleting booking request...",
            "loading-orange"
        );

        try {
            const response = await deleteBookingAction(id);

            if (response.success) {
                if (selectedRequest?.id === id) {
                    setPanelType(null);
                    setSelectedRequest(null);
                }

                await fetchBookings();

                updateToast(
                    deleteToastId,
                    locale === "fa" ? "درخواست با موفقیت حذف شد." : "Booking deleted successfully.",
                    "success"
                );
            } else {
                updateToast(
                    deleteToastId,
                    locale === "fa" ? (response.error ?? "خطا در حذف رکورد") : "Failed to delete booking.",
                    "error"
                );
            }
        } catch (error) {
            updateToast(
                deleteToastId,
                locale === "fa" ? "خطا در ارتباط با سرور رخ داد." : "Server connection error.",
                "error"
            );
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [locale]);

    useEffect(() => {
        return () => {
            if (loadingToastIdRef.current) {
                dismissToast(loadingToastIdRef.current);
            }
        };
    }, [dismissToast]);

    const handleOpenDetails = (req: BookingRequest) => {
        setSelectedRequest(req);
        setPanelType("DETAILS");
    };

    const filters: { id: FilterType; label: string }[] = [
        { id: "ALL", label: t("adminBooking.filterAll") || "All" },
        { id: "PENDING", label: t("adminBooking.statusPending") || "Pending" },
        { id: "ACCEPTED", label: t("adminBooking.statusAccepted") || "Accepted" },
        { id: "CONFIRMED", label: t("adminBooking.statusConfirmed") || "Confirmed" },
        { id: "REJECTED", label: t("adminBooking.statusRejected") || "Rejected" }, // 🌟 افزوده شدن وضعیت رد شده به تب‌ها
    ];

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#07070a] py-10 px-4 md:px-8 text-white space-y-8">
            <AdminCalendarManager/>
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
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

                {/* 🌟 باگ اسکرول تب‌ها در موبایل با این کلاس‌ها فیکس شد */}
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

                <div className="w-full">
                    {loading && requests.length === 0 ? (
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
                            onUpdateStatus={handleUpdateStatus}
                            onDeleteBooking={handleDeleteBooking}
                        />
                    )}
                </div>
            </div>

            <SidePanel isOpen={panelType !== null} onClose={() => setPanelType(null)} title={panelType === "RULES" ? t("adminBooking.globalRules") : t("adminBooking.projectDesc")}>
                {panelType === "RULES" && <BookingRules locale={locale} />}
                {panelType === "DETAILS" && (
                    <ProjectDetails
                        locale={locale}
                        selectedRequest={selectedRequest}
                        onActionSuccess={fetchBookings}
                    />
                )}
            </SidePanel>
        </div>
    );
}