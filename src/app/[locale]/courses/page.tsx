"use client";

import { useMemo, useState } from "react";
import { Link } from "#/i18n/navigation";
import {
  Card,
  InputGroup,
  Button,
  Select,
  Chip,
  ListBox,
  TextField,
  Separator,
  Key,
  Avatar,
} from "@heroui/react";
import {
  Search,
  SlidersHorizontal,
  Users,
  ListChecks,
  ChevronRight,
} from "lucide-react";

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
  group: string; // group._id
};

const mockTeachers: Teacher[] = [
  { _id: "t1", name: "Алишер Каримов" },
  { _id: "t2", name: "Дилноза Юсупова" },
];

const mockGroups: Group[] = [
  {
    _id: "g1",
    name: "Frontend: HTML/CSS/JS с нуля",
    description:
      "Группа для новичков. Верстка, семантика, основы JavaScript, первые интерактивные страницы.",
    teacher: mockTeachers[0],
  },
  {
    _id: "g2",
    name: "React & Next.js Pro",
    description:
      "Практическая группа по современной разработке SPA: компоненты, состояние, серверный рендеринг.",
    teacher: mockTeachers[0],
  },
  {
    _id: "g3",
    name: "JavaScript Advanced",
    description:
      "Углублённое изучение JS: асинхронность, замыкания, прототипы, работа с DOM без фреймворков.",
    teacher: mockTeachers[1],
  },
];

const mockTasks: Task[] = [
  { _id: "task1", title: "Верстка карточки товара", group: "g1" },
  { _id: "task2", title: "Форма обратной связи", group: "g1" },
  { _id: "task3", title: "Таб-переключатель на JS", group: "g1" },
  { _id: "task4", title: "Компонент списка задач", group: "g2" },
  { _id: "task5", title: "Работа с промисами", group: "g3" },
  { _id: "task6", title: "Дебаунс на practice", group: "g3" },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Key | null>("all");

  const teacherOptions = useMemo(
    () => [
      { key: "all", label: "Все преподаватели" },
      ...mockTeachers.map((t) => ({ key: t._id, label: t.name })),
    ],
    [],
  );

  const tasksCountByGroup = useMemo(() => {
    const map: Record<string, number> = {};
    mockTasks.forEach((task) => {
      map[task.group] = (map[task.group] ?? 0) + 1;
    });
    return map;
  }, []);

  const filteredGroups = mockGroups.filter((group) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query);
    const matchesTeacher =
      selectedTeacher === "all" || group.teacher._id === selectedTeacher;

    return matchesSearch && matchesTeacher;
  });

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Заголовок страницы */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Chip size="sm" className="border-none pl-0">
              Каталог групп
            </Chip>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Выберите свою группу
          </h1>
          <p className="max-w-2xl text-default-500 text-sm sm:text-base">
            Учебные группы с практическими заданиями, код-ревью и обратной
            связью от преподавателей.
          </p>
        </section>

        {/* Поиск и фильтр по преподавателю */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4 items-center">
          <div className="md:col-span-2">
            <TextField aria-label="Поиск по группам">
              <InputGroup>
                <InputGroup.Prefix>
                  <Search className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full rounded-full"
                  placeholder="Поиск по названию или описанию группы..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </TextField>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Select
              aria-label="Выбор преподавателя"
              selectedKey={selectedTeacher}
              onChange={(v) => setSelectedTeacher(v)}
              className="w-full"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {teacherOptions.map((option) => (
                    <ListBox.Item
                      key={option.key}
                      id={option.key}
                      textValue={option.label}
                    >
                      {option.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            <Button
              isIconOnly
              variant="ghost"
              className="md:hidden text-default-600"
              aria-label="Фильтры"
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </div>
        </section>

        {/* Сетка групп */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-default-400 text-base">
              Группы по вашему запросу не найдены.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedTeacher("all");
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card
                key={group._id}
                className="border border-default-100 hover:border-default-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <Card.Content className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="sm"
                      // name={group.teacher.name}
                      // src={group.teacher.avatar}
                    >
                      <Avatar.Image src={group.teacher.avatar} alt={group.teacher.name} />
                      <Avatar.Fallback >{group.teacher.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                    </Avatar>
                    <span className="text-xs font-medium text-default-500">
                      {group.teacher.name}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-1">
                      {group.name}
                    </h3>
                    <p className="text-sm text-default-500 line-clamp-3 pt-1">
                      {group.description}
                    </p>
                  </div>
                </Card.Content>

                <Card.Footer className="border-t border-default-100 bg-default-50/20 px-5 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-default-400 text-xs">
                    <div className="flex items-center gap-1">
                      <ListChecks className="size-3.5" />
                      <span>{tasksCountByGroup[group._id] ?? 0} заданий</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      <span>Группа</span>
                    </div>
                  </div>
                  <Link
                    className="font-semibold bg-primary-100/60 hover:bg-primary-500 hover:text-white button button--ghost button--sm"
                    href={`/courses/${group._id}`}
                  >
                    Подробнее <ChevronRight className="size-3.5" />
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
