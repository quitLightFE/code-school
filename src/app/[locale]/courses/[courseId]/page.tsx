"use client";

import { useParams } from "next/navigation";
import { Card, Button, Chip, Avatar, ProgressBar, Label } from "@heroui/react";
import {
  ArrowLeft,
  ListChecks,
  Code2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Link } from "#/i18n/navigation";

// Моки, соответствующие реальной схеме backend

type Teacher = {
  _id: string;
  name: string;
  avatar?: string;
};

type Group = {
  _id: string;
  name: string;
  description: string;
  teacher: Teacher;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  group: string;
};

type Submission = {
  _id: string;
  task: string;
  student: string;
  status:
    | "not_started"
    | "submitted"
    | "in_review"
    | "needs_revision"
    | "accepted";
  score?: number;
  teacherComment?: string;
};

const currentUser = { _id: "u1" };

const mockGroups: Record<string, Group> = {
  g2: {
    _id: "g2",
    name: "React & Next.js Pro",
    description:
      "Продвинутая разработка на Next.js 15, SSR, оптимизация и развертывание. Практические проекты, код-ревью, поддержка ментора на каждом этапе обучения.",
    teacher: { _id: "t1", name: "Алишер Каримов" },
  },
};

const mockTasks: Task[] = [
  {
    _id: "task1",
    title: "Компонент списка задач",
    description: "Собрать переиспользуемый компонент TaskList с фильтрацией.",
    group: "g2",
  },
  {
    _id: "task2",
    title: "Оптимизация изображений next/image",
    description: "Настроить lazy-loading и responsive-изображения.",
    group: "g2",
  },
  {
    _id: "task3",
    title: "Настройка Middleware",
    description: "Реализовать проверку авторизации на уровне middleware.",
    group: "g2",
  },
  {
    _id: "task4",
    title: "Server Actions & формы",
    description: "Форма обратной связи на Server Actions без API-роута.",
    group: "g2",
  },
];

const mySubmissions: Submission[] = [
  { _id: "s1", task: "task1", student: "u1", status: "accepted", score: 95 },
  { _id: "s2", task: "task2", student: "u1", status: "accepted", score: 88 },
  {
    _id: "s3",
    task: "task3",
    student: "u1",
    status: "needs_revision",
    teacherComment: "Проверь обработку ошибок в middleware",
  },
  { _id: "s4", task: "task4", student: "u1", status: "not_started" },
];

const statusMeta: Record<
  Submission["status"],
  {
    label: string;
    color: string;
    chipColor: "success" | "danger" | "warning" | "default";
    icon: typeof CheckCircle2;
  }
> = {
  not_started: {
    label: "Не начато",
    color: "text-default-500",
    chipColor: "default",
    icon: Clock,
  },
  submitted: {
    label: "На проверке",
    color: "text-primary",
    chipColor: "default",
    icon: Clock,
  },
  in_review: {
    label: "Проверяется",
    color: "text-primary",
    chipColor: "default",
    icon: Clock,
  },
  needs_revision: {
    label: "Нужны правки",
    color: "text-danger",
    chipColor: "danger",
    icon: AlertCircle,
  },
  accepted: {
    label: "Принято",
    color: "text-success",
    chipColor: "success",
    icon: CheckCircle2,
  },
};

export default function CoursePage() {
  const params = useParams<{ courseId: string }>();
  const group = mockGroups[params.courseId];

  if (!group) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center py-20 space-y-3">
          <p className="text-default-400 text-base">Группа не найдена.</p>
          <Link
            // as={Link}
            href="/courses"
            // size="sm"

            // variant="secondary"
            className={`button--sm button--secondary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2 `}
          >
            <ArrowLeft className="size-3.5" /> Назад к группам
          </Link>
        </div>
      </main>
    );
  }

  const groupTasks = mockTasks.filter((t) => t.group === group._id);
  const submissionByTask = Object.fromEntries(
    mySubmissions.map((s) => [s.task, s]),
  );

  const acceptedCount = groupTasks.filter(
    (t) => submissionByTask[t._id]?.status === "accepted",
  ).length;
  const progressPercent = groupTasks.length
    ? Math.round((acceptedCount / groupTasks.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Навигация назад */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-default-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Назад к группам
        </Link>

        {/* Заголовок группы */}
        <section className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <Avatar.Image
                    src={group.teacher.avatar}
                    alt={group.teacher.name}
                  />
                  <Avatar.Fallback>
                    {group.teacher.name.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-medium text-default-500">
                  {group.teacher.name}
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

          {/* Прогресс по группе */}
          <Card className="border border-default-100 bg-default-50/30">
            <Card.Content className="p-4 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-default-400">
                  Принято заданий: {acceptedCount}/{groupTasks.length}
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

        {/* Список заданий группы */}
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
                const submission = submissionByTask[task._id];
                const meta = statusMeta[submission?.status ?? "not_started"];
                const StatusIcon = meta.icon;

                return (
                  <Card
                    key={task._id}
                    className="border border-default-100 hover:border-default-200 hover:shadow-md transition-all"
                  >
                    <Card.Content className="p-5 flex items-center justify-between gap-4 flex-wrap">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-foreground">
                            {task.title}
                          </h3>
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
                        <p className="text-sm text-default-500 line-clamp-2">
                          {task.description}
                        </p>
                        {submission?.teacherComment && (
                          <p className={`text-xs pt-1 ${meta.color}`}>
                            Комментарий преподавателя:{" "}
                            {submission.teacherComment}
                          </p>
                        )}
                      </div>

                      <Link
                        // as={Link}
                        href={`/tasks/${task._id}`}
                        // size="sm"
                        className={`button--sm button ${
                          submission?.status === "accepted"
                            ? "button--secondary"
                            : "button--primary"
                        } focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2 `}
                        // variant={
                        //   submission?.status === "accepted"
                        //     ? "secondary"
                        //     : "primary"
                        // }
                      >
                        {submission?.status === "accepted"
                          ? "Посмотреть решение"
                          : submission?.status === "needs_revision"
                            ? "Исправить"
                            : "Открыть задание"}
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
