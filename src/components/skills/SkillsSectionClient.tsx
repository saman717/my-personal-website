"use client";

import { motion } from "framer-motion";
import SkillCard from "./SkillCard";
import { skillsData } from "@/data/skillsData";

const iconKeys = ["frontend", "backend", "design", "other"];

interface SkillsSectionClientProps {
    labels: any; // دریافت دیکشنری ترجمه از سرور
    locale: string; // اضافه شد
}
// در بالای فایل، Interface را آپدیت کن:

export default function SkillsSectionClient({ locale, labels }: SkillsSectionClientProps) {
    const isRTL = locale === "fa"; // تشخیص راست‌چین بودن
    // یک تابع ساده برای استخراج کلیدها (مثلاً تبدیل skills.frontend به frontend)
    const getLabel = (titleKey: string) => {
        const key = titleKey.split(".")[1] || titleKey;
        return labels[key] || titleKey;
    };

    return (
        <section id="skills" className="relative py-20 bg-[#0d0d12] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 p-2"
                >
                    <h2
                        className="text-4xl py-2 sm:text-5xl font-bold relative group cursor-default select-none inline-block"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #ffffff, #ffffff)",
                            backgroundSize: "100% 100%",
                            backgroundPosition: "0% 50%",
                            color: "transparent",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            transition: "filter 0.3s ease",
                            filter: "none",
                        }}
                        onMouseMove={(e) => {
                            const { left, width } = e.currentTarget.getBoundingClientRect();
                            const x = ((e.clientX - left) / width) * 100;

                            e.currentTarget.style.backgroundImage =
                                "repeating-linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 4%, #80deea 8%, #4dd0e1 12%, #b2ebf2 16%, #e0f7fa 20%)";
                            e.currentTarget.style.backgroundSize = "250% 100%";
                            e.currentTarget.style.backgroundPosition = `${x}% 50%`;
                            e.currentTarget.style.filter =
                                "drop-shadow(0 0 20px rgba(224, 247, 250, 0.6))";
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundImage =
                                "repeating-linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 4%, #80deea 8%, #4dd0e1 12%, #b2ebf2 16%, #e0f7fa 20%)";
                            e.currentTarget.style.backgroundSize = "250% 100%";
                            e.currentTarget.style.backgroundPosition = "0% 50%";
                            e.currentTarget.style.filter =
                                "drop-shadow(0 0 20px rgba(224, 247, 250, 0.6))";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundImage =
                                "linear-gradient(90deg, #ffffff, #ffffff)";
                            e.currentTarget.style.backgroundSize = "100% 100%";
                            e.currentTarget.style.backgroundPosition = "0% 50%";
                            e.currentTarget.style.filter = "none";
                        }}
                    >
                        {labels.title}
                    </h2>
                </motion.div>

                <div className="grid md:px-0 grid-cols-1 sm:grid-cols-2 px-15 lg:grid-cols-4 gap-6">
                    {skillsData.map((category, index) => (
                        <SkillCard
                            key={index}
                            title={getLabel(category.titleKey)}
                            iconKey={iconKeys[index]}
                            skills={category.skills}
                            delay={index * 0.15}
                            // 🌟 تزریق دیتا به کارت‌ها
                            isRTL={isRTL}
                            progressLabels={labels.progress_level}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}