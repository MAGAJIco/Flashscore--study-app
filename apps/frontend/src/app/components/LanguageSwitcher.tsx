'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';
import { useUserPreferences } from '@/app/providers/UserPreferencesProvider';

export function LanguageSwitcher() {
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

    try {
      // Set cookie first
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      
      // Store in localStorage as backup
      localStorage.setItem('preferredLocale', newLocale);

      // Update preferences in background
      await updatePreferences({ language: newLocale }).catch(console.error);
      
      // Update path and navigate
      const pathParts = pathname.split('/').filter(Boolean);
      const currentPath = pathParts.length > 1 ? pathParts.slice(1).join('/') : '';
      const newPath = `/${newLocale}${currentPath ? '/' + currentPath : ''}`;
      
      // Force reload to apply new locale
      window.location.href = newPath;
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        type="button"
        className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all border border-white/20 hover:border-cyan-400/50 shadow-md hover:shadow-lg group touch-manipulation"
        style={{
          minHeight: '48px',
          minWidth: '48px'
        }}
        aria-label={t('selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 md:w-5 md:h-5 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
        <span className="font-semibold text-white text-sm hidden md:inline">{localeNames[locale]}</span>
        <span className="font-semibold text-white text-xs md:hidden">{locale.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-cyan-300 group-hover:text-cyan-200 transform transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="fixed md:absolute inset-x-0 bottom-0 md:inset-auto md:top-full md:mt-2 md:right-0 bg-gray-900 md:rounded-lg rounded-t-2xl border-t md:border border-white/20 shadow-xl overflow-hidden z-[100] max-h-[85vh] md:max-h-[500px] flex flex-col md:min-w-[280px]"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-gray-800/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Select Language
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <span className="text-2xl text-gray-400">×</span>
            </button>
          </div>

          <div className="p-3 md:p-2 border-b border-white/10 bg-gray-800/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search language..."
                className="w-full pl-10 pr-3 py-3 md:py-2 bg-white/5 rounded-lg text-white placeholder-gray-400 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 touch-manipulation"
                style={{ minHeight: '48px' }}
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

          <div className="overflow-y-auto flex-1">
            {locales.map((loc) => {
              const isSelected = locale === loc;
              return (
              <button
                key={loc}
                data-lang-option={localeNames[loc]}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full px-5 md:px-4 py-4 md:py-3 text-left hover:bg-white/10 active:bg-white/20 transition-colors flex items-center gap-4 md:gap-3 touch-manipulation ${
                  isSelected ? 'bg-cyan-500/30 text-cyan-300 font-semibold border-l-4 border-cyan-400' : 'text-white'
                }`}
                style={{ minHeight: '64px' }}
                role="menuitem"
                aria-current={isSelected ? 'true' : 'false'}
                aria-selected={isSelected}
              >
                <span className="text-3xl md:text-xl">
                  {loc === 'en' && '🇬🇧'}
                  {loc === 'es' && '🇪🇸'}
                  {loc === 'fr' && '🇫🇷'}
                  {loc === 'de' && '🇩🇪'}
                  {loc === 'pt' && '🇵🇹'}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-base md:text-sm">{localeNames[loc]}</div>
                  <div className="text-sm md:text-xs text-gray-400 mt-0.5">
                    {loc === 'en' && 'English'}
                    {loc === 'es' && 'Español'}
                    {loc === 'fr' && 'Français'}
                    {loc === 'de' && 'Deutsch'}
                    {loc === 'pt' && 'Português'}
                  </div>
                </div>
                {isSelected && (
                  <Check className="ml-auto w-5 h-5 md:w-4 md:h-4 text-cyan-300 animate-pulse" />
                )}
              </button>
            );
            })}
          </div>

          <div className="p-3 md:p-2 border-t border-white/10 bg-white/5">
            <button 
              className="w-full text-left px-3 md:px-2 py-3 md:py-1 text-sm md:text-xs text-gray-400 hover:text-cyan-400 active:text-cyan-300 transition-colors rounded-lg hover:bg-white/5 touch-manipulation"
              style={{ minHeight: '48px' }}
            >
              + Request a language
            </button>
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}