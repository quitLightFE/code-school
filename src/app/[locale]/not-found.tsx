// export default function NotFound() {
//   return <h1>Inner 404</h1>;
// }

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Code } from "@heroui/react";
import { Home, ArrowLeft, Terminal, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("NotFound");

  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Декоративный IT-фон (светящиеся сферы) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-secondary/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Иконка / Графика ошибки */}
        <div className="relative mb-6 p-4 rounded-2xl bg-content2 border border-content3 shadow-sm animate-bounce [animation-duration:3s]">
          <AlertTriangle className="w-12 h-12 text-warning" />
          <Terminal className="w-6 h-6 text-primary absolute -bottom-1 -right-1 bg-content1 rounded-md p-1 border border-content3" />
        </div>

        {/* Код ошибки в стиле консоли */}
        <Code
          // color="danger"
          // radius="sm"
          className="px-3 py-1 font-mono text-sm mb-4"
        >
          Error: 404_PAGE_NOT_FOUND
        </Code>

        {/* Заголовки */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground-600 bg-clip-text text-transparent">
          {t("title")}
        </h1>

        <p className="text-default-500 text-sm sm:text-base mb-8 max-w-sm">
          {t("description")}
        </p>

        {/* Блок с имитацией кода для IT-атмосферы */}
        <div className="w-full text-left font-mono text-xs bg-content2 border border-content3 p-4 rounded-xl mb-8 text-default-600 shadow-inner">
          <p className="text-success">// {t("debugMessage")}</p>
          <p>
            <span className="text-purple-500">const</span>{" "}
            <span className="text-blue-500">page</span> ={" "}
            <span className="text-amber-600">URL.getCurrent()</span>;
          </p>
          <p>
            <span className="text-purple-500">if</span> (!page){" "}
            <span className="text-purple-500">throw new</span>{" "}
            <span className="text-danger">CompassException</span>();
          </p>
        </div>

        {/* Кнопки управления */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <Button
            // variant="bordered"
            // startContent={}
            onPress={() => router.back()}
            className="font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("goBack")}
          </Button>

          <Button
            // color="primary"
            // startContent={}
            onPress={() => router.push("/")}
            className="font-medium shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            {t("goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
