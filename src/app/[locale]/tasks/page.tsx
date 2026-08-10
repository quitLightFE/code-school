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
  Dropdown,
  Label,
} from "@heroui/react";

// 1. Типизация на основе схемы БД
type Group = {
  id: string;
  name: string;
  description: string;
  teacher: string;
};

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
  submissionsCount?: number;
};

// 2. Моковые данные
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
    submissionsCount: 12,
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
      name: "Елена Смирнова",
      avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    },
    group: { id: "g-2", name: "JS Advanced", description: "", teacher: "t-2" },
    submissionsCount: 5,
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
    submissionsCount: 24,
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

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12 5V19"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

// v3 не предоставляет `name`/инициалы для Avatar — генерируем сами
function getInitials(name: string) {
  return name.toUpperCase().slice(0, 2);
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = MOCK_TASKS.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="pt-26 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Задачи</h1>
          <p className="text-default-500 text-sm mt-1">
            Управление учебными заданиями и стартовыми шаблонами
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <TextField aria-label="Поиск задач" className="w-full sm:w-64">
            <InputGroup>
              <InputGroup.Prefix>
                <SearchIcon className="text-default-400" />
              </InputGroup.Prefix>
              <InputGroup.Input
                placeholder="Поиск задач..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </TextField>
          <Button variant="primary">
            <PlusIcon />
            Создать задачу
          </Button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className="border border-default-200 dark:border-default-100 hover:border-default-400 dark:hover:border-default-300 transition-colors bg-transparent"
          >
            <Card.Header className="flex justify-between items-start pt-5 px-5">
              <div className="flex flex-col gap-1 pr-4">
                <Chip size="sm" variant="soft" color="default" className="mb-2">
                  {task.group.name}
                </Chip>
                <Card.Title className="text-medium font-semibold leading-tight line-clamp-2">
                  {task.title}
                </Card.Title>
              </div>

              {/* Context Menu */}
              <Dropdown>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  aria-label="Действия с задачей"
                  className="text-default-400 -mt-2 -mr-2"
                >
                  <MoreVerticalIcon />
                </Button>
                <Dropdown.Popover placement="bottom end">
                  <Dropdown.Menu aria-label="Действия с задачей">
                    <Dropdown.Item id="edit" textValue="Редактировать">
                      <Label>Редактировать</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="submissions"
                      textValue="Решения учеников"
                    >
                      <Label>Решения учеников</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="delete"
                      textValue="Удалить"
                      variant="danger"
                    >
                      <Label>Удалить</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
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
              <div className="flex items-center gap-2">
                <Avatar size="sm" className="w-6 h-6">
                  <Avatar.Image
                    src={task.teacher.avatar}
                    alt={task.teacher.name}
                  />
                  <Avatar.Fallback>
                    {getInitials(task.teacher.name)}
                  </Avatar.Fallback>
                </Avatar>
                <span className="text-xs text-default-500 font-medium">
                  {task.teacher.name}
                </span>
              </div>
              <Button size="sm" variant="tertiary">
                Решения ({task.submissionsCount || 0})
              </Button>
            </Card.Footer>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-default-400">
            Задачи не найдены
          </div>
        )}
      </div>
    </div>
  );
}
