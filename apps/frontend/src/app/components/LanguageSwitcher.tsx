'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';
import { useUserPreferences } from '../providers/UserPreferencesProvider';

export default function LanguageSwitcher() {
  const t = useTranslations('settings');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { updatePreferences } = useUserPreferences();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageChange = async (newLocale: Locale) => {
    setIsOpen(false);
    
    if (newLocale === locale) return;
    
    // Set the cookie with proper attributes
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Store in localStorage immediately
    localStorage.setItem('preferredLocale', newLocale);
    
    // Update preferences
    try {
      await updatePreferences({ language: newLocale });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
    
    // Force reload to apply new locale
    window.location.reload();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-cyan-400/50 shadow-md hover:shadow-lg group"
        style={{
          minHeight: '44px',
          minWidth: '44px'
        }}
        aria-label={t('selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
        <span className="font-semibold text-white text-sm hidden md:inline">{localeNames[locale]}</span>
        <ChevronDown className={`w-4 h-4 text-cyan-300 group-hover:text-cyan-200 transform transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-2 right-0 bg-gray-900 rounded-lg border border-white/20 shadow-xl overflow-hidden z-50 min-w-[220px]"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search language..."
                className="w-full pl-10 pr-3 py-2 bg-white/5 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  document.querySelectorAll('[data-lang-option]').forEach(el => {
                    const text = el.getAttribute('data-lang-option')?.toLowerCase() || '';
                    (el as HTMLElement).style.display = text.includes(search) ? 'flex' : 'none';
                  });
                }}
              />
            </div>
          </div>
          {locales.map((loc) => (
            <button
              key={loc}
              data-lang-option={localeNames[loc]}
              onClick={() => handleLanguageChange(loc)}
              className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 ${
                locale === loc ? 'bg-white/20 text-cyan-400' : 'text-white'
              }`}
              role="menuitem"
              aria-current={locale === loc ? 'true' : 'false'}
            >
              <span className="text-xl">
                {loc === 'en' && '🇬🇧'}
                {loc === 'es' && '🇪🇸'}
                {loc === 'fr' && '🇫🇷'}
                {loc === 'de' && '🇩🇪'}
                {loc === 'pt' && '🇵🇹'}
              </span>
              <div className="flex-1">
                <div className="font-medium">{localeNames[loc]}</div>
                <div className="text-xs text-gray-400">
                  {loc === 'en' && 'English'}
                  {loc === 'es' && 'Español'}
                  {loc === 'fr' && 'Français'}
                  {loc === 'de' && 'Deutsch'}
                  {loc === 'pt' && 'Português'}
                </div>
              </div>
              {locale === loc && <Check className="ml-auto w-4 h-4 text-cyan-400" />}
            </button>
          ))}
          
          <div className="p-2 border-t border-white/10 bg-white/5">
            <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
              + Request a language
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
