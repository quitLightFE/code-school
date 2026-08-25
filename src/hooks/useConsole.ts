"use client"
import { useState, useEffect } from "react";

export type LogMessage = { type: string; message: string };

export function useConsole() {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showLogs, setShowLogs] = useState(true);

  useEffect(() => {
    const handleConsoleMessage = (event: MessageEvent) => {
      if (event.data?.source !== "iframe-console") return;

      if (event.data.type === "clear") {
        setLogs([]);
        return;
      }

      setLogs((prev) => [
        ...prev,
        { type: event.data.type, message: event.data.message },
      ]);
    };

    window.addEventListener("message", handleConsoleMessage);
    return () => window.removeEventListener("message", handleConsoleMessage);
  }, []);

  return { logs, setLogs, showLogs, setShowLogs };
}