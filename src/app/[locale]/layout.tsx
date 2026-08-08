// import "./globals.css";
import Header from "#/features/landing/Header";

import { getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { notFound } from "next/navigation";
import { routing } from "#/i18n/routing";
import { hasLocale } from "next-intl";

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const messages = await getMessages();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="scrollbar-gutter-stable"
    >
      <body>
        <Providers locale={locale} messages={messages} timeZone="UTC">
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
