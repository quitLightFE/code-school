import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;

  // 1. Сразу определяем гарантированную строку с локалью
  const locale =
    resolvedLocale && routing.locales.includes(resolvedLocale as any)
      ? resolvedLocale
      : routing.defaultLocale;

  return {
    locale, // Теперь это строго строка
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "UTC"
  };
});

/*import {getRequestConfig} from "next-intl/server";
import {routing} from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  return {
    locale: routing.locales.includes(locale as never)
      ? locale
      : routing.defaultLocale,
    messages: (
      await import(`../messages/${locale ?? routing.defaultLocale}.json`)
    ).default,
  };
});*/
