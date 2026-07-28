"use client";

import React from "react";
import { useTranslations } from "next-intl";
// Note: Adjust imports based on your specific HeroUI v3 icon package or setup
import {
  Code2,
  Clock,
  Zap,
  BarChart3,
  GraduationCap,
  Users
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon,
  iconBgColor,
  title,
  description
}: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-start p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:bg-slate-50/50 dark:bg-[#0f172a]/40 dark:border-slate-800/60 dark:hover:border-slate-700/80 dark:hover:bg-[#0f172a]/60 dark:shadow-none">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBgColor} text-white mb-6`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default function LearningPlatformFeatures() {
  // Инициализируем переводы с пространством имен 'LearningPlatform'
  const t = useTranslations("LearningPlatform");

  // Массив конфигурации фич (иконки и стили остаются в коде, а тексты берутся из словаря по ключам)
  const featuresConfig = [
    {
      key: "editor",
      icon: <Code2 className="w-5 h-5" />,
      iconBgColor: "bg-blue-600 dark:bg-blue-500"
    },
    {
      key: "feedback",
      icon: <Clock className="w-5 h-5" />,
      iconBgColor: "bg-purple-600 dark:bg-purple-500"
    },
    {
      key: "speed",
      icon: <Zap className="w-5 h-5" />,
      iconBgColor: "bg-pink-600 dark:bg-pink-500"
    },
    {
      key: "tracking",
      icon: <BarChart3 className="w-5 h-5" />,
      iconBgColor: "bg-emerald-600 dark:bg-emerald-500"
    },
    {
      key: "expert",
      icon: <GraduationCap className="w-5 h-5" />,
      iconBgColor: "bg-indigo-600 dark:bg-indigo-500"
    },
    {
      key: "community",
      icon: <Users className="w-5 h-5" />,
      iconBgColor: "bg-sky-600 dark:bg-sky-500"
    }
  ];

  return (
    <section className="w-full bg-slate-50 text-slate-800 dark:bg-[#020617] dark:text-slate-200 flex flex-col items-center justify-center px-4 py-20 font-sans transition-colors duration-300">
      <div className="max-w-6xl w-full mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          {t("title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresConfig.map((feature) => (
          <FeatureCard
            key={feature.key}
            icon={feature.icon}
            iconBgColor={feature.iconBgColor}
            // Динамически получаем переводы по ключу фичи
            title={t(`features.${feature.key}.title`)}
            description={t(`features.${feature.key}.description`)}
          />
        ))}
      </div>
    </section>
  );
}
