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
  let locale = await requestLocale;

  // Validate and fallback to default
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to English if locale messages fail to load
    return {
      locale: 'en',
      messages: (await import(`./messages/en.json`)).default
    };
  }
});