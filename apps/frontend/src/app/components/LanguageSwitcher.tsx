
'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n';
import { useUserPreferences } from '../providers/UserPreferencesProvider';

export default function LanguageSwitcher() {
  const t = useTranslations('settings');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { updatePreferences } = useUserPreferences();

  const handleLanguageChange = async (newLocale: Locale) => {
    // Set the locale cookie immediately
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Update user preferences (this also sets the cookie)
    await updatePreferences({ language: newLocale });
    
    // Store in localStorage as backup
    localStorage.setItem('preferredLocale', newLocale);
    
    // Hard reload to apply new locale
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
        aria-label={t('selectLanguage')}
      >
        <span className="text-2xl">🌐</span>
        <span className="font-medium">{localeNames[locale]}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 rounded-lg border border-white/20 shadow-xl overflow-hidden z-50 min-w-[180px]">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 ${
                locale === loc ? 'bg-white/20 text-cyan-400' : 'text-white'
              }`}
            >
              <span className="text-xl">
                {loc === 'en' && '🇬🇧'}
                {loc === 'es' && '🇪🇸'}
                {loc === 'fr' && '🇫🇷'}
                {loc === 'de' && '🇩🇪'}
                {loc === 'pt' && '🇵🇹'}
              </span>
              <span>{localeNames[loc]}</span>
              {locale === loc && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
