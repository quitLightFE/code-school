"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button, Dropdown } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeDropdownProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onPress" | "children"
> {}

export default function ThemeDropdown({ ...props }: ThemeDropdownProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ждем монтирования на клиенте, чтобы избежать ошибок гидратации (SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectionChange = (keys: Selection) => {
    const selectedKey = Array.from(keys)[0] as string;
    if (selectedKey) {
      setTheme(selectedKey);
    }
  };

  // Иконка для самой кнопки (триггера)
  const getCurrentIcon = () => {
    if (!mounted)
      return (
        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-700/50" />
      ); // Дефолт до гидратации
    if (theme === "light") return <Sun className="w-4 h-4" />;
    if (theme === "dark") return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <Dropdown>
      <Button isIconOnly variant="ghost" {...props}>
        {getCurrentIcon()}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label="Выбор темы оформления"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([theme ?? "system"])}
          onSelectionChange={handleSelectionChange}
        >
          <Dropdown.Item
            key="light"
            id="light"
            className="stagger-item delay-40"
            textValue="light"
          >
            <Sun className="w-4 h-4" />
            Светлая
          </Dropdown.Item>
          <Dropdown.Item
            key="dark"
            id="dark"
            className="stagger-item delay-80"
            textValue="dark"
          >
            <Moon className="w-4 h-4" />
            Тёмная
          </Dropdown.Item>
          <Dropdown.Item
            key="system"
            id="system"
            textValue="system"
            className="stagger-item delay-120"
          >
            <Monitor className="w-4 h-4" />
            Системная
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
