"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";

import { buildSrcDoc } from "#/utils/buildPreview";
import { useConsole } from "#/hooks/useConsole";
import { useTaskData } from "#/hooks/useTaskData";

import { TaskHeader, DisplayStatus } from "#/features/tasks/TaskHeader";
import { EditorPanel } from "#/features/tasks/EditorPanel";
import { PreviewFrame } from "#/features/tasks/PreviewFrame";
import { ConsolePanel } from "#/features/tasks/ConsolePanel";

export default function TaskPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = Number(params.taskId);

  // 1. Хуки
  const { logs, setLogs, showLogs, setShowLogs } = useConsole();
  const {
    task,
    submission,
    isLoading,
    loadError,
    isSaving,
    code,
    setCode,
    saveDraft,
    submitReview,
  } = useTaskData(taskId);

  // 2. Локальный стейт UI страницы
  const [preview, setPreview] = useState("");
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // 3. Вычисляемые данные

  // const currentStatus: DisplayStatus =
  //   submission?.status === "draft"
  //     ? "not_started"
  //     : (submission?.status ?? "not_started");
  const currentStatus: DisplayStatus = submission?.status ?? "not_started";

  const isLocked = currentStatus === "checked";
  const srcDoc = useMemo(
    () => buildSrcDoc(code.html, code.css, code.js),
    [code],
  );

  // 4. Хендлеры
  const runPreview = () => {
    setLogs([]);
    setPreview(srcDoc);
    setShowPreviewMobile(true);
  };

  const handleCodeChange = (type: "html" | "css" | "js", val: string) => {
    setCode((prev) => ({ ...prev, [type]: val }));
  };

  // --- РЕНДЕР ---
  if (isLoading || loadError || !task) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 pt-20">
        <p
          className={
            loadError ? "text-sm text-danger" : "text-sm text-zinc-400"
          }
        >
          {isLoading
            ? "Загрузка задания..."
            : (loadError ?? "Задание не найдено")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-zinc-950 sm:pt-25 pt-15">
      <TaskHeader
        task={task}
        submission={submission}
        status={currentStatus}
        isSaving={isSaving}
        isLocked={isLocked}
        showLogs={showLogs}
        showPreviewMobile={showPreviewMobile}
        onToggleLogs={() => setShowLogs(!showLogs)}
        onTogglePreview={() => setShowPreviewMobile(!showPreviewMobile)}
        onRun={runPreview}
        onSave={() => saveDraft(code)}
        onSubmit={() => submitReview(code)}
      />

      <div className="grid flex-1 gap-4 sm:p-4 lg:grid-cols-2 min-h-0">
        <EditorPanel
          code={code}
          onChange={handleCodeChange}
          isLocked={isLocked}
          isHiddenOnMobile={showPreviewMobile}
        />

        <div
          className={`flex flex-col gap-4 h-full min-h-0 ${
            showPreviewMobile ? "flex" : "hidden lg:flex"
          }`}
        >
          <PreviewFrame srcDoc={preview} />
          {showLogs && <ConsolePanel logs={logs} onClear={() => setLogs([])} />}
        </div>
      </div>
    </div>
  );
}
