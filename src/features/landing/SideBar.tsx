"use client";

import { useState } from "react";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { Button, Drawer, Avatar, AlertDialog } from "@heroui/react";

import { Link } from "#/i18n/navigation";
import { NavigationItems as navItems } from "#/features/NavigationItems";
import { useAuthContext } from "#/providers/AuthProvider";
import AlertLogOut from "#/components/Header/AlertLogout";
// import AlertLogOut from "#/components/Header/AlertLogOut";

export default function SideBar() {
  const { user, logout } = useAuthContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const initials = user?.username?.[0] || user?.email?.[0] || "?";

  // Закрывает Drawer при переходе по ссылкам
  const handleLinkClick = () => {
    setIsDrawerOpen(false);
  };

  // Закрывает Drawer и открывает диалог подтверждения выхода
  const handleLogoutClick = () => {
    setIsDrawerOpen(false);
    setIsLogoutOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    logout();
  };

  return (
    <>
      <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        {/* <Drawer.Trigger> */}
        <Button isIconOnly variant="ghost" className="hover:bg-default-100">
          <Menu className="size-5" />
        </Button>
        {/* </Drawer.Trigger> */}

        <Drawer.Backdrop variant="blur">
          <Drawer.Content placement="right" className="border-l border-divider">
            <Drawer.Dialog className="flex h-full flex-col">
              <Drawer.CloseTrigger />

              <Drawer.Header className="border-b border-divider pb-4">
                <Drawer.Heading className="text-xl font-semibold">
                  Navigation
                </Drawer.Heading>
              </Drawer.Header>

              <Drawer.Body className="flex flex-1 flex-col justify-between py-5">
                {/* Элементы навигации */}
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`
                        group flex items-center gap-3
                        rounded-2xl px-4 py-3
                        text-sm font-medium
                        transition-all duration-200
                        hover:bg-primary/10
                        hover:text-primary
                        active:scale-[0.98]
                      `}
                    >
                      {item.icon && (
                        <item.icon
                          className={`
                            size-5
                            text-default-500
                            transition-colors
                            group-hover:text-primary
                          `}
                        />
                      )}

                      {item.title}
                    </Link>
                  ))}
                </nav>

                {/* Нижний блок: Авторизация / Профиль */}
                <div className="mt-6 border-t border-divider pt-5">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      {/* Профиль пользователя */}
                      <div className="flex items-center gap-3 rounded-2xl bg-default-100/60 p-3">
                        <Avatar size="sm">
                          <Avatar.Fallback>{initials}</Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <p className="truncate text-sm font-medium leading-tight">
                            {user.username || "User"}
                          </p>
                          <p className="truncate text-xs text-default-500 leading-tight">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Ссылки профиля */}
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/profile"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-default-100"
                        >
                          <UserIcon className="size-4 text-default-500" />
                          Profile
                        </Link>
                      </div>

                      {/* Кнопка выхода с вызовом AlertDialog */}
                      <Button
                        variant="danger-soft"
                        className="w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium"
                        onPress={handleLogoutClick}
                      >
                        <LogOut className="size-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/login"
                        onClick={handleLinkClick}
                        className="button button--secondary w-full justify-center focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2"
                      >
                        Log in
                      </Link>

                      <Link
                        href="/register"
                        onClick={handleLinkClick}
                        className="button button--primary w-full justify-center focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      {/* Вынесенный AlertDialog для подтверждения выхода */}
      <AlertLogOut
        handleConfirmLogout={handleConfirmLogout}
        setIsLogoutOpen={setIsLogoutOpen}
        isLogoutOpen={isLogoutOpen}
      />
    </>
  );
}
