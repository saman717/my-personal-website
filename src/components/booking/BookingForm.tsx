"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

// 🌟 اضافه شدن labels به پراپ‌ها
interface BookingFormProps {
  locale: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSubmitSuccess: (data: any) => Promise<void>; 
  labels: any; 
}

interface FormInputs {
  name: string;
  email: string;
  description: string;
}

export default function BookingForm({ locale, selectedDate, selectedTime, onSubmitSuccess, labels }: BookingFormProps) {
  const isRTL = locale === "fa";
  const [meetingType, setMeetingType] = useState<"online" | "inPerson">("online");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>();

  const onFormSubmit = async (values: FormInputs) => {
    const finalData = {
      ...values,
      meetingType,
      date: selectedDate,
      time: selectedTime,
    };
    await onSubmitSuccess(finalData); 
  };

  const getFormattedSummaryDate = () => {
    if (!selectedDate) return null;
    return new Intl.DateTimeFormat(isRTL ? "fa-IR" : "en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }).format(selectedDate);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-full justify-between gap-6">
      <div className="flex flex-col gap-5">
        
        {/* ۱. سوئیچ انتخاب نوع ملاقات */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {labels.meetingType}
          </label>
          <div className="grid grid-cols-2 p-1 bg-[#111118]/80 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setMeetingType("online")}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                ${meetingType === "online" 
                  ? "bg-emerald-500 text-[#07070a] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  : "text-gray-400 hover:text-white"
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {labels.online}
            </button>
            <button
              type="button"
              onClick={() => setMeetingType("inPerson")}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                ${meetingType === "inPerson" 
                  ? "bg-emerald-500 text-[#07070a] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  : "text-gray-400 hover:text-white"
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {labels.inPerson}
            </button>
          </div>
        </div>

        {/* ۲. فیلد نام */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">{labels.name}</label>
          <input
            type="text"
            disabled={!selectedTime}
            {...register("name", { 
              required: labels.nameRequired,
              minLength: { value: 3, message: labels.nameMinLength }
            })}
            className="w-full bg-[#16161f]/40 border border-white/5 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            placeholder={labels.namePlaceholder}
          />
          {errors.name && <span className="text-red-500 text-[11px] mt-0.5">{errors.name.message}</span>}
        </div>

        {/* ۳. فیلد ایمیل */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">{labels.email}</label>
          <input
            type="email"
            disabled={!selectedTime}
            dir="ltr"
            {...register("email", { 
              required: labels.emailRequired,
              pattern: { value: /^\S+@\S+$/i, message: labels.emailInvalid }
            })}
            className={`w-full bg-[#16161f]/40 border border-white/5 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={labels.emailPlaceholder}
          />
          {errors.email && <span className="text-red-500 text-[11px] mt-0.5">{errors.email.message}</span>}
        </div>

        {/* ۴. فیلد توضیحات پروژه */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">{labels.projectDesc}</label>
          <textarea
            rows={3}
            disabled={!selectedTime}
            {...register("description", {
              required: labels.descRequired,
              minLength: { value: 10, message: labels.descMinLength }
            })}
            className="w-full bg-[#16161f]/40 border border-white/5 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all resize-none disabled:opacity-40 disabled:cursor-not-allowed"
            placeholder={labels.descPlaceholder}
          />
          {errors.description && <span className="text-red-500 text-[11px] mt-0.5">{errors.description.message}</span>}
        </div>
      </div>

      {/* ۵. بخش خلاصه رزرو وقت */}
      <div className="mt-2 p-4 rounded-xl bg-[#111118]/60 border border-white/5 backdrop-blur-md flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-400 border-b border-white/5 pb-1.5 block uppercase tracking-wider">
          {labels.summary}
        </span>
        
        {selectedDate && selectedTime ? (
          <div className="grid grid-cols-1 gap-2 text-xs pt-0.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{labels.summaryDate}</span>
              <span className="text-white font-medium">{getFormattedSummaryDate()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{labels.summaryTime}</span>
              <span className="text-emerald-400 font-bold tracking-wide">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{labels.summaryType}</span>
              <span className="text-gray-300 font-medium">
                {meetingType === "online" ? labels.online : labels.inPerson}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-600 italic py-1">
            {labels.noDateTime}
          </span>
        )}
      </div>

      {/* ۶. دکمه ارسال فرم */}
      <button
        type="submit"
        disabled={!selectedTime || isSubmitting}
        className="w-full bg-emerald-500 text-[#07070a] font-bold py-3 rounded-xl text-sm transition-all duration-300 active:scale-[0.98]
          disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100
          hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-[#07070a] border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          labels.submitBtn
        )}
      </button>
    </form>
  );
}