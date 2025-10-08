
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'fr', 'de', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português'
};

export default getRequestConfig(async ({ locale }) => {
  // Always use 'en' as the default locale since we're not using locale routing
  const validLocale = (locale && locales.includes(locale as Locale)) ? locale : 'en';

  return {
    messages: (await import(`./messages/${validLocale}.json`)).default,
    locale: validLocale
  };
});
