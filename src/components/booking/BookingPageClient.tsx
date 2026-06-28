"use client";

import React, { useState, useEffect } from "react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";
import BookingForm from "@/components/booking/BookingForm";
import { submitBookingRequestAction } from "@/actions/booking";

interface BookingPageClientProps {
    locale: string;
    labels: any; 
}

export default function BookingPageClient({ locale, labels }: BookingPageClientProps) {
    const isRTL = locale === "fa";

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [timezone, setTimezone] = useState<string>("");
    const [apiMessage, setApiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        setApiMessage(null);
    };

    const handleBookingSubmit = async (finalData: any) => {
        if (!selectedDate || !selectedTime) return;
        setApiMessage(null);
        
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

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
                text: labels.successMessage 
            });
            setSelectedDate(null);
            setSelectedTime(null);
        } else {
            setApiMessage({
                type: "error",
                text: response.error || labels.errorMessage 
            });
        }
    };

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#07070a] py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                
                <div className="flex flex-col gap-2 text-center md:text-start">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {labels.title}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {labels.localTime} {timezone || labels.detecting} {labels.autoDetected}
                        </span>
                    </div>
                </div>

                {apiMessage && (
                    <div className={`p-4 rounded-xl text-sm font-medium border animate-fadeIn max-w-6xl w-full ${
                        apiMessage.type === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                        {apiMessage.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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