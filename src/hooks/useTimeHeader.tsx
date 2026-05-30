"use client";

import { useState, useEffect } from "react";

export function useTimeHeader(
  locale: string = "fa"
) {
  const [dateTime, setDateTime] =
    useState({
      time: "",
      date: "",
    });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const currentLocale =
        locale === "fa"
          ? "fa-IR"
          : "en-US";

      // ساعت
      const time =
        now.toLocaleTimeString(
          currentLocale,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      // تاریخ
      const date =
        now.toLocaleDateString(
          currentLocale,
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );

      setDateTime({
        time,
        date,
      });
    };

    updateDateTime();

    const interval =
      setInterval(
        updateDateTime,
        60000
      );

    return () =>
      clearInterval(interval);
  }, [locale]);

  return dateTime;
}

export function TimeDisplay({
  locale,
}: {
  locale: string;
}) {
  const { time, date } =
    useTimeHeader(locale);

  const isRTL = locale === "fa";

  return (
    <div
      dir={isRTL ?"ltr": "rtl"  }
      className={`
        flex gap-x-2
        ${isRTL ? "items-end" : "items-start"}
        leading-tight
      `}
    >
      <span className="text-[11px] text-gray-300 font-medium">
        {time}
      </span>

      <span className="text-[10px] text-gray-500 whitespace-nowrap">
        {date}
      </span>
    </div>
  );
}