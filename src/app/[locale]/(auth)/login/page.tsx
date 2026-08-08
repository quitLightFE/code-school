"use client";

import { useState } from "react";
import { Button, Card, InputGroup, Label, TextField } from "@heroui/react";
import { Eye, EyeOff, GraduationCap, Lock, User } from "lucide-react";

import NextLink from "next/link";
import { useTranslations } from "next-intl";

import { useAuth } from "#/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login({
        email,
        password,
      });

      router.replace("/dashboard");
    } catch (error: any) {
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
          <TextField
            name="username"
            type="text"
            isRequired
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium">{t("usernameLabel")}</Label>

            <InputGroup variant="secondary" fullWidth>
              <InputGroup.Prefix>
                <User className="size-4 text-muted-foreground" />
              </InputGroup.Prefix>

              <InputGroup.Input
                type="text"
                placeholder={t("usernamePlaceholder")}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </TextField>

          <TextField
            name="password"
            isRequired
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium">{t("passwordLabel")}</Label>

            <InputGroup variant="secondary" fullWidth>
              <InputGroup.Prefix>
                <Lock className="size-4 text-muted-foreground" />
              </InputGroup.Prefix>

              <InputGroup.Input
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  type="button"
                  aria-label={
                    isPasswordVisible ? t("hidePassword") : t("showPassword")
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

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {t("submit")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t("dontHaveAccount")}{" "}
          <NextLink href="/register" className="link font-bold">
            {t("registerLink")}
          </NextLink>
        </p>
      </div>
    </Card>
  );
}
