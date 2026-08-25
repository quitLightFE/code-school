import { Button, Chip } from "@heroui/react";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Send,
  FileEdit,
} from "lucide-react";
import { Link } from "#/i18n/navigation";
import { Task } from "#/types/tasks";
import { Submission } from "#/types/submissions";

export type DisplayStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "checked"
  | "returned";

const statusMeta: Record<
  DisplayStatus,
  {
    label: string;
    chipColor: "success" | "danger" | "warning" | "default" | "accent";
    icon: typeof CheckCircle2;
  }
> = {
  not_started: { label: "Не начато", chipColor: "default", icon: Clock },
  draft: { label: "Черновик", chipColor: "accent", icon: FileEdit },
  submitted: {
    label: "Отправлено на проверку",
    chipColor: "warning",
    icon: Clock,
  },
  checked: { label: "Проверено", chipColor: "success", icon: CheckCircle2 },
  returned: { label: "Нужны правки", chipColor: "danger", icon: AlertCircle },
};

type TaskHeaderProps = {
  task: Task;
  submission: Submission | null;
  status: DisplayStatus;
  isSaving: boolean;
  isLocked: boolean;
  showLogs: boolean;
  showPreviewMobile: boolean;
  onToggleLogs: () => void;
  onTogglePreview: () => void;
  onRun: () => void;
  onSave: () => void;
  onSubmit: () => void;
};

export function TaskHeader({
  task,
  submission,
  status,
  isSaving,
  isLocked,
  showLogs,
  showPreviewMobile,
  onToggleLogs,
  onTogglePreview,
  onRun,
  onSave,
  onSubmit,
}: TaskHeaderProps) {
  const meta = statusMeta[status];
  const StatusIcon = meta.icon;

  return (
    <div className="border-b border-zinc-200 p-4 dark:border-zinc-800 space-y-3">
      <Link
        href={`/courses/${task?.group?.id ?? ""}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-default-500 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Назад к группе
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              {task.title}
            </h1>
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            {task.description}
          </p>
          {submission?.teacher_comment && (
            <p className="text-xs text-danger pt-1">
              Комментарий преподавателя: {submission.teacher_comment}
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0 flex-wrap">
          <Button variant="outline" onPress={onToggleLogs}>
            {showLogs ? "Hide Logs" : "Show Logs"}
          </Button>
          <Button
            className="lg:hidden"
            variant="ghost"
            onPress={onTogglePreview}
          >
            {showPreviewMobile ? "Show Editor" : "Show Preview"}
          </Button>
          <Button onPress={onRun}>Run Code</Button>
          <Button
            variant="outline"
            onPress={onSave}
            isDisabled={isSaving || isLocked}
          >
            <Save className="size-3.5" /> Сохранить
          </Button>
          <Button onPress={onSubmit} isDisabled={isSaving || isLocked}>
            <Send className="size-3.5" />
            {isSaving ? "Отправка..." : "Отправить на проверку"}
          </Button>
        </div>
      </div>
    </div>
  );
}
