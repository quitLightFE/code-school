import { Menu } from "lucide-react";
import { Button, Drawer } from "@heroui/react";

import { Link } from "#/i18n/navigation";
import { NavigationItems as navItems } from "#/features/NavigationItems";

export default function SideBar() {
  return (
    <Drawer>
      <Button
        isIconOnly
        variant="ghost"
        radius="full"
        className="hover:bg-default-100"
      >
        <Menu className="size-5" />
      </Button>

      <Drawer.Backdrop variant="blur">
        <Drawer.Content
          placement="right"
          className="border-l border-divider"
        >
          <Drawer.Dialog className="flex h-full">
            <Drawer.CloseTrigger />

            <Drawer.Header className="border-b border-divider pb-4">
              <Drawer.Heading className="text-xl font-semibold">
                Navigation
              </Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body className="flex flex-col justify-between py-5">
              <nav className="flex flex-col gap-2">
                {navItems.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    type="button"
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

              <div className="mt-6 border-t border-divider pt-5 flex flex-col gap-3 sm:hidden">
                <Link
                  href="/login"
                  className="button button--secondary w-full justify-center"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="button button--primary w-full justify-center"
                >
                  Sign up
                </Link>
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
