"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import { useTranslate } from "@/hooks/useTranslate";
// import { Mail, CheckSquare, PlaneTakeoff } from "lucide-react";

import { getMessagesStats } from "@/actions/messages";

interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
  weekMessages: number;
}

export default function StatsGrid() {
  const { t } = useTranslate();

  const [messageStats, setMessageStats] =
    useState<MessageStats>({
      totalMessages: 0,
      unreadMessages: 0,
      todayMessages: 0,
      weekMessages: 0,
    });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const res = await getMessagesStats();

      if (res.success && res.data) {
        setMessageStats(res.data);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-8"
    >
      {/* پیام‌ها */}
      <StatCard
        title={t("admin.dashboard.stats.messages.title")}
        value={
          loading
            ? "..."
            : messageStats.totalMessages
        }
        subtext={
          loading
            ? "درحال دریافت اطلاعات..."
            : `${messageStats.weekMessages} درخواست جدید در این هفته`
        }
        variant={
          messageStats.unreadMessages > 0
            ? "blue"
            : "emerald"
        }
        // icon={<Mail className="w-4 h-4" />}
      />

      {/* تسک‌ها */}
      <StatCard
        title={t("admin.dashboard.stats.tasks.title")}
        value="8"
        subtext={t(
          "admin.dashboard.stats.tasks.subtext"
        )}
        variant="blue"
        // icon={<CheckSquare className="w-4 h-4" />}
      />

      {/* جاب‌ها */}
      <StatCard
        title={t(
          "admin.dashboard.stats.jobHunt.title"
        )}
        value="3"
        subtext={t(
          "admin.dashboard.stats.jobHunt.subtext"
        )}
        variant="purple"
        // icon={<PlaneTakeoff className="w-4 h-4" />}
      />
    </motion.div>
  );
}