"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  TextField,
  InputGroup,
  Chip,
  Separator,
  Avatar,
} from "@heroui/react";
import { Search, Check, AlertTriangle, Clock } from "lucide-react";

import { Link } from "#/i18n/navigation";
import { AuthService } from "#/services/auth.service";
import { TaskService } from "#/services/tasks.service";
import { SubmissionService } from "#/services/submissions.service";
import { User } from "#/types/auth";
import { Task } from "#/types/tasks";
import { Submission } from "#/types/submissions";

type DisplayStatus = "not_started" | "submitted" | "checked" | "returned";

const statusMeta: Record<
  DisplayStatus,
  {
    label: string;
    color: "success" | "danger" | "warning" | "default";
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  not_started: { label: "Не начато", color: "default", icon: Clock },
  submitted: { label: "На проверке", color: "warning", icon: Clock },
  checked: { label: "Проверено", color: "success", icon: Check },
  returned: { label: "Нужны правки", color: "danger", icon: AlertTriangle },
};

function getInitials(name: string) {
  return name.toUpperCase().slice(0, 2);
}

export default function TasksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        // const me = await AuthService.me();
        const { data: me } = await AuthService.me();
        if (cancelled) return;
        setUser(me);

        if (!me.group) {
          // студент без группы — заданий нет
          setTasks([]);
          setSubmissions([]);
          return;
        }

        const [tasksData, submissionsData] = await Promise.all([
          TaskService.listByGroup(me.group),
          SubmissionService.mine(),
        ]);
        if (cancelled) return;
        setTasks(tasksData);
        setSubmissions(submissionsData);
      } catch {
        if (!cancelled) setError("Не удалось загрузить задания");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-background text-foreground justify-center flex">
      <div className="max-w-7xl w-full">
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
                  <Search className="text-default-400 size-4" />
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

        {isLoading && (
          <div className="py-12 text-center text-default-400">Загрузка...</div>
        )}

        {!isLoading && error && (
          <div className="py-12 text-center text-danger">{error}</div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => {
              const mySubmission =
                submissions.find((s) => s.task.id === task.id) ?? null;
              const status: DisplayStatus =
                mySubmission?.status ?? "not_started";
              const meta = statusMeta[status];
              const StatusIcon = meta.icon;

              const actionLabel =
                status === "checked"
                  ? "Посмотреть решение"
                  : status === "returned"
                    ? "Исправить"
                    : status === "not_started"
                      ? "Начать"
                      : "Продолжить";

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

                    <div className="flex gap-2 flex-wrap">
                      {task.html_starter && (
                        <Chip size="sm" variant="soft" color="danger">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          HTML
                        </Chip>
                      )}
                      {task.css_starter && (
                        <Chip size="sm" variant="soft" color="accent">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          CSS
                        </Chip>
                      )}
                      {task.js_starter && (
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
                        <Avatar.Image src={undefined} alt={task.teacher.name} />
                        <Avatar.Fallback>
                          {getInitials(task.teacher.name)}
                        </Avatar.Fallback>
                      </Avatar>
                      <span className="text-xs text-default-500 font-medium truncate">
                        {task.teacher.name}
                      </span>
                    </div>
                    <Link
                      className={`button--sm button ${status === "checked" ? "button--tertiary" : "button--primary"} focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2`}
                      href={`/tasks/${task.id}`}
                    >
                      {actionLabel}
                      {typeof mySubmission?.score === "number" &&
                        ` · ${mySubmission.score}`}
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
        )}
      </div>
    </div>
  );
}
