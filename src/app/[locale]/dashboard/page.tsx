"use client";

import { Card, ProgressBar, Button, Chip, Label, Avatar } from "@heroui/react";
import {
  Play,
  BookOpen,
  CheckCircle2,
  ListChecks,
  ArrowRight,
  Code2,
  Star,
  AlertCircle,
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
  group: string;
};

type Submission = {
  _id: string;
  task: string; // task._id
  student: string; // user._id
  status:
    | "not_started"
    | "submitted"
    | "in_review"
    | "needs_revision"
    | "accepted";
  score?: number;
  teacherComment?: string;
};

const currentUser = { _id: "u1", name: "Программист" };

const myGroup: Group = {
  _id: "g2",
  name: "React & Next.js Pro",
  description:
    "Продвинутая разработка на Next.js 15, SSR, оптимизация и развертывание.",
  teacher: { _id: "t1", name: "Алишер Каримов" },
};

const groupTasks: Task[] = [
  { _id: "task1", title: "Компонент списка задач", group: "g2" },
  { _id: "task2", title: "Оптимизация изображений next/image", group: "g2" },
  { _id: "task3", title: "Настройка Middleware", group: "g2" },
  { _id: "task4", title: "Server Actions & формы", group: "g2" },
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
  { label: string; color: string; dot: string }
> = {
  not_started: {
    label: "Не начато",
    color: "text-default-500",
    dot: "bg-default-400",
  },
  submitted: {
    label: "На проверке",
    color: "text-primary",
    dot: "bg-primary",
  },
  in_review: {
    label: "Проверяется",
    color: "text-primary",
    dot: "bg-primary",
  },
  needs_revision: {
    label: "Нужны правки",
    color: "text-danger",
    dot: "bg-danger",
  },
  accepted: {
    label: "Принято",
    color: "text-success",
    dot: "bg-success",
  },
};

export default function DashboardPage() {
  const submissionByTask = Object.fromEntries(
    mySubmissions.map((s) => [s.task, s]),
  );

  const totalTasks = groupTasks.length;
  const acceptedCount = mySubmissions.filter(
    (s) => s.status === "accepted",
  ).length;
  const needsAttentionCount = mySubmissions.filter(
    (s) => s.status === "needs_revision",
  ).length;
  const scores = mySubmissions
    .map((s) => s.score)
    .filter((v): v is number => typeof v === "number");
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const progressPercent = totalTasks
    ? Math.round((acceptedCount / totalTasks) * 100)
    : 0;

  const nextTask = groupTasks.find(
    (t) => submissionByTask[t._id]?.status !== "accepted",
  );

  const studentStats = [
    {
      id: "completed",
      label: "Принято заданий",
      value: `${acceptedCount}/${totalTasks}`,
      icon: CheckCircle2,
      color: "text-success bg-success-50/50",
    },
    {
      id: "attention",
      label: "Нужны правки",
      value: `${needsAttentionCount}`,
      icon: AlertCircle,
      color: "text-danger bg-danger-50/50",
    },
    {
      id: "score",
      label: "Средний балл",
      value: avgScore !== null ? `${avgScore}` : "—",
      icon: Star,
      color: "text-warning bg-warning-50/50",
    },
  ];

  return (
    <main className="min-h-screen bg-background px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Приветствие и виджет последнего задания */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              С возвращением, {currentUser.name}! 👋
            </h1>
            <p className="mt-2 text-default-500">
              Твоя группа: <span className="font-medium">{myGroup.name}</span>.
              Продолжай выполнять задания!
            </p>
          </div>

          <Card className="border-none bg-linear-to-br from-primary-500/10 via-primary-500/5 to-transparent shadow-md">
            <Card.Content className="flex flex-row items-center justify-between p-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Следующее задание
                </span>
                <h4 className="font-bold text-foreground text-sm line-clamp-1">
                  {nextTask ? nextTask.title : "Все задания выполнены 🎉"}
                </h4>
                <p className="text-xs text-default-400 line-clamp-1">
                  {myGroup.name}
                </p>
              </div>
              {nextTask && (
                <Button
                  isIconOnly
                  className="shadow-lg shadow-primary/30 min-w-12 h-12"
                  // as={Link}
                  // href={`/tasks/${nextTask._id}`}
                >
                  <Play className="size-5 fill-current" />
                </Button>
              )}
            </Card.Content>
          </Card>
        </section>

        {/* Сетка статистики */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {studentStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.id}
                className="border border-default-100 dark:bg-default-50/50"
              >
                <Card.Content className="flex flex-row items-center p-4 gap-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-default-400">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </section>

        {/* Основной контент: Группа vs Статусы заданий */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Карточка группы (2/3 ширины) */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Моя группа
            </h2>

            <Card className="hover:border-default-300 border border-default-100 transition-all">
              <Card.Content className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <Avatar.Image
                          src={myGroup.teacher.avatar}
                          alt={myGroup.teacher.name}
                        />

                        <Avatar.Fallback>
                          {myGroup.teacher.name.slice(0, 2).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar>
                      <Chip size="sm">{myGroup.teacher.name}</Chip>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mt-1">
                      {myGroup.name}
                    </h3>
                    <p className="text-sm text-default-500 line-clamp-2">
                      {myGroup.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-default-100 text-default-600 hidden sm:block">
                    <Code2 className="size-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-default-400">
                      Принято заданий из {totalTasks}
                    </span>
                    <span className="text-primary font-bold">
                      {progressPercent}%
                    </span>
                  </div>
                  <ProgressBar className="max-w-full" value={progressPercent}>
                    <Label>{myGroup.name}</Label>
                    <ProgressBar.Output />
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>
              </Card.Content>
              <Card.Footer className="border-t border-default-100 bg-default-50/30 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <BookOpen className="size-4 text-default-400 shrink-0" />
                  <p className="text-xs text-default-400 truncate">
                    <span className="font-medium text-default-600">
                      Всего заданий:
                    </span>{" "}
                    {totalTasks}
                  </p>
                </div>
                <Link
                  className="font-medium button button--ghost button--sm"
                  href={`/courses/${myGroup._id}`}
                >
                  Все задания <ArrowRight className="size-3" />
                </Link>
              </Card.Footer>
            </Card>
          </section>

          {/* Статусы заданий (1/3 ширины) */}
          <section className="space-y-4">
            <div className="h-10 flex items-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <ListChecks className="size-5 text-primary" />
                Статус заданий
              </h2>
            </div>

            <Card className="border border-default-100">
              <Card.Content className="p-4 space-y-4">
                {groupTasks.map((task) => {
                  const submission = submissionByTask[task._id];
                  const meta = statusMeta[submission?.status ?? "not_started"];
                  return (
                    <Link
                      key={task._id}
                      href={`/tasks/${task._id}`}
                      className="flex items-start gap-3 p-2.5 rounded-xl transition-colors hover:bg-default-50"
                    >
                      <div className="mt-1">
                        <div className={`size-2.5 rounded-full ${meta.dot}`} />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between gap-2 text-xs text-default-400">
                          <span className="truncate">{myGroup.name}</span>
                          <span
                            className={`font-medium shrink-0 ${meta.color}`}
                          >
                            {meta.label}
                            {typeof submission?.score === "number" &&
                              ` · ${submission.score}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Card.Content>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
