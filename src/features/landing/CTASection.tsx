// "use client";

// import { Button } from "@heroui/react";

// export default function CTASection() {
//   return (
//     <section className="bg-gradient-to-br from-blue-700 to-purple-700">
//       <div className="flex text-white flex-col space-y-2.5 items-center py-16">
//         <h2 className="text-2xl">Ready to start your coding journey?</h2>
//         <p className="">Join thousands of students learning to code with US</p>
//         <Button>Create free account →</Button>
//       </div>
//     </section>
//   );
// }

"use client";

import { Button } from "@heroui/react";
import { Link } from "#/i18n/navigation";

import { useTranslations } from "next-intl";

// Кастомная иконка стрелки для соответствия макету
export const ArrowRightIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    className={className}
    {...props}
  >
    <path
      d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export default function CodingJourneyCTA() {
  const t = useTranslations("CTASection");

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#3a68f6] via-[#854bf1] to-[#ca32eb] px-6 py-20 text-center text-white sm:py-28 md:px-12">
      <div className="z-10 flex max-w-4xl flex-col items-center gap-6">
        {/* Заголовок */}
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h2>

        {/* Подзаголовок */}
        <p className="max-w-2xl text-base opacity-90 sm:text-xl">
          {t("subtitle")}
        </p>

        {/* Интерактивная кнопка HeroUI v3 */}
        <Link
          href="/register"
          className="button button--primary button--lg mt-4 bg-white font-medium text-[#2563eb] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          {t("button")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
