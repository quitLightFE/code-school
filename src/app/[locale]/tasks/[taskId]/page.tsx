"use client";

import { useMemo, useState, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Tabs, Button, Card } from "@heroui/react";
import { useTheme } from "next-themes";
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es";
import { Trash2 } from "lucide-react";

// Конфигурация вкладок для отрисовки в цикле
const EDITORS_CONFIG = [
  { id: "html", label: "HTML", language: "html" },
  { id: "css", label: "CSS", language: "css" },
  { id: "js", label: "JavaScript", language: "javascript" },
] as const;

export default function PlaygroundPage() {
  const [html, setHtml] = useState(
    `<h1>Hello World</h1>\n<p>Edit HTML here</p>`,
  );
  const [css, setCss] = useState(
    `body { font-family: sans-serif; padding: 20px; }\nh1 { color: dodgerblue; }`,
  );
  const [js, setJs] = useState(
    `console.log("Hello World");\nconsole.warn("This is a warning!");`,
  );
  const [preview, setPreview] = useState("");

  // Состояния для консоли логов
  const [logs, setLogs] = useState<{ type: string; message: string }[]>([]);
  const [showLogs, setShowLogs] = useState(true);

  const { resolvedTheme } = useTheme();
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // Перехват логов из iframe через postMessage
  useEffect(() => {
    const handleConsoleMessage = (event: MessageEvent) => {
      if (event.data?.source !== "iframe-console") return;

      if (event.data.type === "clear") {
        setLogs([]);
        return;
      }

      setLogs((prev) => [
        ...prev,
        {
          type: event.data.type,
          message: event.data.message,
        },
      ]);
    };

    window.addEventListener("message", handleConsoleMessage);
    return () => window.removeEventListener("message", handleConsoleMessage);
  }, []);

  //     window.addEventListener("message", handleConsoleMessage);
  //     return () => window.removeEventListener("message", handleConsoleMessage);
  //   }, []);

  // Инициализация Emmet и кастомных тем для Monaco
  const handleEditorWillMount = (monaco: Monaco) => {
    emmetHTML(monaco, ["html"]);
    emmetCSS(monaco, ["css"]);
    emmetJSX(monaco, ["javascript"]);

    // Настройка Тёмной Темы
    monaco.editor.defineTheme("heroui-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "71717a", fontStyle: "italic" },
        { token: "keyword", foreground: "f43f5e" },
        { token: "number", foreground: "22c55e" },
        { token: "string", foreground: "eab308" },
        { token: "type", foreground: "3b82f6" },
      ],
      colors: {
        "editor.background": "#09090b",
        "editor.foreground": "#fafafa",
        "editorLineNumber.foreground": "#3f3f46",
        "editorLineNumber.activeForeground": "#a1a1aa",
        "editor.lineHighlightBackground": "#18181b",
        "editorCursor.foreground": "#fafafa",
      },
    });

    // Настройка Светлой Темы
    monaco.editor.defineTheme("heroui-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "a1a1aa", fontStyle: "italic" },
        { token: "keyword", foreground: "e11d48" },
        { token: "number", foreground: "16a34a" },
        { token: "string", foreground: "ca8a04" },
        { token: "type", foreground: "2563eb" },
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#09090b",
        "editorLineNumber.foreground": "#a1a1aa",
        "editorLineNumber.activeForeground": "#71717a",
        "editor.lineHighlightBackground": "#f4f4f5",
        "editorCursor.foreground": "#09090b",
      },
    });
  };

  const srcDoc = useMemo(() => {
    // Скрипт-перехватчик стандартных выводов консоли и синтаксических ошибок рантайма
    const consoleInterceptor = `
<script>
(function () {
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  };

  const originalClear = console.clear;

console.clear = () => {
  window.parent.postMessage({
    source: "iframe-console",
    type: "clear",
  }, "*");

  originalClear();
};

  function serialize(value) {
    try {
      if (typeof value === "object" && value !== null) {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    } catch {
      return String(value);
    }
  }

  function send(type, args) {
    window.parent.postMessage({
      source: "iframe-console",
      type,
      message: args.map(serialize).join(" ")
    }, "*");
  }

  ["log", "warn", "error", "info"].forEach((type) => {
    console[type] = (...args) => {
      send(type, args);
      original[type](...args);
    };
  });

  window.onerror = function(message, source, line, column) {
    send("error", [
      message + " (" + line + ":" + column + ")"
    ]);
  };

  window.addEventListener("unhandledrejection", (event) => {
    send("error", [
      "Unhandled Promise Rejection:",
      event.reason
    ]);
  });
})();
</script>
`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${css}</style>
          ${consoleInterceptor}
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>`;
  }, [html, css, js]);

  function runPreview() {
    setLogs([]); // Очищаем старые логи перед запуском новой сессии
    setPreview(srcDoc);
    setShowPreviewMobile(true);
  }

  // Динамическое определение темы
  const editorTheme =
    resolvedTheme === "light" ? "heroui-light" : "heroui-dark";

  // Хелпер для связи ID редактора с соответствующим состоянием
  const getEditorProps = (id: (typeof EDITORS_CONFIG)[number]["id"]) => {
    if (id === "html")
      return { value: html, onChange: (v: string) => setHtml(v) };
    if (id === "css") return { value: css, onChange: (v: string) => setCss(v) };
    return { value: js, onChange: (v: string) => setJs(v) };
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-zinc-950 sm:pt-30 pt-20">
      {/* Шапка */}
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            HTML / CSS / JS Playground
          </h1>
          <div className="flex gap-2">
            {/* Кнопка скрытия/показа консоли */}
            <Button
              variant="outline"
              onPress={() => setShowLogs((prev) => !prev)}
            >
              {showLogs ? "Hide Logs" : "Show Logs"}
            </Button>

            <Button
              className="lg:hidden"
              variant="ghost"
              onPress={() => setShowPreviewMobile((prev) => !prev)}
            >
              {showPreviewMobile ? "Show Editor" : "Show Preview"}
            </Button>
            <Button onPress={runPreview}>Run Code</Button>
          </div>
        </div>
      </div>

      {/* Контентная зона */}
      <div className="grid flex-1 gap-4 sm:p-4 lg:grid-cols-2 min-h-0 overflow-hidden">
        {/* Панель редакторов */}
        <Card
          className={`p-0 overflow-hidden ${showPreviewMobile ? "hidden lg:block" : "block"}`}
        >
          <Tabs aria-label="Editors" className="w-full">
            <Tabs.List className="w-full border-b dark:border-zinc-800 rounded-none bg-transparent">
              {EDITORS_CONFIG.map(({ id, label }) => (
                <Tabs.Tab key={id} id={id}>
                  {label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {EDITORS_CONFIG.map(({ id, language }) => {
              const { value, onChange } = getEditorProps(id);
              return (
                <Tabs.Panel key={id} id={id} className="p-0">
                  <Editor
                    height="70vh"
                    defaultLanguage={language}
                    value={value}
                    onChange={(v) => onChange(v || "")}
                    beforeMount={handleEditorWillMount}
                    theme={editorTheme}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 15,
                      automaticLayout: true,
                    }}
                  />
                </Tabs.Panel>
              );
            })}
          </Tabs>
        </Card>

        {/* Правая колонка: Фрейм превью + Виртуальная консоль */}
        <div
          className={`flex flex-col gap-4 h-full min-h-0 ${showPreviewMobile ? "flex" : "hidden lg:flex"}`}
        >
          {/* Карточка превью */}
          <Card className="flex-1 p-0 overflow-hidden">
            <iframe
              title="preview"
              srcDoc={preview}
              sandbox="allow-scripts allow-modals"
              className="h-full w-full bg-white"
            />
          </Card>

          {/* Виртуальная консоль (скрывается/показывается по условию showLogs) */}
          {showLogs && (
            <Card className="h-48 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col p-0 overflow-hidden shrink-0">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Console
                </span>
                <Button
                  size="sm"
                  variant="danger-soft"
                  isIconOnly
                  onPress={() => setLogs([])}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1">
                {logs.length === 0 ? (
                  <span className="text-zinc-400 italic">No logs yet...</span>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`py-0.5 border-b border-zinc-100 dark:border-zinc-800/40 break-all ${
                        log.type === "error"
                          ? "text-red-500 bg-red-500/5 px-1"
                          : log.type === "warn"
                            ? "text-yellow-500 bg-yellow-500/5 px-1"
                            : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <span className="opacity-40 mr-1.5">[{log.type}]</span>
                      {log.message}
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
