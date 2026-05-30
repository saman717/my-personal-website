// components/admin/booking/ProjectDetails.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BookingRequest } from "./BookingTable";
import { updateBookingStatusAction, updateAdminNotesAction } from "@/actions/admin-bookings"; 

interface ProjectDetailsProps {
    locale: string;
    // انطباق تایپ فرانت با ستون دقیق دیتابیس شما
    selectedRequest: BookingRequest & { adminNote?: string | null } | null; 
    onActionSuccess: () => void; 
}

export default function ProjectDetails({ locale, selectedRequest, onActionSuccess }: ProjectDetailsProps) {
    const isRTL = locale === "fa";
    const [loading, setLoading] = useState<"ACCEPTED" | "REJECTED" | null>(null);
    
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
        const response = await updateBookingStatusAction(selectedRequest.id, newStatus);
        if (response.success) {
            onActionSuccess(); 
        } else {
            alert(isRTL ? "خطایی در ثبت وضعیت رخ داد" : "Failed to update status");
        }
        setLoading(null);
    };

    // ✨ فیکس شد: ارسال مستقیم رشته ایدی بدون متد Number و ذخیره قطعی در دیتابیس
    const handleSaveAdminNotes = async () => {
        setIsSavingNotes(true);
        const response = await updateAdminNotesAction(selectedRequest.id, adminNotes);
        if (response.success) {
            onActionSuccess(); // رفرش لیست اصلی برای بروزرسانی استیت‌های کانتکست مادر
            alert(isRTL ? "یادداشت شما با موفقیت ذخیره شد" : "Notes saved successfully");
        } else {
            alert(isRTL ? "خطا در ذخیره یادداشت" : "Failed to save notes");
        }
        setIsSavingNotes(false);
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
                <span className="text-xs text-gray-500">{isRTL ? "وضعیت فعلی درخواست:" : "Current Status:"}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    selectedRequest.status === "ACCEPTED" || selectedRequest.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : selectedRequest.status === "REJECTED"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                    {selectedRequest.status}
                </span>
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