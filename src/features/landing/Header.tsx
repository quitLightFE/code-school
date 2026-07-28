"use client";

import { useState } from "react"
import ThemeButton from "#/components/ThemeButton";
import LanguageSwitcher from "#/components/LangSwitcher";
import SideBar from "#/features/landing/SideBar";
import { NavigationItems } from "#/features/NavigationItems";
import { Link } from "#/i18n/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-3 top-3 z-40 sm:inset-x-5 sm:top-5">
      <div
        className={`
          flex items-center justify-between
          rounded-full
          border border-white/10
          bg-background/65
          backdrop-blur-xl
          shadow-xl
          px-3 py-2
          sm:px-6 sm:py-3
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`
            text-lg
            font-bold
            tracking-tight
            transition-colors
            hover:text-primary
          `}
        >
          Code School
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {NavigationItems.map(
              (item: { title: string; href: string }, i: number) => (
                <li key={item.title + i}>
                  <Link
                    href={item.href}
                    className={`
                    rounded-full
                    px-4 py-2
                    text-sm font-medium
                    transition-all duration-200
                    hover:bg-default-100
                    hover:text-primary
                  `}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />

          <ThemeButton />
          {/*<SunMoon className="size-5" />*/}

          <Link href="/login" className="button button--ghost hidden sm:flex">
            Log In
          </Link>

          <Link
            href="/register"
            className="button button--primary hidden sm:flex"
          >
            Sign Up
          </Link>

          {/* Mobile menu */}
          <div className="sm:hidden">
            <SideBar />
          </div>
        </div>
      </div>
    </header>
  );
}

// "use client";

// import ThemeButton from "#/components/ThemeButton";
// import { Button } from "@heroui/react";
// import SideBar from "#/features/landing/SideBar";
// import { Menu, SunMoon } from "lucide-react";

// import { NavigationItems } from "#/features/NavigationItems";

// import LanguageSwitcher from "#/components/LangSwitcher";

// // import NextLink from "next/link";
// import { Link } from "#/i18n/navigation";

// export default function Header() {
//   return (
//     <div className="flex gap-2 fixed top-3 left-3 sm:left-5 right-3 sm:right-5 sm:top-5 z-40 px-3 sm:px-5">
//       <div className="backdrop-blur-sm flex w-full border-b border-separator bg-background/70 rounded-[50px] border border-white/20 shadow-lg">
//         <nav className="w-full">
//           <header className="flex items-center justify-between sm:p-5 sm:ps-6 ps-3  p-2">
//             <div className="flex items-center gap-3">
//               {/* <Logo /> */}
//               <Link href="/" className="font-bold">Code School</Link>
//             </div>
//             <ul className="items-center gap-2 sm:flex hidden">
//               {/* for unique key */}
//               {NavigationItems.map((item, i) => (
//                 <li key={item.title + i}>
//                   <Link href={item.href}>{item.title}</Link>
//                 </li>
//               ))}
//             </ul>
//             <ul className="flex items-center sm:gap-2 gap-1">
//               <li>
//                 <LanguageSwitcher />
//               </li>
//               <li>
//                 <ThemeButton isIconOnly variant="ghost">
//                   <SunMoon />
//                 </ThemeButton>
//               </li>
//               <li className="hidden sm:flex">
//                 <Link href="/login" className="button button--ghost">
//                   Log In
//                 </Link>
//               </li>
//               <li className="hidden sm:flex">
//                 <Link href="/register" className="button button--primary">
//                   Sign Up
//                 </Link>
//               </li>
//             </ul>
//           </header>
//         </nav>
//       </div>
//       <div className="backdrop-blur-sm sm:hidden flex border-b border-separator bg-background/70 rounded-[50px] border border-white/20 shadow-lg sm:p-5 p-2 items-center justify-center">
//         <SideBar />
//       </div>
//     </div>
//   );
// }
