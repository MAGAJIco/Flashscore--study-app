
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English'
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || 'en';
  const validLocale = locales.includes(locale as Locale) ? locale : 'en';

  const messages = (await import(`../../../messages/${validLocale}.json`)).default;
  
  return {
    locale: validLocale,
    messages,
    timeZone: 'UTC',
    now: new Date()
  };
});
