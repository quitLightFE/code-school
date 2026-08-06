"use client";

import {
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  AlertDialog,
  Button,
  Card,
  Label,
  ListBox,
  Select,
  Separator,
  Switch,
  Tabs,
  type Key,
} from "@heroui/react";
import {
  Bell,
  Globe,
  MailWarning,
  Monitor,
  Moon,
  Palette,
  ShieldAlert,
  Smartphone,
  Sun,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "#/i18n/navigation";
import { useAuthContext } from "#/providers/AuthProvider";

type ThemeName = "light" | "dark" | "system";

type ThemeOption = {
  theme: ThemeName;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const themeOptions: ThemeOption[] = [
  { theme: "light", label: "Light", Icon: Sun },
  { theme: "dark", label: "Dark", Icon: Moon },
  { theme: "system", label: "System", Icon: Monitor },
];

export default function SettingsPage() {
  const { user, logout } = useAuthContext();
  const { setTheme, theme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [language, setLanguage] = useState(locale);
  const [notifyCourseUpdates, setNotifyCourseUpdates] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLanguageChange = (value: Key | null) => {
    if (!value) return;

    const nextLocale = value as typeof locale;
    setLanguage(nextLocale);
    router.replace(pathname, { locale: nextLocale });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Call the account-deletion endpoint here before ending the session.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsDeleteOpen(false);
      logout();
    } catch (error) {
      console.error("Failed to delete account", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <main className="container mx-auto max-w-4xl px-4 pb-12 pt-28">
        <Card className="border border-divider bg-content1/50 p-8 text-center backdrop-blur-md">
          <p className="text-default-500">
            Пользователь не найден или сессия истекла.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 pb-12 pt-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-2 text-default-500">
          Manage your application preferences and account settings.
        </p>
      </div>

      <Tabs
        defaultSelectedKey="appearance"
        variant="secondary"
        className="w-full"
      >
        <Tabs.ListContainer className="mb-6 w-full border-b border-divider">
          <Tabs.List aria-label="Settings sections" className="flex gap-6">
            <Tabs.Tab
              id="appearance"
              className="relative text-default-500 aria-selected:text-primary"
            >
              <Palette className="size-4" />
              Appearance
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab
              id="notifications"
              className="relative text-default-500 aria-selected:text-primary"
            >
              <Bell className="size-4" />
              Notifications
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab
              id="danger"
              className="relative text-danger aria-selected:text-danger"
            >
              <ShieldAlert className="size-4" />
              Danger Zone
              <Tabs.Indicator className="bg-danger" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="appearance">
          <Card className="border border-divider bg-content1/40 p-6 shadow-sm backdrop-blur-xl sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              App Preferences
            </h2>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="flex items-center gap-2 text-base font-medium text-foreground">
                    <Globe className="size-4 text-default-500" /> Language
                  </p>
                  <p className="mt-1 text-sm text-default-500">
                    Select the interface language.
                  </p>
                </div>

                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  aria-label="Select language"
                >
                  <Select.Trigger className="flex w-full items-center justify-between rounded-xl border border-divider bg-transparent px-4 py-2 shadow-sm sm:w-48">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="en" textValue="English">
                        English
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="ru" textValue="Русский">
                        Русский
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="uz" textValue="O'zbek">
                        O&apos;zbek
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <Separator className="bg-divider" />

              <div>
                <p className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
                  <Palette className="size-4 text-default-500" /> Theme Mode
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {themeOptions.map(({ theme: optionTheme, label, Icon }) => {
                    const isActive = theme === optionTheme;
                    return (
                      <Button
                        key={optionTheme}
                        variant={isActive ? "primary" : "secondary"}
                        onPress={() => setTheme(optionTheme)}
                        className={`h-auto w-full flex-col gap-2 rounded-2xl border p-4 transition-colors ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-divider bg-default-50/50 text-default-600 hover:bg-default-100"
                        }`}
                      >
                        <Icon className="size-6" />
                        <span className="text-sm font-medium">{label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="notifications">
          <Card className="border border-divider bg-content1/40 p-6 shadow-sm backdrop-blur-xl sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              Email &amp; Push Notifications
            </h2>
            <div className="flex flex-col gap-6">
              <NotificationSwitch
                icon={<MailWarning className="size-4 text-default-500" />}
                title="Course Updates"
                description="Get notified when there are updates to your enrolled courses."
                isSelected={notifyCourseUpdates}
                onChange={setNotifyCourseUpdates}
              />
              <Separator className="bg-divider" />
              <NotificationSwitch
                icon={<Smartphone className="size-4 text-default-500" />}
                title="Direct Messages"
                description="Receive notifications when teachers or students message you."
                isSelected={notifyMessages}
                onChange={setNotifyMessages}
              />
              <Separator className="bg-divider" />
              <NotificationSwitch
                title="Marketing & Promos"
                description="Receive exclusive offers and news from Code School."
                isSelected={notifyMarketing}
                onChange={setNotifyMarketing}
              />
            </div>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="danger">
          <Card className="border border-danger/30 bg-danger-50/10 p-6 shadow-sm backdrop-blur-xl sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-danger">
                  Delete Account
                </h2>
                <p className="mt-1 text-sm text-default-600">
                  Permanently delete your account, active courses, and all data.
                  This action cannot be undone.
                </p>
              </div>
              <Button
                variant="danger-soft"
                className="shrink-0 gap-2 font-medium"
                onPress={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete Account
              </Button>
            </div>
          </Card>
        </Tabs.Panel>
      </Tabs>

      <AlertDialog>
        <AlertDialog.Backdrop
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        >
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-112.5">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>
                  Delete Account Permanently?
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-default-600">
                  Are you absolutely sure you want to delete your account
                  <strong className="text-foreground"> {user.email}</strong>?
                  All your data, progress, and course access will be permanently
                  removed from our servers.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="tertiary">
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onPress={handleDeleteAccount}
                  isPending={isDeleting}
                >
                  Yes, delete account
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </main>
  );
}

type NotificationSwitchProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
};

function NotificationSwitch({
  icon,
  title,
  description,
  isSelected,
  onChange,
}: NotificationSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-base font-medium text-foreground">
          {icon}
          {title}
        </p>
        <p className="text-sm text-default-500">{description}</p>
      </div>
      <Switch
        aria-label={title}
        isSelected={isSelected}
        onChange={onChange}
        className="shrink-0"
      >
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </div>
  );
}
