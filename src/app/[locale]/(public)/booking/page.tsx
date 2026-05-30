// app/[locale]/booking/page.tsx
"use client";

import React, { useState, useEffect, use } from "react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { useTranslate } from "@/hooks/useTranslate";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";
import BookingForm from "@/components/booking/BookingForm";
import { submitBookingRequestAction } from "@/actions/booking"; // اضافه شدن اکشن ثبت اطلاعات

export default function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t } = useTranslate();
    const isRTL = locale === "fa";

    // استیت‌های اصلی
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [timezone, setTimezone] = useState<string>("");

    // استیت‌های هندل کردن فیدبک سرور
    const [apiMessage, setApiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    // هندل کردن تغییر تاریخ (پاک کردن ساعت قبلی و مسیج‌ها برای جلوگیری از باگ)
    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        setApiMessage(null);
    };

    // متصل شدن به بک‌اند واقعی Supabase
    const handleBookingSubmit = async (finalData: any) => {
        if (!selectedDate || !selectedTime) return;

        setApiMessage(null);
        
        // فرمت کردن تاریخ به فرمت ایزوله YYYY-MM-DD قبل از ارسال
        const formattedDate = selectedDate.toISOString().split("T")[0];

        const response = await submitBookingRequestAction({
            clientName: finalData.name,
            clientEmail: finalData.email,
            date: formattedDate,
            timeSlot: selectedTime,
            meetingType: finalData.meetingType === "online" ? "Online" : "In-Location",
            clientNote: finalData.description,
        });

        if (response.success) {
            setApiMessage({
                type: "success",
                text: isRTL 
                    ? "درخواست رزرو شما با موفقیت ثبت شد و در انتظار تأیید ادمین قرار گرفت." 
                    : "Your booking request has been submitted successfully and is awaiting admin approval."
            });
            // ریست کردن انتخاب‌ها پس از موفقیت
            setSelectedDate(null);
            setSelectedTime(null);
        } else {
            setApiMessage({
                type: "error",
                text: response.error || (isRTL ? "خطایی رخ داد." : "An error occurred.")
            });
        }
    };

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#07070a] py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* هدر صفحه و Timezone */}
                <div className="flex flex-col gap-2 text-center md:text-start">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {t("booking.title")}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t("booking.localTime")} {timezone || t("booking.detecting")} {t("booking.autoDetected")}
                        </span>
                    </div>
                </div>

                {/* نمایش پیام‌های موفقیت یا خطا کاملاً متناسب با تم زبرجدی/نئون */}
                {apiMessage && (
                    <div className={`p-4 rounded-xl text-sm font-medium border animate-fadeIn max-w-6xl w-full ${
                        apiMessage.type === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                        {apiMessage.text}
                    </div>
                )}

                {/* گرید اصلی صفحه */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ستون تقویم و ساعت‌ها */}
                    <div className="lg:col-span-5 flex flex-col gap-6 w-full items-center md:items-start">
                        <BookingCalendar
                            locale={locale}
                            selectedDate={selectedDate}
                            onDateChange={handleDateChange}
                        />

                        {selectedDate && (
                            <BookingTimeSlots
                                locale={locale}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                onTimeSelect={setSelectedTime}
                            />
                        )}
                    </div>

                    {/* ستون مقابل: فرم اطلاعات و ثبت نهایی */}
                    <div className="lg:col-span-7 w-full h-full min-h-[400px] bg-[#0d0d12]/60 backdrop-blur-3xl p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col">
                        <BookingForm
                            locale={locale}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onSubmitSuccess={handleBookingSubmit}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}