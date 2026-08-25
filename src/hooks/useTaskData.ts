"use client"
import { useState, useEffect, useCallback } from "react";
import { TaskService } from "#/services/tasks.service";
import { SubmissionService } from "#/services/submissions.service";
import { Task } from "#/types/tasks";
import { Submission } from "#/types/submissions";

export function useTaskData(taskId: number) {
  const [task, setTask] = useState<Task | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [code, setCode] = useState({ html: "", css: "", js: "" });

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

        setCode({
          html: submissionData?.html_code ?? taskData.html_starter ?? "",
          css: submissionData?.css_code ?? taskData.css_starter ?? "",
          js: submissionData?.js_code ?? taskData.js_starter ?? "",
        });
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

  const saveDraft = useCallback(
    async (currentCode: typeof code) => {
      if (!task) return;
      setIsSaving(true);
      try {
        const saved = await SubmissionService.saveDraft({
          task_id: task.id,
          html_code: currentCode.html,
          css_code: currentCode.css,
          js_code: currentCode.js,
        });
        setSubmission(saved);
      } finally {
        setIsSaving(false);
      }
    },
    [task]
  );

  const submitReview = useCallback(
    async (currentCode: typeof code) => {
      if (!task) return;
      setIsSaving(true);
      try {
        const saved = await SubmissionService.submitForReview({
          task_id: task.id,
          html_code: currentCode.html,
          css_code: currentCode.css,
          js_code: currentCode.js,
        });
        setSubmission(saved);
      } finally {
        setIsSaving(false);
      }
    },
    [task]
  );

  return {
    task,
    submission,
    isLoading,
    loadError,
    isSaving,
    code,
    setCode,
    saveDraft,
    submitReview,
  };
}