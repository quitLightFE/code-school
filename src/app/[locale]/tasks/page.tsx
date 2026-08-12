"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  TextField,
  InputGroup,
  Chip,
  Separator,
  Avatar,
} from "@heroui/react";

import { Link } from "#/i18n/navigation";

// 1. Типизация на основе схемы БД

type Group = {
  id: string;
  name: string;
  description: string;
  teacher: string;
};

type SubmissionStatus =
  | "not_started"
  | "submitted"
  | "in_review"
  | "needs_revision"
  | "accepted";

type Task = {
  id: string;
  title: string;
  description: string;
  htmlStarter: string | null;
  cssStarter: string | null;
  jsStarter: string | null;
  teacher: {
    name: string;
    avatar?: string;
  };
  group: Group;
  // Решение ТЕКУЩЕГО ученика по этому заданию (submissions), а не чужие
  mySubmission: {
    status: SubmissionStatus;
    score?: number;
  } | null;
};

// 2. Моковые данные — только задания группы, в которой состоит ученик
const MOCK_TASKS: Task[] = [
  {
    id: "t-1",
    title: "Адаптивная карточка товара",
    description:
      "Сверстать карточку товара с использованием Grid и Flexbox. Добавить hover-эффекты.",
    htmlStarter: "<div>...</div>",
    cssStarter: ".card { ... }",
    jsStarter: null,
    teacher: {
      name: "Алексей Иванов",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    group: {
      id: "g-1",
      name: "Frontend Basics (Группа А)",
      description: "",
      teacher: "t-1",
    },
    mySubmission: { status: "accepted", score: 95 },
  },
  {
    id: "t-2",
    title: "Интерактивный To-Do List",
    description:
      "Реализовать добавление, удаление и отметку задач. Данные должны сохраняться в LocalStorage.",
    htmlStarter: "<div id='app'></div>",
    cssStarter: null,
    jsStarter: "const app = ...",
    teacher: {
      name: "Алексей Иванов",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    group: {
      id: "g-1",
      name: "Frontend Basics (Группа А)",
      description: "",
      teacher: "t-1",
    },
    mySubmission: { status: "needs_revision" },
  },
  {
    id: "t-3",
    title: "Лендинг портфолио",
    description:
      "Полноценный лендинг с плавной прокруткой, формой обратной связи и темной темой.",
    htmlStarter: "<header>...</header>",
    cssStarter: ":root { ... }",
    jsStarter: "document.querySelector...",
    teacher: {
      name: "Алексей Иванов",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    group: {
      id: "g-1",
      name: "Frontend Basics (Группа А)",
      description: "",
      teacher: "t-1",
    },
    mySubmission: null, // ещё не начато
  },
];

// 3. Иконки
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7V12L15 14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

function getInitials(name: string) {
  return name.toUpperCase().slice(0, 2);
}

const statusMeta: Record<
  SubmissionStatus,
  {
    label: string;
    color: "success" | "danger" | "warning" | "default";
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  not_started: { label: "Не начато", color: "default", icon: ClockIcon },
  submitted: { label: "На проверке", color: "warning", icon: ClockIcon },
  in_review: { label: "Проверяется", color: "warning", icon: ClockIcon },
  needs_revision: { label: "Нужны правки", color: "danger", icon: AlertIcon },
  accepted: { label: "Принято", color: "success", icon: CheckIcon },
};

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = MOCK_TASKS.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-background text-foreground justify-center flex">
      <div className="max-w-7xl">
        <div className="pt-26 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Мои задания</h1>
            <p className="text-default-500 text-sm mt-1">
              Задания твоей группы и статус их выполнения
            </p>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
            <TextField aria-label="Поиск задач" className="w-full sm:w-64">
              <InputGroup>
                <InputGroup.Prefix>
                  <SearchIcon className="text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="Поиск заданий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </TextField>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => {
            const status = task.mySubmission?.status ?? "not_started";
            const meta = statusMeta[status];
            const StatusIcon = meta.icon;

            return (
              <Card
                key={task.id}
                className="border border-default-200 dark:border-default-100 hover:border-default-400 dark:hover:border-default-300 transition-colors bg-transparent"
              >
                <Card.Header className="flex justify-between items-start pt-5 px-5">
                  <div className="flex flex-col gap-1 pr-4">
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <Chip size="sm" variant="soft" color="default">
                        {task.group.name}
                      </Chip>
                      <Chip size="sm" variant="soft" color={meta.color}>
                        <StatusIcon className="size-3" />
                        {meta.label}
                      </Chip>
                    </div>
                    <Card.Title className="text-medium font-semibold leading-tight line-clamp-2">
                      {task.title}
                    </Card.Title>
                  </div>
                </Card.Header>

                <Card.Content className="px-5 py-2">
                  <p className="text-sm text-default-500 line-clamp-3 mb-4">
                    {task.description}
                  </p>

                  {/* Стартовые файлы (Теги) */}
                  <div className="flex gap-2 flex-wrap">
                    {task.htmlStarter && (
                      <Chip size="sm" variant="soft" color="danger">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        HTML
                      </Chip>
                    )}
                    {task.cssStarter && (
                      <Chip size="sm" variant="soft" color="accent">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        CSS
                      </Chip>
                    )}
                    {task.jsStarter && (
                      <Chip size="sm" variant="soft" color="warning">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        JS
                      </Chip>
                    )}
                  </div>
                </Card.Content>

                <Separator className="my-2 opacity-50" />

                <Card.Footer className="px-5 pb-5 pt-2 flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar size="sm" className="w-6 h-6 shrink-0">
                      <Avatar.Image
                        src={task.teacher.avatar}
                        alt={task.teacher.name}
                      />
                      <Avatar.Fallback>
                        {getInitials(task.teacher.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <span className="text-xs text-default-500 font-medium truncate">
                      {task.teacher.name}
                    </span>
                  </div>
                  <Link
                    // size="sm"
                    // variant={status === "accepted" ? "tertiary" : "primary"}
                    // as={Link}
                    className={`button--sm button ${status === "accepted" ? "button--tertiary" : "button--primary"} focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2`}
                    href={`/tasks/${task.id}`}
                  >
                    {status === "accepted"
                      ? "Посмотреть решение"
                      : status === "needs_revision"
                        ? "Исправить"
                        : status === "not_started"
                          ? "Начать"
                          : "Продолжить"}
                    {typeof task.mySubmission?.score === "number" &&
                      ` · ${task.mySubmission.score}`}
                  </Link>
                </Card.Footer>
              </Card>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="col-span-full py-12 text-center text-default-400">
              Задания не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
