"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { Eye, EyeOff, GraduationCap, Lock, Mail, User } from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "#/hooks/useAuth";
import { useTranslations } from "next-intl";

// Импортируйте локализованный Link из настроек вашей навигации next-intl
// (например, из вашего файла конфигурации routing.ts)
import { Link } from "#/i18n/navigation";

export default function RegisterPage() {
  const t = useTranslations("RegisterPage");
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      return;
    }

    try {
      await register({
        name: form.username,
        email: form.email,
        password: form.password,
        role: "student",
      });

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="relative w-full max-w-md rounded-2xl border border-border/50 bg-surface p-6 shadow-xl sm:p-8">
      <div className="space-y-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
            <GraduationCap className="size-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>

          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField name="name" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">{t("fields.name")}</Label>

            <InputGroup variant="secondary" fullWidth>
              <InputGroup.Prefix>
                <User className="size-4 text-muted-foreground" />
              </InputGroup.Prefix>

              <InputGroup.Input
                value={form.username}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder={t("fields.namePlaceholder")}
              />
            </InputGroup>
          </TextField>

          <TextField
            name="email"
            type="email"
            isRequired
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium">{t("fields.email")}</Label>

            <InputGroup variant="secondary" fullWidth>
              <InputGroup.Prefix>
                <Mail className="size-4 text-muted-foreground" />
              </InputGroup.Prefix>

              <InputGroup.Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </TextField>

          <TextField
            name="password"
            isRequired
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium">
              {t("fields.password")}
            </Label>

            <InputGroup variant="secondary" fullWidth>
              <InputGroup.Prefix>
                <Lock className="size-4 text-muted-foreground" />
              </InputGroup.Prefix>

              <InputGroup.Input
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                type={isPasswordVisible ? "text" : "password"}
              />

              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  type="button"
                  aria-label={
                    isPasswordVisible
                      ? t("aria.hidePassword")
                      : t("aria.showPassword")
                  }
                  onPress={() => setIsPasswordVisible((value) => !value)}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          <TextField
            name="confirmPassword"
            isRequired
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium">
              {t("fields.confirmPassword")}
            </Label>

            <InputGroup variant="secondary" fullWidth>
              <InputGroup.Prefix>
                <Lock className="size-4 text-muted-foreground" />
              </InputGroup.Prefix>

              <InputGroup.Input
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                type={isConfirmPasswordVisible ? "text" : "password"}
              />

              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  type="button"
                  aria-label={
                    isConfirmPasswordVisible
                      ? t("aria.hideConfirmPassword")
                      : t("aria.showConfirmPassword")
                  }
                  onPress={() => setIsConfirmPasswordVisible((value) => !value)}
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          <Checkbox name="terms" value="accepted">
            <Checkbox.Content>
              <Checkbox.Control className="bg-slate-200 dark:bg-slate-600">
                <Checkbox.Indicator />
              </Checkbox.Control>
              {t("terms")}
            </Checkbox.Content>
          </Checkbox>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {t("submitBtn")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-bold link">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </Card>
  );
}
