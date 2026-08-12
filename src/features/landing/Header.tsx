"use client";

import ThemeButton from "#/components/ThemeButton";
import LanguageSwitcher from "#/components/LangSwitcher";
import SideBar from "#/features/landing/SideBar";
import { NavigationItems } from "#/features/NavigationItems";
import { Link } from "#/i18n/navigation";
import { useAuthContext } from "#/providers/AuthProvider";
import { UserDropdown } from "#/components/UserDropdown";

export default function Header() {
  const { user, loading, logout } = useAuthContext();

  const initials = user?.name?.slice(0, 2).toUpperCase() || "--";

  return (
    <header className="fixed inset-x-3 top-3 z-40 sm:inset-x-5 sm:top-5 max-w-200 mx-auto">
      {/*  <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-500 to-orange-300 p-6">
        <!-- Карточка в стиле Glassmorphism --> 
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-2">Эффект Glassmorphism</h2>
          <p className="text-white/80 leading-relaxed">
            Этот интерфейс создан с помощью чистого Tailwind CSS. Он использует
            размытие заднего плана и полупрозрачные слои для имитации матового
            стекла.
          </p>
          <button className="mt-6 w-full rounded-xl bg-white/20 py-3 font-semibold transition hover:bg-white/30 border border-white/10">
            Действие
          </button>
        </div>
      </div>*/}

      <div
        className={`
  flex items-center justify-between
  rounded-full
  border border-white/20
  bg-gray-50/20
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
              ),
            )}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeButton />
          {loading ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-700/50" />
              {/* <div className="h-9 w-19 animate-pulse rounded-full bg-gray-700/50" /> */}
            </div>
          ) : user ? (
            <div className="hidden sm:flex items-center gap-4">
              <UserDropdown user={user} logout={logout} initials={initials} />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="button button--ghost hidden sm:flex focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2"
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="button button--primary hidden sm:flex focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue-500 focus-visible:outline-offset-2"
              >
                Sign Up
              </Link>
            </>
          )}
          {/* Mobile menu */}
          <div className="sm:hidden">
            <SideBar />
          </div>
        </div>
      </div>
    </header>
  );
}
