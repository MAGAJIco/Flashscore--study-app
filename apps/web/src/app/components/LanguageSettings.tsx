
'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n';

export function LanguageSettings() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const handleLanguageChange = async (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // Set the locale cookie with proper attributes
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Store in localStorage as fallback
    localStorage.setItem('preferredLocale', newLocale);
    
    // Force reload to apply new locale
    window.location.href = window.location.pathname.replace(`/${locale}`, `/${newLocale}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Language / Idioma / Langue</h3>
      <div className="grid grid-cols-2 gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              locale === loc
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {localeNames[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
