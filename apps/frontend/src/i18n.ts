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

export default getRequestConfig(async ({ requestLocale }) => {
  // Use the locale from the request (set by middleware)
  const locale = await requestLocale;

  // Validate and fallback to default
  const validLocale = locale && locales.includes(locale as Locale) ? locale : 'en';

  try {
    const messages = (await import(`./messages/${validLocale}.json`)).default;
    return {
      locale: validLocale,
      messages
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);
    // Fallback to English if locale messages fail to load
    const fallbackMessages = (await import(`./messages/en.json`)).default;
    return {
      locale: 'en',
      messages: fallbackMessages
    };
  }
});