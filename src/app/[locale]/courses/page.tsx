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
  Key,
} from "@heroui/react";
import { Search, SlidersHorizontal, Users, ChevronRight } from "lucide-react";

import { CourseService } from "#/services/courses.service";
import { useApiQuery } from "#/hooks/useApiQuery";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Key | null>("all");

  const {
    data: groups,
    isLoading,
    error,
  } = useApiQuery(() => CourseService.list(), []);

  const teacherOptions = useMemo(() => {
    if (!groups) return [{ key: "all", label: "Все преподаватели" }];
    const uniqueTeachers = new Map(
      groups.map((g) => [g.teacher.id, g.teacher.name]),
    );
    return [
      { key: "all", label: "Все преподаватели" },
      ...Array.from(uniqueTeachers, ([id, name]) => ({ key: id, label: name })),
    ];
  }, [groups]);

  const filteredGroups = (groups ?? []).filter((group) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query);
    const matchesTeacher =
      selectedTeacher === "all" || group.teacher.id === selectedTeacher;

    return matchesSearch && matchesTeacher;
  });

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-2">
          <Chip size="sm" className="border-none pl-0">
            Каталог групп
          </Chip>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Выберите свою группу
          </h1>
        </section>

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

        {/* Состояния загрузки/ошибки/пусто */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border border-default-100 h-40 animate-pulse bg-default-50"
              >
                {""}
              </Card>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-12 space-y-3">
            <p className="text-danger text-sm">{error}</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Повторить
            </Button>
          </div>
        )}

        {!isLoading && !error && filteredGroups.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-default-400 text-base">
              Группы по вашему запросу не найдены.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="border border-default-100 hover:border-default-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <Card.Content className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-default-500">
                    <Users className="size-3.5" />
                    {group.teacher.name}
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
                <Card.Footer className="border-t border-default-100 bg-default-50/20 px-5 py-3 flex justify-end">
                  <Link
                    className="font-semibold bg-primary-100/60 hover:bg-primary-500 hover:text-white button button--ghost button--sm"
                    href={`/courses/${group.id}`}
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
