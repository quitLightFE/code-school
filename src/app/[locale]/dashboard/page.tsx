"use client";

import {
  Card,
  ProgressBar,
  Button,
  //Avatar,
  Chip,
  Tabs,
  Label,
  //Tab
} from "@heroui/react";
import {
  Play,
  BookOpen,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Code2,
} from "lucide-react";

import { Link } from "#/i18n/navigation";

// Имитация данных (Mock data) для чистоты архитектуры
const studentStats = [
  {
    id: "streak",
    label: "Стрик дней",
    value: "7 дней",
    icon: Flame,
    color: "text-warning bg-warning-50/50",
  },
  {
    id: "hours",
    label: "Часов в коде",
    value: "42 ч.",
    icon: Clock,
    olor: "text-primary bg-primary-50/50",
  },
  {
    id: "completed",
    label: "Пройдено тем",
    value: "18/24",
    icon: CheckCircle2,
    color: "text-success bg-success-50/50",
  },
];

const activeCourses = [
  {
    id: "1",
    title: "React & Next.js Pro",
    description:
      "Продвинутая разработка на Next.js 15, SSR, оптимизация и развертывание.",
    progress: 68,
    lastLesson: "Оптимизация изображений с помощью next/image",
    category: "Frontend",
  },
  {
    id: "2",
    title: "TypeScript для JS разработчиков",
    description:
      "Типизация интерфейсов, Generics, Utility Types и интеграция в React.",
    progress: 34,
    lastLesson: "Generic Constraints & Conditional Types",
    category: "Языки",
  },
];

const upcomingDeadlines = [
  {
    id: "d1",
    title: "ДЗ: Настройка Middleware",
    course: "Next.js Pro",
    time: "Сегодня, 23:59",
    type: "critical",
  },
  {
    id: "d2",
    title: "Тест: Generics в TS",
    course: "TypeScript",
    time: "Завтра, 18:00",
    type: "warning",
  },
  {
    id: "d3",
    title: "Финальный проект",
    course: "Tailwind UI",
    time: "Через 4 дня",
    type: "default",
  },
];

export default function DashboardPage() {
  return (
    // Пэддинг сверху (pt-28) компенсирует фиксированный хэдер (fixed header)
    <main className="min-h-screen bg-background px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Приветствие и Трэкер последней активности */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              С возвращением, Программист! 👋
            </h1>
            <p className="mt-2 text-default-500">
              Твой прогресс за эту неделю вырос на 15%. Продолжай в том же духе!
            </p>
          </div>

          {/* Виджет быстрого фокуса (Last Action) */}
          <Card
            className="border-none bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-transparent shadow-md"
            // radius="lg"
          >
            <Card.Content className="flex flex-row items-center justify-between p-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Последний курс
                </span>
                <h4 className="font-bold text-foreground text-sm line-clamp-1">
                  React & Next.js Pro
                </h4>
                <p className="text-xs text-default-400 line-clamp-1">
                  Урок: next/image
                </p>
              </div>
              <Button
                isIconOnly
                // color="primary"
                // radius="full"
                className="shadow-lg shadow-primary/30 min-w-12 h-12"
                // as={Link}

                // href="/courses/1/lessons/current"
              >
                <Play className="size-5 fill-current" />
              </Button>
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
                // shadow="sm"
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

        {/* Основной контент: Курсы vs Дедлайны */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Секция курсов (Левая колонка, 2/3 ширины на десктопе) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Моё обучение
              </h2>
              <Tabs
                // variant="underlined"
                // color="primary"
                aria-label="Фильтр курсов"
              >
                <Tabs.ListContainer>
                  <Tabs.List>
                    <Tabs.Tab id="active">
                      Активные
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="all" className="whitespace-nowrap">
                      Все доступные
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeCourses.map((course) => (
                <Card
                  key={course.id}
                  //shadow="sm"
                  className="hover:border-default-300 border border-default-100 transition-all"
                >
                  <Card.Content className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            // variant="flat"
                            // color="secondary"
                            // radius="sm"
                          >
                            {course.category}
                          </Chip>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mt-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-default-500 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-default-100 text-default-600 hidden sm:block">
                        <Code2 className="size-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-default-400">
                          Прогресс обучения
                        </span>
                        <span className="text-primary font-bold">
                          {course.progress}%
                        </span>
                      </div>
                      {/*<Progress
                        value={course.progress}
                        color="primary"
                        size="sm"
                        radius="full"
                        className="max-w-full"
                      />*/}
                      <ProgressBar
                        //formatOptions={{ style: "currency", currency: "USD" }}
                        //maxValue={10000}
                        className="max-w-full"
                        value={course.progress}
                      >
                        <Label>{course.title}</Label>
                        <ProgressBar.Output />
                        <ProgressBar.Track>
                          <ProgressBar.Fill />
                        </ProgressBar.Track>
                      </ProgressBar>
                    </div>
                  </Card.Content>
                  <Card.Footer className="border-t border-default-100 bg-default-50/30 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BookOpen className="size-4 text-default-400 flex-shrink-0" />
                      <p className="text-xs text-default-400 truncate">
                        <span className="font-medium text-default-600">
                          Далее:
                        </span>{" "}
                        {course.lastLesson}
                      </p>
                    </div>
                    <Link
                      className="font-medium button button--ghost button--sm"
                      href={`/courses/${course.id}`}
                    >
                      Учиться <ArrowRight className="size-3" />
                    </Link>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          </section>

          {/* Правая колонка: Дедлайны & Ближайшие события (1/3 ширины) */}
          <section className="space-y-4">
            <div className="h-[40px] flex items-center">
              {" "}
              {/* Выравнивание по высоте заголовка табов слева */}
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Расписание и дедлайны
              </h2>
            </div>

            <Card
              // shadow="sm"
              className="border border-default-100"
            >
              <Card.Content className="p-4 space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl transition-colors hover:bg-default-50"
                  >
                    <div className="mt-1">
                      <div
                        className={`size-2.5 rounded-full ${
                          deadline.type === "critical"
                            ? "bg-danger"
                            : deadline.type === "warning"
                              ? "bg-warning"
                              : "bg-default-400"
                        }`}
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                        {deadline.title}
                      </h4>
                      <div className="flex items-center justify-between gap-2 text-xs text-default-400">
                        <span className="truncate">{deadline.course}</span>
                        <span
                          className={`font-medium flex-shrink-0 ${deadline.type === "critical" ? "text-danger" : ""}`}
                        >
                          {deadline.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Content>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
