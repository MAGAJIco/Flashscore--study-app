
'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n';

export default function LanguageLearningMode() {
  const currentLocale = useLocale() as Locale;
  const t = useTranslations('common');
  const [learningMode, setLearningMode] = useState(false);
  const [secondaryLanguage, setSecondaryLanguage] = useState<Locale | null>(null);
  const [showTranslations, setShowTranslations] = useState(true);

  const sportsTerms = {
    en: { goal: 'Goal', penalty: 'Penalty', corner: 'Corner', offside: 'Offside' },
    es: { goal: 'Gol', penalty: 'Penalti', corner: 'Córner', offside: 'Fuera de juego' },
    fr: { goal: 'But', penalty: 'Pénalty', corner: 'Corner', offside: 'Hors-jeu' },
    de: { goal: 'Tor', penalty: 'Elfmeter', corner: 'Ecke', offside: 'Abseits' },
    pt: { goal: 'Gol', penalty: 'Pênalti', corner: 'Escanteio', offside: 'Impedimento' }
  };

  return (
    <div style={{
      background: 'rgba(139, 92, 246, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ color: '#a78bfa', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📚 Language Learning Mode
        </h3>
        <button
          onClick={() => setLearningMode(!learningMode)}
          style={{
            background: learningMode ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {learningMode ? 'Disable' : 'Enable'}
        </button>
      </div>

      {learningMode && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
              Learn alongside:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {locales.filter(loc => loc !== currentLocale).map(loc => (
                <button
                  key={loc}
                  onClick={() => setSecondaryLanguage(loc)}
                  style={{
                    background: secondaryLanguage === loc ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: secondaryLanguage === loc ? '#a78bfa' : '#9ca3af',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {localeNames[loc]}
                </button>
              ))}
            </div>
          </div>

          {secondaryLanguage && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Show translations</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showTranslations}
                    onChange={(e) => setShowTranslations(e.target.checked)}
                  />
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    {showTranslations ? 'On hover' : 'Always'}
                  </span>
                </label>
              </div>
              
              <div style={{ color: '#60a5fa', fontSize: '0.8rem', marginTop: '8px' }}>
                💡 Sports terms will show in both {localeNames[currentLocale]} and {localeNames[secondaryLanguage]}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
