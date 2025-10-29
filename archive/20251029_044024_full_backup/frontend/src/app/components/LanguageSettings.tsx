'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n';
import { useUserPreferences } from '@providers/UserPreferencesProvider';

export function LanguageSettings() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { updatePreferences } = useUserPreferences();

  const handleLanguageChange = async (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // Set the locale cookie with proper attributes
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Store in localStorage as fallback
    localStorage.setItem('preferredLocale', newLocale);
    
    // Update user preferences
    try {
      await updatePreferences({ language: newLocale });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
    
    // Force reload to apply new locale
    window.location.href = window.location.pathname;
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px'
      }}
      className="language-grid"
      >
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            style={{
              padding: '20px 16px',
              borderRadius: '12px',
              border: `2px solid ${locale === loc ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
              background: locale === loc ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1rem',
              minHeight: '80px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
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
            onTouchStart={(e) => {
              if (locale !== loc) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }
            }}
            onTouchEnd={(e) => {
              if (locale !== loc) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }
            }}
          >
            <span style={{ fontSize: '2rem' }}>
              {loc === 'en' && '🇬🇧'}
              {loc === 'es' && '🇪🇸'}
              {loc === 'fr' && '🇫🇷'}
              {loc === 'de' && '🇩🇪'}
              {loc === 'pt' && '🇵🇹'}
            </span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{localeNames[loc]}</div>
              {locale === loc && (
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '4px' }}>
                  Current
                </div>
              )}
            </div>
            {locale === loc && (
              <span style={{ color: '#60a5fa', fontSize: '1.5rem' }}>✓</span>
            )}
          </button>
        ))}
      </div>
      
      <style jsx>{`
        @media (max-width: 640px) {
          .language-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .language-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

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
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#60a5fa',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              Language Preference Saved
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px' }}>
              Your language preference is saved to your account and will be remembered across all your devices.
            </div>
            
            {/* Translation Coverage */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Translation Coverage</span>
                <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '600' }}>
                  {locale === 'en' ? '100%' : '~85%'}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: locale === 'en' ? '100%' : '85%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

