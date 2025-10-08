
import { getRequestConfig } from 'next-intl/server';
import { headers, cookies } from 'next/headers';

export const locales = ['en', 'es', 'fr', 'de', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português'
};

export default getRequestConfig(async () => {
  // Try to get locale from various sources
  let locale: string = 'en';

  // 1. Check headers set by middleware
  const headersList = await headers();
  const headerLocale = headersList.get('x-next-intl-locale');
  if (headerLocale && locales.includes(headerLocale as Locale)) {
    locale = headerLocale;
  } else {
    // 2. Check cookies
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
      locale = cookieLocale;
    } else {
      // 3. Check user preferences cookie
      const preferencesCookie = cookieStore.get('user-preferences')?.value;
      if (preferencesCookie) {
        try {
          const preferences = JSON.parse(preferencesCookie);
          if (preferences.language && locales.includes(preferences.language as Locale)) {
            locale = preferences.language;
          }
        } catch (e) {
          // Invalid JSON, use default
        }
      }
    }
  }

  const validLocale = locales.includes(locale as Locale) ? locale : 'en';

  return {
    messages: (await import(`./messages/${validLocale}.json`)).default,
    locale: validLocale
  };
});
