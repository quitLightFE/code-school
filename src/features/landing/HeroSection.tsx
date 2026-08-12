"use client";

// В HeroUI v3 компоненты импортируются напрямую из пакета @heroui/react
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "#/i18n/navigation";
import { ArrowRightIcon } from "#/features/landing/CTASection";

export default function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="pt-18 relative min-h-dvh w-full px-6 pb-10 md:px-12 md:py-32 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-112.5 bg-linear-to-b from-blue-500/20 via-violet-500/15 to-transparent blur-[100px]" />
      </div>
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* ЛЕВАЯ КОЛОНКА: Контент и Действия */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          <h1 className="text-4xl text-foreground sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            {t("titleLine1")} <br />
            <span className="bg-linear-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
              {t("titleLine2")}
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-md leading-relaxed pt-4">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            {/* Кнопка "Start Learning Free" */}
            <Link
              href="/register"
              className="button button--lg button--primary font-medium px-8 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            >
              {t("btnStart")} <ArrowRightIcon className="w-4 h-4" />
            </Link>

            {/* Кнопка "Browse Courses" */}
            <Link
              className="button button--outline border-slate-700 hover:border-slate-500 font-medium px-8 transition-all button--lg focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2"
              href="/courses"
            >
              {t("btnBrowse")}
            </Link>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Имитация редактора кода */}
        <div className="lg:col-span-6 lg:flex hidden justify-center shadow-2xl lg:justify-end bg-transparent">
          <div className="w-full rounded-2xl border border-indigo-500/40 bg-[#0d1527] p-6 shadow-2xl shadow-indigo-500/10 font-mono text-sm leading-relaxed text-slate-300">
            {/* Панель окна (Три точки управления) */}
            <div className="flex space-x-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="w-3 h-3 rounded-full bg-[#10b981]" />
            </div>

            {/* Поле самого кода (оставили без перевода, так как это синтаксис JS) */}
            <pre className="overflow-x-auto select-none">
              <code>
                <span className="text-pink-500">function</span>{" "}
                <span className="text-blue-400">learnToCode</span>() {"{"}
                {"\n"} <span className="text-pink-500">const</span> skills = [
                <span className="text-green-400">'HTML'</span>,{" "}
                <span className="text-green-400">'CSS'</span>,{" "}
                <span className="text-green-400">'JS'</span>];
                {"\n"} <span className="text-pink-500">return</span> skills.
                <span className="text-blue-400">map</span>(skill =&gt;{"\n"}
                <span className="text-green-400"> 'Mastered: '</span> + skill
                {"\n"} );
                {"\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
