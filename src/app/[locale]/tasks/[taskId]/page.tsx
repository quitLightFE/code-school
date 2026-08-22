"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Editor, { Monaco } from "@monaco-editor/react";
import { Tabs, Button, Card, Chip } from "@heroui/react";
import { useTheme } from "next-themes";
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es";
import {
  Trash2,
  Send,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Link } from "#/i18n/navigation";
import { TaskService } from "#/services/tasks.service";
import { SubmissionService } from "#/services/submissions.service";
import { Submission } from "#/types/submissions";
import { Task } from "#/types/tasks";

type DisplayStatus = "not_started" | "submitted" | "checked" | "returned";

const EDITORS_CONFIG = [
  { id: "html", label: "HTML", language: "html" },
  { id: "css", label: "CSS", language: "css" },
  { id: "js", label: "JavaScript", language: "javascript" },
] as const;

const statusMeta: Record<
  DisplayStatus,
  {
    label: string;
    chipColor: "success" | "danger" | "warning" | "default";
    icon: typeof CheckCircle2;
  }
> = {
  not_started: { label: "Не начато", chipColor: "default", icon: Clock },
  submitted: {
    label: "Отправлено на проверку",
    chipColor: "warning",
    icon: Clock,
  },
  checked: { label: "Проверено", chipColor: "success", icon: CheckCircle2 },
  returned: { label: "Нужны правки", chipColor: "danger", icon: AlertCircle },
};

export default function TaskPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = Number(params.taskId);

  const [task, setTask] = useState<Task | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [preview, setPreview] = useState("");

  const [logs, setLogs] = useState<{ type: string; message: string }[]>([]);
  const [showLogs, setShowLogs] = useState(true);

  const { resolvedTheme } = useTheme();
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [taskData, submissionData] = await Promise.all([
          TaskService.get(taskId),
          SubmissionService.findByTask(taskId),
        ]);

        if (cancelled) return;

        setTask(taskData);
        setSubmission(submissionData);

        setHtml(submissionData?.html_code ?? taskData.html_starter);
        setCss(submissionData?.css_code ?? taskData.css_starter);
        setJs(submissionData?.js_code ?? taskData.js_starter);
      } catch {
        if (!cancelled) setLoadError("Не удалось загрузить задание");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  useEffect(() => {
    const handleConsoleMessage = (event: MessageEvent) => {
      if (event.data?.source !== "iframe-console") return;

      if (event.data.type === "clear") {
        setLogs([]);
        return;
      }

      setLogs((prev) => [
        ...prev,
        { type: event.data.type, message: event.data.message },
      ]);
    };

    window.addEventListener("message", handleConsoleMessage);
    return () => window.removeEventListener("message", handleConsoleMessage);
  }, []);

  const handleEditorWillMount = (monaco: Monaco) => {
    emmetHTML(monaco, ["html"]);
    emmetCSS(monaco, ["css"]);
    emmetJSX(monaco, ["javascript"]);

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
    const consoleInterceptor = `
<script>
(function () {
  const original = { log: console.log, warn: console.warn, error: console.error, info: console.info };
  const originalClear = console.clear;

  console.clear = () => {
    window.parent.postMessage({ source: "iframe-console", type: "clear" }, "*");
    originalClear();
  };

  function serialize(value) {
    try {
      if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
      return String(value);
    } catch {
      return String(value);
    }
  }

  function send(type, args) {
    window.parent.postMessage({ source: "iframe-console", type, message: args.map(serialize).join(" ") }, "*");
  }

  ["log", "warn", "error", "info"].forEach((type) => {
    console[type] = (...args) => {
      send(type, args);
      original[type](...args);
    };
  });

  window.onerror = function (message, source, line, column) {
    send("error", [message + " (" + line + ":" + column + ")"]);
  };

  window.addEventListener("unhandledrejection", (event) => {
    send("error", ["Unhandled Promise Rejection:", event.reason]);
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
    setLogs([]);
    setPreview(srcDoc);
    setShowPreviewMobile(true);
  }

  const handleSaveDraft = useCallback(async () => {
    if (!task) return;
    setIsSaving(true);
    try {
      const saved = await SubmissionService.saveDraft({
        task_id: task.id,
        html_code: html,
        css_code: css,
        js_code: js,
      });
      setSubmission(saved);
    } finally {
      setIsSaving(false);
    }
  }, [task, html, css, js]);

  const handleSubmitForReview = useCallback(async () => {
    if (!task) return;
    setIsSaving(true);
    try {
      const saved = await SubmissionService.submitForReview({
        task_id: task.id,
        html_code: html,
        css_code: css,
        js_code: js,
      });
      setSubmission(saved);
    } finally {
      setIsSaving(false);
    }
  }, [task, html, css, js]);

  const editorTheme =
    resolvedTheme === "light" ? "heroui-light" : "heroui-dark";

  const getEditorProps = (id: (typeof EDITORS_CONFIG)[number]["id"]) => {
    if (id === "html")
      return { value: html, onChange: (v: string) => setHtml(v) };
    if (id === "css") return { value: css, onChange: (v: string) => setCss(v) };
    return { value: js, onChange: (v: string) => setJs(v) };
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 pt-20">
        <p className="text-sm text-zinc-400">Загрузка задания...</p>
      </div>
    );
  }

  if (loadError || !task) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 pt-20">
        <p className="text-sm text-danger">
          {loadError ?? "Задание не найдено"}
        </p>
      </div>
    );
  }

  const currentStatus: DisplayStatus = submission?.status ?? "not_started";
  const meta = statusMeta[currentStatus];
  const StatusIcon = meta.icon;
  const isLocked = currentStatus === "checked";

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-zinc-950 sm:pt-30 pt-20">
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800 space-y-3">
        <Link
          href={`/courses/${task.group.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-default-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Назад к группе
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                {task.title}
              </h1>
              <Chip size="sm" color={meta.chipColor}>
                <StatusIcon className="size-3" />
                {meta.label}
              </Chip>
              {typeof submission?.score === "number" && (
                <Chip size="sm" variant="secondary">
                  Балл: {submission.score}
                </Chip>
              )}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
              {task.description}
            </p>
            {submission?.teacher_comment && (
              <p className="text-xs text-danger pt-1">
                Комментарий преподавателя: {submission.teacher_comment}
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0 flex-wrap">
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
            <Button
              variant="outline"
              onPress={handleSaveDraft}
              isDisabled={isSaving || isLocked}
            >
              <Save className="size-3.5" /> Сохранить
            </Button>
            <Button 
              onPress={handleSubmitForReview}
              isDisabled={isSaving || isLocked}
            >
              <Send className="size-3.5" />
              {isSaving ? "Отправка..." : "Отправить на проверку"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 sm:p-4 lg:grid-cols-2 min-h-0 overflow-hidden">
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
                      readOnly: isLocked,
                      wordWrap: "on"
                    }}
                  />
                </Tabs.Panel>
              );
            })}
          </Tabs>
        </Card>

        <div
          className={`flex flex-col gap-4 h-full min-h-0 ${showPreviewMobile ? "flex" : "hidden lg:flex"}`}
        >
          <Card className="flex-1 p-0 overflow-hidden">
            <iframe 
              title="preview"
              srcDoc={preview}
              sandbox="allow-scripts allow-modals"
              className="h-full w-full bg-white"
            />
          </Card>

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
