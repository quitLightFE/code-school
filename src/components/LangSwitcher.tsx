"use client";

import { Dropdown, Button, Label, Selection } from "@heroui/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "#/i18n/navigation";
import Image from "next/image";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // В onSelectionChange приходит специальный Set-объект
  const handleSelectionChange = (keys: Selection) => {
    const selectedKey = Array.from(keys).join("");
    if (selectedKey) {
      router.replace(pathname, { locale: selectedKey });
    }
  };

  return (
    <Dropdown>
      {/* Кнопка ОБЯЗАТЕЛЬНО должна быть внутри Dropdown.Trigger */}
      {/*<Dropdown.Trigger>*/}
      <Button isIconOnly variant="ghost" className="font-bold">
        {locale.toUpperCase()}
      </Button>
      {/*</Dropdown.Trigger>*/}

      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label="Смена языка"
          selectedKeys={new Set([locale])} // Передаем как Set
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
        >
          <Dropdown.Section>
            <Dropdown.Item id="ru" textValue="Русский">
              <Dropdown.ItemIndicator />
              <Label style={{ display: "flex", gap: 4 }}>
                <Image
                  alt="ru"
                  src={"/twemoji--flag-russia.svg"}
                  width={16}
                  height={16}
                  loading="lazy"
                />
                Русский
              </Label>
            </Dropdown.Item>
            <Dropdown.Item id="uz" textValue="O'zbekcha">
              <Dropdown.ItemIndicator />
              <Label style={{ display: "flex", gap: 4 }}>
                <Image
                  alt="ru"
                  src={"/twemoji--flag-uzbekistan.svg"}
                  width={16}
                  height={16}
                  loading="lazy"
                />
                O'zbekcha
              </Label>
            </Dropdown.Item>
            <Dropdown.Item id="en" textValue="English">
              <Dropdown.ItemIndicator />
              <Label style={{ display: "flex", gap: 4 }}>
                <Image
                  alt="ru"
                  src={"/twemoji--flag-united-kingdom.svg"}
                  width={16}
                  height={16}
                  loading="lazy"
                />
                English
              </Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
