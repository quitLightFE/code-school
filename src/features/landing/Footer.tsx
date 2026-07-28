// components/Footer.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes"; // если используете next-themes
import {
  FaTelegram,
  FaVk,
  FaYoutube,
  FaInstagram,
  FaLinkedin
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Логотип и описание */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                C
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Code School
                </span>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-lg leading-relaxed">
              Современный учебный центр по IT. Готовим востребованных
              специалистов: Frontend, Backend, DevOps, Data Science и Mobile.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                <FaTelegram size={24} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                <FaVk size={24} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-lg mb-6 text-neutral-900 dark:text-white">
              Навигация
            </h3>
            <ul className="space-y-4 text-neutral-600 dark:text-neutral-400">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Курсы
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Менторы
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  О школе
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Блог
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Мероприятия
                </Link>
              </li>
            </ul>
          </div>

          {/* Полезные ссылки */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-6 text-neutral-900 dark:text-white">
              Полезное
            </h3>
            <ul className="space-y-4 text-neutral-600 dark:text-neutral-400">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Отзывы
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Карьера
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-6 text-neutral-900 dark:text-white">
              Контакты
            </h3>
            <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Телефон
                </p>
                <a
                  href="tel:+78005553535"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  +7 (800) 555-35-35
                </a>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Email
                </p>
                <a
                  href="mailto:hello@codeschool.ru"
                  className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  hello@codeschool.ru
                </a>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  Адрес
                </p>
                <p>Москва, ул. Тверская 12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <p>© 2026 Code School. Все права защищены.</p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              Условия использования
            </Link>
          </div>

          <p className="text-xs">Сделано с ❤️ для будущих IT-специалистов</p>
        </div>
      </div>
    </footer>
  );
}
