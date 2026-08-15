"use client";

import { useParams } from "next/navigation";
import { Card, Button, Chip, Avatar, ProgressBar, Label } from "@heroui/react";
import {
  ArrowLeft,
  ListChecks,
  Code2,
  CheckCircle2,
  RotateCcw,
  Send,
} from "lucide-react";

import { Link } from "#/i18n/navigation";
import { useApiQuery } from "#/hooks/useApiQuery";
import { CourseService } from "#/services/courses.service";
import { TaskService } from "#/services/tasks.service";
import { SubmissionService } from "#/services/submissions.service";
import type { SubmissionStatus } from "#/types/submissions";

const statusMeta: Record<
  SubmissionStatus,
  {
    label: string;
    chipColor: "success" | "danger" | "warning" | "default";
    icon: typeof CheckCircle2;
  }
> = {
  submitted: { label: "На проверке", chipColor: "warning", icon: Send },
  checked: { label: "Проверено", chipColor: "success", icon: CheckCircle2 },
  returned: {
    label: "Возвращено на доработку",
    chipColor: "danger",
    icon: RotateCcw,
  },
};

export default function CoursePage() {
  const params = useParams<{ courseId: string }>();
  const groupId = params.courseId;

  const {
    data: group,
    isLoading: groupLoading,
    error: groupError,
  } = useApiQuery(() => CourseService.get(groupId), [groupId]);

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useApiQuery(() => TaskService.listByGroup(groupId), [groupId]);

  const { data: submissions } = useApiQuery(() => SubmissionService.mine(), []);

  const isLoading = groupLoading || tasksLoading;
  const error = groupError || tasksError;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-8 w-40 bg-default-100 rounded animate-pulse" />
          <div className="h-24 bg-default-100 rounded animate-pulse" />
          <div className="h-24 bg-default-100 rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !group) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center py-20 space-y-3">
          <p className="text-danger text-sm">{error ?? "Группа не найдена."}</p>
          {/* <Button as={Link} href="/courses" size="sm" variant="secondary">
            <ArrowLeft className="size-3.5" /> Назад к группам
          </Button> */}
          <Link
            href="/courses"
            className="button--sm button button--primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 inline-flex items-center gap-1.5 text-sm font-medium text-default-500 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Назад к группам
          </Link>
        </div>
      </main>
    );
  }

  const groupTasks = tasks ?? [];

  // Последняя (актуальная) submission студента по каждому task
  // const latestSubmissionByTask = new Map<
  //   number,
  //   (typeof submissions)[number]
  // >();
  // (submissions ?? []).forEach((s) => {
  //   const existing = latestSubmissionByTask.get(s.task);
  //   if (!existing || new Date(s.id) > new Date(existing.id)) {
  //     latestSubmissionByTask.set(s.task, s);
  //   }
  // });
  // стало
  const submissionByTask = new Map((submissions ?? []).map((s) => [s.task, s]));

  const checkedCount = groupTasks.filter(
    (t) => submissionByTask.get(t.id)?.status === "checked",
  ).length;
  const progressPercent = groupTasks.length
    ? Math.round((checkedCount / groupTasks.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-default-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Назад к группам
        </Link>

        <section className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <Avatar.Image
                    src={group.teacher?.avatar}
                    alt={group.teacher?.name}
                  />
                  <Avatar.Fallback>
                    {group.teacher?.name?.charAt(0)}
                  </Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-medium text-default-500">
                  {group.teacher?.name}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {group.name}
              </h1>
              <p className="max-w-2xl text-default-500 text-sm sm:text-base">
                {group.description}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-default-100 text-default-600">
              <Code2 className="size-6" />
            </div>
          </div>

          <Card className="border border-default-100 bg-default-50/30">
            <Card.Content className="p-4 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-default-400">
                  Проверено заданий: {checkedCount}/{groupTasks.length}
                </span>
                <span className="text-primary font-bold">
                  {progressPercent}%
                </span>
              </div>
              <ProgressBar className="max-w-full" value={progressPercent}>
                <Label>{group.name}</Label>
                <ProgressBar.Output />
                <ProgressBar.Track>
                  <ProgressBar.Fill />
                </ProgressBar.Track>
              </ProgressBar>
            </Card.Content>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ListChecks className="size-5 text-primary" />
            Задания
          </h2>

          {groupTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-default-400 text-base">
                В этой группе пока нет заданий.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groupTasks.map((task) => {
                const submission = submissionByTask.get(task.id);
                const meta = submission ? statusMeta[submission.status] : null;
                const StatusIcon = meta?.icon;

                return (
                  <Card
                    key={task.id}
                    className="border border-default-100 hover:border-default-200 hover:shadow-md transition-all"
                  >
                    <Card.Content className="p-5 flex items-center justify-between gap-4 flex-wrap">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-foreground">
                            {task.title}
                          </h3>
                          {meta ? (
                            <Chip size="sm" color={meta.chipColor}>
                              {StatusIcon && <StatusIcon className="size-3" />}
                              {meta.label}
                            </Chip>
                          ) : (
                            <Chip size="sm">Не начато</Chip>
                          )}
                          {typeof submission?.score === "number" && (
                            <Chip size="sm" variant="secondary">
                              Балл: {submission.score}
                            </Chip>
                          )}
                        </div>
                        <p className="text-sm text-default-500 line-clamp-2">
                          {task.description}
                        </p>
                        {submission?.teacher_comment && (
                          <p className="text-xs text-danger pt-1">
                            Комментарий преподавателя:{" "}
                            {submission.teacher_comment}
                          </p>
                        )}
                      </div>

                      {/* <Button as={Link} href={`/tasks/${task.id}`} size="sm">
                        {submission?.status === "checked"
                          ? "Посмотреть решение"
                          : submission?.status === "returned"
                            ? "Исправить"
                            : submission
                              ? "Продолжить"
                              : "Начать"}
                      </Button> */}
                      <Link
                        href={`/tasks/${task.id}`}
                        className="w-full sm:w-auto button--sm button button--primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {submission?.status === "checked"
                          ? "Посмотреть решение"
                          : submission?.status === "returned"
                            ? "Исправить"
                            : submission
                              ? "Продолжить"
                              : "Начать"}
                      </Link>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
