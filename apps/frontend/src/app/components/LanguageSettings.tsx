'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n';
import { useUserPreferences } from '../providers/UserPreferencesProvider';

export default function LanguageSettings() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { updatePreferences } = useUserPreferences();

  const handleLanguageChange = async (newLocale: Locale) => {
    await updatePreferences({ language: newLocale });
    router.refresh();
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '1.5rem',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>🌐</span>
        Language Preferences
      </h2>
      <p style={{
        color: '#9ca3af',
        fontSize: '0.95rem',
        marginBottom: '20px'
      }}>
        Choose your preferred language for the interface and content
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: `2px solid ${locale === loc ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
              background: locale === loc ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              if (locale !== loc) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (locale !== loc) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>
              {loc === 'en' && '🇬🇧'}
              {loc === 'es' && '🇪🇸'}
              {loc === 'fr' && '🇫🇷'}
              {loc === 'de' && '🇩🇪'}
              {loc === 'pt' && '🇵🇹'}
            </span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>{localeNames[loc]}</div>
              {locale === loc && (
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '4px' }}>
                  Current
                </div>
              )}
            </div>
            {locale === loc && (
              <span style={{ color: '#60a5fa', fontSize: '1.2rem' }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <div>
            <div style={{
              color: '#60a5fa',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              Language Preference Saved
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Your language preference is saved to your account and will be remembered across all your devices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
