import type { ComponentType, SVGProps } from "react";

interface NavigationItemsProps {
  title: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export const NavigationItems: NavigationItemsProps[] = [
  {
    title: "Dashboard",
    href: "/dashboard"
  },
  {
    title: "Courses",
    href: "/courses"
  }
];
