"use client";

import { useState } from "react";
import { Link } from "#/i18n/navigation";
import {
  Card,
  InputGroup,
  Button,
  Select,
  Chip,
  ListBox,
  Slider,
  TextField,
  CheckboxGroup,
  Checkbox,
  Separator,
  Key
} from "@heroui/react";
import {
  Search,
  SlidersHorizontal,
  Layers,
  Star,
  Clock,
  BookOpen,
  ChevronRight,
  Sparkles
} from "lucide-react";

// Mock-данные категорий и уровней
const categories = [
  { key: "all", label: "Все направления" },
  { key: "frontend", label: "Frontend Разработка" },
  { key: "backend", label: "Backend Разработка" },
  { key: "qa", label: "Тестирование (QA)" },
  { key: "design", label: "UI/UX Дизайн" }
];

const levels = [
  { value: "beginner", label: "Для новичков" },
  { value: "intermediate", label: "Middle уровень" },
  { value: "advanced", label: "Senior / Продвинутый" }
];

const mockCourses = [
  {
    id: "react-next",
    title: "React & Next.js Pro",
    description:
      "Полный цикл разработки современных веб-приложений. Архитектура Server Actions, SSR, Middleware и оптимизация производительности.",
    category: "frontend",
    categoryLabel: "Frontend",
    level: "intermediate",
    duration: "72 часа",
    lessonsCount: 48,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "ts-hardcore",
    title: "TypeScript. Продвинутый уровень",
    description:
      "Разберитесь в магии типов: Generics, Conditional & Mapped Types, Template Literal types и метапрограммирование в TS.",
    category: "frontend",
    categoryLabel: "Frontend",
    level: "advanced",
    duration: "36 часов",
    lessonsCount: 24,
    rating: 5.0,
    isPopular: false
  },
  {
    id: "node-architecture",
    title: "Node.js & NestJS: Чистая Архитектура",
    description:
      "Проектирование масштабируемых и отказоустойчивых API. Работа с PostgreSQL, Redis, Docker, gRPC и микросервисной архитектурой.",
    category: "backend",
    categoryLabel: "Backend",
    level: "advanced",
    duration: "90 часов",
    lessonsCount: 64,
    rating: 4.8,
    isPopular: true
  },
  {
    id: "html-css-start",
    title: "Старт во Frontend: HTML5, CSS3 & JavaScript",
    description:
      "Базовый курс для полного погружения в IT с нуля. Вёрстка, семантика, основы адаптивности, Flexbox, Grid и базовый JS.",
    category: "frontend",
    categoryLabel: "Frontend",
    level: "beginner",
    duration: "40 часов",
    lessonsCount: 32,
    rating: 4.7,
    isPopular: false
  }
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Key | null>("all");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Логика фильтрации
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(course.level);

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    // Точно так же pt-28 защищает от накладывания твоего фиксированного хэдера
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Заголовок страницы */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Chip
              //color="primary"
              //variant="dot"
              size="sm"
              className="border-none pl-0"
            >
              Каталог курсов
            </Chip>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Чему научимся сегодня?
          </h1>
          <p className="max-w-2xl text-default-500 text-sm sm:text-base">
            Актуальные программы обучения от практикующих инженеров. Проекты в
            портфолио, ревью кода и поддержка менторов.
          </p>
        </section>

        {/* Инструменты поиска и фильтрации для мобильных устройств (Быстрый выбор) */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4 items-center">
          <div className="md:col-span-2">
            <TextField>
              <InputGroup>
                <InputGroup.Prefix>
                  <Search className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full rounded-full"
                  placeholder="Поиск по названию или ключевым словам..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  // variant="bordered"
                />
              </InputGroup>
            </TextField>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Select
              aria-label="Выбор категории"
              //radius="full"
              //variant="bordered"
              selectedKeys={[selectedCategory]}
              //onChange={(e, k) => setSelectedCategory(k)}

              onChange={v => setSelectedCategory(v)}
              className="w-full"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categories.map(category => (
                    <ListBox.Item
                      key={category.key}
                      id={category.key}
                      textValue={category.label}
                    >
                      {category.label}
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

        {/* Главный лейаут: Сетка фильтров и Результатов */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Левая панель: Десктопные сайдбар-фильтры (Sticky) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-28 h-fit">
            <Card
              //shadow="sm"
              className="border border-default-100 p-4 bg-default-50/30"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Layers className="size-4 text-primary" /> Уровень сложности
                  </h3>
                  <CheckboxGroup
                    // aria-label="Фильтр по уровням"
                    value={selectedLevels}
                    onChange={setSelectedLevels}
                    // color="primary"
                    // size="sm"
                  >
                    {levels.map(level => (
                      <Checkbox key={level.value} value={level.value}>
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          {level.label}
                        </Checkbox.Content>
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>

                <Separator className="bg-default-100" />

                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="size-4 text-primary" /> Продолжительность
                  </h3>
                  <Slider
                    aria-label="Фильтр по часам"
                    // size="sm"
                    step={10}
                    maxValue={120}
                    minValue={10}
                    defaultValue={[20, 100]}
                    formatOptions={{ style: "unit", unit: "hour" }}
                    className="max-w-md"
                    // color="primary"
                  >
                    <Slider.Output />
                    <Slider.Track>
                      {({ state }) => (
                        <>
                          <Slider.Fill />
                          {state.values.map((_, i) => (
                            <Slider.Thumb key={i} index={i} />
                          ))}
                        </>
                      )}
                    </Slider.Track>
                  </Slider>
                </div>
              </div>
            </Card>
          </aside>

          {/* Правая панель: Сетка курсов */}
          <div className="lg:col-span-3">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-default-400 text-base">
                  Курсы по вашему запросу не найдены.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedLevels([]);
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map(course => (
                  <Card
                    key={course.id}
                    // shadow="sm"
                    className="border border-default-100 hover:border-default-200 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <Card.Content className="p-5 space-y-4">
                      {/* Лейблы и Рейтинг */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1.5 flex-wrap">
                          <Chip
                            size="sm"
                            // variant="flat"
                            // color="primary"
                            // radius="sm"
                          >
                            {course.categoryLabel}
                          </Chip>
                          {course.isPopular && (
                            <Chip
                              size="sm"
                              //variant="dot"
                              color="warning"
                              //radius="sm"
                              className="border-none bg-warning-50/50"
                            >
                              <Sparkles className="size-3" />
                              Хит
                            </Chip>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="size-3.5 fill-current" />
                          <span className="text-xs font-bold text-foreground">
                            {course.rating}
                          </span>
                        </div>
                      </div>

                      {/* Текстовый контент */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-default-400 font-medium">
                          {levels.find(l => l.value === course.level)?.label}
                        </p>
                        <p className="text-sm text-default-500 line-clamp-3 pt-1">
                          {course.description}
                        </p>
                      </div>
                    </Card.Content>

                    {/* Футер карточки с мета-информацией и действием */}
                    <Card.Footer className="border-t border-default-100 bg-default-50/20 px-5 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-default-400 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="size-3.5" />
                          <span>{course.lessonsCount} лекций</span>
                        </div>
                      </div>
                      <Link
                        className="font-semibold bg-primary-100/60 hover:bg-primary-500 hover:text-white button button--ghost button--sm"
                        href={`/courses/${course.id}`}
                      >
                        Подробнее <ChevronRight className="size-3.5" />
                      </Link>
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
