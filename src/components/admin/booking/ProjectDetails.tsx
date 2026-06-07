// components/admin/booking/ProjectDetails.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { BookingRequest } from "./BookingTable";
import { updateBookingStatusAction, updateAdminNotesAction } from "@/actions/admin-bookings";
import { useToast } from "@/context/ToastContext"; // هماهنگ با کانتکست پروژه شما

interface ProjectDetailsProps {
    locale: string;
    // انطباق تایپ فرانت با ستون دقیق دیتابیس شما
    selectedRequest: BookingRequest & { adminNote?: string | null } | null;
    onActionSuccess: () => void;
}

export default function ProjectDetails({ locale, selectedRequest, onActionSuccess }: ProjectDetailsProps) {
    const { showToast, updateToast, dismissToast } = useToast();
    const isRTL = locale === "fa";
    const [loading, setLoading] = useState<"ACCEPTED" | "REJECTED" | null>(null);
    const formToastIdRef = useRef<number | null>(null);

    // استیت کنترل کننده متن داخل جعبه ادمین
    const [adminNotes, setAdminNotes] = useState<string>("");
    const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

    // ✨ فیکس شد: بارگذاری فیلد اختصاصی ادمین (adminNote) به محض انتخاب یا تغییر ردیف جدول
    useEffect(() => {
        if (selectedRequest) {
            setAdminNotes(selectedRequest.adminNote || "");
        }
    }, [selectedRequest?.id]);

    if (!selectedRequest) return null;

    // تغییر وضعیت درخواست (ارسال مستقیم UUID به صورت رشته)
    const handleStatusUpdate = async (newStatus: "ACCEPTED" | "REJECTED") => {
        setLoading(newStatus);

        // ۱. ساخت توست لودینگ و ذخیره در رفرنس
        formToastIdRef.current = showToast(
            locale === "fa" ? "در حال به‌روزرسانی وضعیت..." : "Updating status...",
            "loading-orange"
        );

        try {
            const response = await updateBookingStatusAction(selectedRequest.id, newStatus);

            if (response.success) {
                // ۲. وضعیت موفقیت
                if (formToastIdRef.current) {
                    onActionSuccess(); // رفرش لیست کامپوننت پدر
                    updateToast(
                        formToastIdRef.current,
                        locale === "fa" ? "وضعیت با موفقیت به‌روزرسانی شد." : "Status updated successfully.",
                        "success"
                    );
                    formToastIdRef.current = null;
                }
            } else {
                // ۳. وضعیت خطای بیزینس لاجیک سرور
                if (formToastIdRef.current) {
                    updateToast(
                        formToastIdRef.current,
                        locale === "fa"
                            ? (response.error ?? "خطای ناشناخته در سرور")
                            : "Failed to update booking status.",
                        "error"
                    );
                    formToastIdRef.current = null;
                }
            }
        } catch (error) {
            // ۴. مهار کرش دیتابیس یا شبکه
            if (formToastIdRef.current) {
                updateToast(
                    formToastIdRef.current,
                    locale === "fa" ? "خطا در برقراری ارتباط با سرور دیتابیس" : "Network or database connection error.",
                    "error"
                );
                formToastIdRef.current = null;
            }
        } finally {
            // ۵. در هر صورت (چه موفقیت چه خطا) لودینگ دکمه حتماً باید متوقف شود
            setLoading(null);
        }
    };
    // ✨ فیکس شد: ارسال مستقیم رشته ایدی بدون متد Number و ذخیره قطعی در دیتابیس
    const handleSaveAdminNotes = async () => {
        setIsSavingNotes(true);

        // ۱. ایجاد توست لودینگ سفید و ذخیره در رفرنس
        formToastIdRef.current = showToast(
            locale === "fa" ? "در حال ذخیره یادداشت ادمین..." : "Saving admin notes...",
            "loading-orange"
        );

        try {
            const response = await updateAdminNotesAction(selectedRequest.id, adminNotes);

            if (response.success) {
                // ۲. حالت موفقیت: رفرش داتا و تبدیل توست به سبز
                if (formToastIdRef.current) {
                    onActionSuccess(); // رفرش لیست اصلی برای بروزرسانی استیت‌های کانتکست مادر
                    updateToast(
                        formToastIdRef.current,
                        locale === "fa" ? "یادداشت با موفقیت ذخیره شد." : "Notes saved successfully.",
                        "success"
                    );
                    formToastIdRef.current = null;
                }
            } else {
                // ۳. حالت خطا در لاجیک سرور: تبدیل توست به قرمز و استفاده از Nullish Coalescing برای امنیت تایپ
                if (formToastIdRef.current) {
                    updateToast(
                        formToastIdRef.current,
                        locale === "fa"
                            ? (response.error ?? "خطا در ذخیره یادداشت")
                            : "Failed to save notes.",
                        "error"
                    );
                    formToastIdRef.current = null;
                }
            }
        } catch (error) {
            // ۴. حالت کرش شبکه یا دیتابیس لوکال
            if (formToastIdRef.current) {
                updateToast(
                    formToastIdRef.current,
                    locale === "fa" ? "خطا در ارتباط با سرور دیتابیس" : "Network or database error.",
                    "error"
                );
                formToastIdRef.current = null;
            }
        } finally {
            // ۵. تضمین متوقف شدن لودینگ دکمه در هر شرایطی
            setIsSavingNotes(false);
        }
    };
    return (
        <div className="flex flex-col gap-6 text-sm overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {/* اطلاعات مشتری */}
            <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                    {isRTL ? "اطلاعات متقاضی" : "Client Info"}
                </span>
                <h3 className="text-base font-bold text-white">{selectedRequest.clientName}</h3>
                <span className="text-xs text-gray-400 font-mono">{selectedRequest.clientEmail}</span>
            </div>

            {/* جزئیات زمان ملاقات */}
            <div className="grid grid-cols-2 gap-4 bg-[#111118]/60 p-3.5 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-500">{isRTL ? "تاریخ و روز" : "Date & Day"}</span>
                    <span className="text-xs font-medium text-gray-200">
                        {selectedRequest.day} - {selectedRequest.date}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-500">{isRTL ? "ساعت ملاقات" : "Time Slot"}</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{selectedRequest.timeSlot}</span>
                </div>
            </div>

            {/* یادداشت و توضیحات اولیه کاربر */}
            <div className="flex flex-col gap-2">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                    {isRTL ? "یادداشت و توضیحات کاربر:" : "Client Note:"}
                </span>
                <div className="bg-[#0d0d12] p-4 rounded-xl border border-white/5 text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedRequest.clientNote || (isRTL ? "توضیحاتی ثبت نشده است." : "No notes provided.")}
                </div>
            </div>

            {/* بخش اختصاصی یادداشت داخلی ادمین */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    {isRTL ? "📝 یادداشت داخلی ادمین (مخصوص خودتان):" : "📝 Internal Admin Notes:"}
                </span>
                <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={isRTL ? "نکات لازم در مورد این پروژه یا مشتری را اینجا بنویسید..." : "Write internal details about this project..."}
                    className="w-full h-28 bg-[#0d0d12] border border-white/5 focus:border-emerald-500/30 rounded-xl p-3 text-xs text-gray-200 placeholder:text-gray-600 outline-none resize-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                />
                <button
                    disabled={isSavingNotes}
                    onClick={handleSaveAdminNotes}
                    className="w-fit self-end px-4 py-2 bg-emerald-500 text-[#07070a] disabled:bg-white/5 disabled:text-gray-500 font-bold text-xs rounded-xl transition-all hover:bg-emerald-400 active:scale-95 flex items-center gap-2"
                >
                    {isSavingNotes ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#07070a] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        isRTL ? "ذخیره تغییرات" : "Save Changes"
                    )}
                </button>
            </div>

            {/* وضعیت فعلی */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xs text-gray-500">
                    {isRTL ? "وضعیت فعلی درخواست:" : "Current Status:"}
                </span>

                <div className="flex items-center">
                    {/* ۱. وضعیت نهایی شده و قطعی (CONFIRMED) - مچ شده با استایل نئونی پالس‌دار جدول */}
                    {selectedRequest.status === "CONFIRMED" && (
                        <span className="px-3 py-1 flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase rounded-md bg-cyan-950/40 border border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)] select-none animate-fade-in">
                            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            {isRTL ? "تایید نهایی" : "Confirmed"}
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                            </span>
                        </span>
                    )}

                    {/* ۲. وضعیت پذیرش اولیه (ACCEPTED) */}
                    {selectedRequest.status === "ACCEPTED" && (
                        <span className="px-3 py-1 flex items-center gap-1 text-xs font-bold uppercase rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            {isRTL ? "پذیرفته شده" : "Accepted"}
                        </span>
                    )}

                    {/* ۳. وضعیت رد شده (REJECTED) */}
                    {selectedRequest.status === "REJECTED" && (
                        <span className="px-3 py-1 flex items-center gap-1 text-xs font-bold uppercase rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            {isRTL ? "رد شده" : "Rejected"}
                        </span>
                    )}

                    {/* ۴. وضعیت معلق (PENDING) */}
                    {selectedRequest.status === "PENDING" && (
                        <span className="px-3 py-1 flex items-center gap-1 text-xs font-bold uppercase rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse">
                            {isRTL ? "در انتظار بررسی" : "Pending"}
                        </span>
                    )}
                </div>
            </div>

            {/* دکمه‌های تایید و رد وضعیت */}
            {selectedRequest.status === "PENDING" && (
                <div className="grid grid-cols-2 gap-3 mt-2 pb-4">
                    <button
                        disabled={loading !== null}
                        onClick={() => handleStatusUpdate("ACCEPTED")}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 text-[#07070a] text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading === "ACCEPTED" ? (
                            <div className="w-4 h-4 border-2 border-[#07070a] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            isRTL ? "تایید رزرو" : "Accept"
                        )}
                    </button>

                    <button
                        disabled={loading !== null}
                        onClick={() => handleStatusUpdate("REJECTED")}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 disabled:bg-white/5 text-xs font-medium py-2.5 rounded-xl transition-all flex items-center justify-center"
                    >
                        {loading === "REJECTED" ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            isRTL ? "رد درخواست" : "Reject"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}