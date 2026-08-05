import {
  AlertDialog,
  Avatar,
  Button,
  Dropdown,
  Key,
  Label,
  PressEvent,
} from "@heroui/react";
import { useState } from "react";
import { User } from "#/types/auth";
import AlertLogOut from "#/components/Header/AlertLogout";
export function UserDropdown({
  user,
  initials,
  logout,
}: {
  user: User;
  initials: string | undefined;
  logout: () => void;
}) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleAction = (key: Key) => {
    if (key === "logout") {
      setIsLogoutOpen(true);
    }
  };

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    logout();
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Trigger className="rounded-full">
          <Avatar style={{ width: 34, height: 34 }}>
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>

        <Dropdown.Popover>
          {/* Информация о пользователе в шапке */}
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <Avatar.Fallback>{initials}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col gap-0">
                <p className="text-sm leading-5 font-medium">{user.username}</p>
                <p className="text-xs leading-none text-muted">{user.email}</p>
              </div>
            </div>
          </div>

          <Dropdown.Menu onAction={handleAction}>
            <Dropdown.Item
              id="dashboard"
              href="/dashboard"
              textValue="Dashboard"
            >
              <Label>Dashboard</Label>
            </Dropdown.Item>

            <Dropdown.Item id="profile" href="/profile" textValue="Profile">
              <Label>Profile</Label>
            </Dropdown.Item>

            <Dropdown.Item id="settings" href="/settings" textValue="Settings">
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Settings</Label>
                {/* <Gear className="size-3.5 text-muted" /> */}
              </div>
            </Dropdown.Item>

            <Dropdown.Item
              id="new-project"
              href="/teams/new"
              textValue="New project"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Create Team</Label>
                {/* <Persons className="size-3.5 text-muted" /> */}
              </div>
            </Dropdown.Item>

            <Dropdown.Item id="logout" textValue="Logout" variant="danger">
              <Label>Log out</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {/* Вынесенный AlertDialog для подтверждения выхода */}
      <AlertLogOut
        isLogoutOpen={isLogoutOpen}
        setIsLogoutOpen={setIsLogoutOpen}
        handleConfirmLogout={handleConfirmLogout}
      />
    </>
  );
}
