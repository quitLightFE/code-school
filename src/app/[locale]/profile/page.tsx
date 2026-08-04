"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Tabs,
  Separator,
  TextField,
  Label,
  InputGroup,
} from "@heroui/react";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  PlusCircle,
  KeyRound,
  Save,
  Star,
} from "lucide-react";
import { useAuthContext } from "#/providers/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Имитация роли, если контекст пуст (для безопасного рендера)
  const isTeacher = user?.role === "teacher";
  const initials = user?.username?.substring(0, 2).toUpperCase() || "--";

  const handleProfileUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Имитация запроса к Django API
      console.log("Patching /api/v1/users/me/ with:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="container mx-auto max-w-4xl px-4 pt-28 pb-12">
        <Card className="p-8 text-center bg-content1/50 backdrop-blur-md border border-divider">
          <p className="text-default-500">
            Пользователь не найден или сессия истекла.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 pt-28 pb-12">
      {/* 1. Header шапка профиля (Glassmorphism card) */}
      <Card className="overflow-hidden border border-divider bg-content1/40 shadow-lg backdrop-blur-xl sm:p-2">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Аватар и базовая информация */}
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-24 text-2xl font-semibold shadow-sm border border-divider bg-content2">
                <Avatar.Fallback style={{ fontSize: 24 }}>
                  {initials}
                </Avatar.Fallback>
                {/* Если есть фото: <Avatar.Image src={user.avatarUrl} alt={user.username} /> */}
              </Avatar>

              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {user.username}
                  </h1>
                  <Chip
                    size="sm"
                    variant="tertiary"
                    color={isTeacher ? "default" : "accent"}
                    className="capitalize font-medium"
                  >
                    {isTeacher ? (
                      <GraduationCap className="size-3.5" />
                    ) : (
                      <BookOpen className="size-3.5" />
                    )}
                    {isTeacher ? "Teacher" : "Student"}
                  </Chip>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-default-500">
                  {user.email}
                </p>
                <p className="mt-1 text-xs text-default-400">
                  Django ID: #{user.id || "123"}
                </p>
              </div>
            </div>

            {/* Быстрые действия */}
            {isTeacher && (
              <Button variant="primary" className="font-medium shadow-md">
                <PlusCircle className="size-4" />
                Create Course
              </Button>
            )}
          </div>
        </div>

        <Separator className="bg-divider" />

        {/* 2. Блок статистики в дизайне "разделенных колонок" */}
        <div className="grid grid-cols-1 divide-y divide-divider sm:grid-cols-3 sm:divide-y-0 sm:divide-x bg-default-50/20">
          {isTeacher ? (
            <>
              <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-default-100/30">
                <p className="text-sm font-medium text-default-500">
                  Created Courses
                </p>
                <p className="mt-1 text-3xl font-bold text-primary">12</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-default-100/30">
                <p className="text-sm font-medium text-default-500">
                  Total Students
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">1,480</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-default-100/30">
                <p className="text-sm font-medium text-default-500">
                  Average Rating
                </p>
                <p className="mt-1 flex items-center gap-1 text-3xl font-bold text-warning">
                  4.9 <Star className="size-6 fill-warning" />
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-default-100/30">
                <p className="text-sm font-medium text-default-500">
                  Active Courses
                </p>
                <p className="mt-1 text-3xl font-bold text-primary">4</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-default-100/30">
                <p className="text-sm font-medium text-default-500">
                  Completed Lessons
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">86</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-default-100/30">
                <p className="text-sm font-medium text-default-500">
                  Certificates
                </p>
                <p className="mt-1 flex items-center gap-1 text-3xl font-bold text-success">
                  2 <Star className="size-6 fill-success" />
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* 3. Табы с детальной информацией (HeroUI v3 Compound Components) */}
      <div className="mt-8 flex flex-col gap-4">
        <Tabs
          aria-label="Profile Options"
          variant="secondary"
          // className={{
          //   tabList:
          //     "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          //   cursor: "w-full bg-primary",
          //   tab: "max-w-fit px-0 h-12",
          //   tabContent: "group-data-[selected=true]:text-primary",
          // }}
        >
          <Tabs.ListContainer>
            <Tabs.List className="gap-6 w-full relative rounded-none p-0 border-b border-divider">
              <Tabs.Tab className="max-w-fit px-0 h-12" id="general">
                General Info
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="security" className="max-w-fit px-0 h-12">
                Security & Auth
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          {/* Вкладка 1: Основные данные */}
          <Tabs.Panel
            id="general"
            className="pt-4 group-data-[selected=true]:text-primary"
          >
            <Card className="border border-divider bg-content1/40 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Personal Information
                  </h3>
                  <p className="text-sm text-default-500 mt-1">
                    Update your account credentials and personal details.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField>
                    <InputGroup variant="primary">
                      <InputGroup.Prefix>
                        <UserIcon className="size-4 text-default-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        aria-label="Username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </InputGroup>
                    <Label className="font-medium">Username</Label>
                  </TextField>

                  <TextField>
                    <InputGroup variant="primary">
                      <InputGroup.Prefix>
                        <Mail className="size-4 text-default-400" />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        aria-label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </InputGroup>
                    <Label className="font-medium">Email Address</Label>
                  </TextField>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <TextField isDisabled>
                      <InputGroup variant="primary">
                        <InputGroup.Prefix>
                          <ShieldCheck className="size-4 text-default-400" />
                        </InputGroup.Prefix>
                        <InputGroup.Input
                          aria-label="Username"
                          placeholder="Enter your username"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                      <Label className="font-medium">Role</Label>
                    </TextField>

                    <p className="mt-2 text-xs text-default-400">
                      Role management is handled via Django Admin.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isPending={isSaving}
                    className="font-medium px-6 shadow-md"
                  >
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </Tabs.Panel>

          {/* Вкладка 2: Безопасность */}
          <Tabs.Panel id="security" className="pt-4">
            <Card className="border border-divider bg-content1/40 shadow-sm p-6 sm:p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Password & Authentication
                  </h3>
                  <p className="text-sm text-default-500 mt-1">
                    Manage your Django session security settings
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-divider p-5 bg-default-50/50">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-default-200/50">
                      <KeyRound className="size-5 text-default-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Change Password
                      </p>
                      <p className="text-sm text-default-500 mt-0.5">
                        Receive a secure reset link to your registered email
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" className="font-medium">
                    Reset Password
                  </Button>
                </div>
              </div>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </div>
    </main>
  );
}
