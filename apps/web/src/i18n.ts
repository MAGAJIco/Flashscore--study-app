import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "es", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || "en";
  const validLocale = locales.includes(locale as Locale) ? locale : "en";

  const messages = (await import(`@shared/libs/messages/${validLocale}.json`))
    .default;

  return {
    locale: validLocale,
    messages,
    timeZone: "UTC",
    now: new Date(),
  };
});
