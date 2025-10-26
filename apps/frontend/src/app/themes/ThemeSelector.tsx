
'use client';

import React, { useState } from 'react';
import { useThemeManager } from './ThemeManager';

export function ThemeSelector() {
  const { currentTheme, themeId, setTheme, availableThemes } = useThemeManager();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--color-primary)',
          color: 'var(--color-background)',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '0.75rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        🎨 Themes
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '3.5rem',
            right: 0,
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            minWidth: '280px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ marginBottom: '0.75rem', fontWeight: '600', color: 'var(--color-foreground)' }}>
            Select Theme
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: themeId === theme.id ? 'var(--color-accent)' : 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: themeId === theme.id ? 'var(--color-background)' : 'var(--color-foreground)',
                }}
                onMouseEnter={(e) => {
                  if (themeId !== theme.id) {
                    e.currentTarget.style.background = 'var(--color-muted)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (themeId !== theme.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{theme.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{theme.description}</div>
                </div>
                {themeId === theme.id && <span>✓</span>}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.75rem',
              color: 'var(--color-muted)',
            }}
          >
            Current: {currentTheme.name}
          </div>
        </div>
      )}
    </div>
  );
}
