"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { ContactFormData } from "@/types/types";
import { sendContactMessage } from "@/actions/contact"; // 🚀 وارد کردن اکشن سرور
import { useToast } from "@/context/ToastContext";

interface ContactFormLabels {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  submit: string;
  submitting: string;
  placeholders: {
    fullName: string;
    phone: string;
    email: string;
    message: string;
  };
  errors: {
    fullName: string;
    phone: string;
    email: string;
    message: string;
  };
}

interface ContactFormProps {
  labels: ContactFormLabels;
  isRTL: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ labels, isRTL }) => {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset, // 💡 برای پاک کردن فرم بعد از ارسال موفق
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // صدا زدن مستقیم تابع سرور با تمام قابلیت‌های Type-Safe
      const result = await sendContactMessage({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        message: data.message,
        locale: isRTL ? "fa" : "en",
      });

      if (result.success) {
        showToast(
          isRTL ? "پیام شما با موفقیت ارسال شد!" : "Your message has been sent successfully!",
          "success"
        );
        reset(); // فرم بازنشانی می‌شود
      } else {
        showToast(
          isRTL ? "خطایی در ارسال پیام رخ داد." : "Something went wrong.",
          "error"
        );
      }
    } catch (error) {
      console.error("Submission Error:", error);
      showToast(isRTL ? "خطای غیرمنتظره رخ داد." : "Unexpected error.", "error");
    }
  };

  const inputContainerClasses =
    "w-full bg-[#202024]/40 backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] focus-within:border-purple-500/80 rounded-2xl transition-all duration-300 px-4 py-3 min-h-[42px] flex flex-col justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]";

  const inputClasses = `w-full bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm md:text-base selection:bg-purple-500/30 ${isRTL ? "text-right" : "text-left"
    }`;

  const labelAlignmentClasses = `block text-gray-300 text-sm font-medium select-none w-full ${isRTL ? "text-right pr-1" : "text-left pl-1"
    }`;

  const errorAlignmentClasses = `text-red-400 text-xs animate-pulse w-full mt-1 ${isRTL ? "text-right pr-1" : "text-left pl-1"
    }`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90%] max-w-100 space-y-3"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* نام و نام خانوادگی */}
      <div className="space-y-2">
        <label className={labelAlignmentClasses}>
          {labels.fullName} :
        </label>
        <div className={inputContainerClasses}>
          <input
            type="text"
            autoComplete="off"
            placeholder={labels.placeholders.fullName}
            {...register("fullName", { required: labels.errors.fullName })}
            className={inputClasses}
          />
        </div>
        {errors.fullName && (
          <p className={errorAlignmentClasses}>
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* شماره تماس */}
      <div className="space-y-2">
        <label className={labelAlignmentClasses}>
          {labels.phone} :
        </label>
        <div className={inputContainerClasses}>
          <input
            type="text"
            autoComplete="off"
            placeholder={labels.placeholders.phone}
            {...register("phone", {
              required: labels.errors.phone,
              pattern: { value: /^[0-9+]{11,14}$/, message: labels.errors.phone }
            })}
            className={`${inputClasses} tracking-wider`}
          />
        </div>
        {errors.phone && (
          <p className={errorAlignmentClasses}>
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* ایمیل */}
      <div className="space-y-2">
        <label className={labelAlignmentClasses}>
          {labels.email} :
        </label>
        <div className={inputContainerClasses}>
          <input
            type="email"
            autoComplete="off"
            placeholder={labels.placeholders.email}
            {...register("email", {
              required: labels.errors.email,
              pattern: { value: /^\S+@\S+$/i, message: labels.errors.email }
            })}
            className={inputClasses}
          />
        </div>
        {errors.email && (
          <p className={errorAlignmentClasses}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* پیام */}
      <div className="space-y-2">
        <label className={labelAlignmentClasses}>
          {labels.message} :
        </label>
        <div className={`${inputContainerClasses} py-3`}>
          <textarea
            rows={4}
            placeholder={labels.placeholders.message}
            {...register("message", { required: labels.errors.message })}
            className={`${inputClasses} resize-none leading-relaxed`}
          />
        </div>
        {errors.message && (
          <p className={errorAlignmentClasses}>
            {errors.message.message}
          </p>
        )}
      </div>

      {/* دکمه ارسال */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 bg-[#09090b] border border-white text-white/80 rounded-[11px] p-4 text-base md:text-lg font-semibold hover:bg-white/85 hover:text-black transition-all duration-300 cursor-pointer disabled:opacity-50 tracking-wide shadow-lg active:scale-[0.99]"
      >
        {isSubmitting ? labels.submitting : labels.submit}
      </button>
    </form>
  );
};