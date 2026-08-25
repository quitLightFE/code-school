import { Button, Card } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { LogMessage } from "#/hooks/useConsole";

type ConsolePanelProps = {
  logs: LogMessage[];
  onClear: () => void;
};

export function ConsolePanel({ logs, onClear }: ConsolePanelProps) {
  return (
    <Card className="h-48 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col p-0 overflow-hidden shrink-0">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Console
        </span>
        <Button
          size="sm"
          variant="danger-soft"
          //   color="danger"
          isIconOnly
          onPress={onClear}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1">
        {logs.length === 0 ? (
          <span className="text-zinc-400 italic">No logs yet...</span>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`py-0.5 border-b border-zinc-100 dark:border-zinc-800/40 break-all ${
                log.type === "error"
                  ? "text-red-500 bg-red-500/5 px-1"
                  : log.type === "warn"
                    ? "text-yellow-500 bg-yellow-500/5 px-1"
                    : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <span className="opacity-40 mr-1.5">[{log.type}]</span>
              {log.message}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
