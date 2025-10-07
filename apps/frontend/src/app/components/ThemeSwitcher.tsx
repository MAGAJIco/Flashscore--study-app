
"use client";

import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const themes = [
  { id: 'light', name: 'Light', icon: '☀️', description: 'Classic light theme' },
  { id: 'dark', name: 'Dark', icon: '🌙', description: 'Easy on the eyes' },
  { id: 'auto', name: 'Auto', icon: '🔄', description: 'Match system' },
  { id: 'high-contrast', name: 'High Contrast', icon: '⚡', description: 'Maximum visibility' },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Dynamic sports theme' },
  { id: 'nature', name: 'Nature', icon: '🌿', description: 'Calm & green' }
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme, shouldReduceMotion, isHighContrast } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-switcher-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher-button"
        aria-label="Theme Switcher"
        aria-expanded={isOpen}
      >
        <span className="theme-icon">
          {themes.find(t => t.id === theme)?.icon || '🎨'}
        </span>
        <span className="theme-label">Theme</span>
      </button>

      {isOpen && (
        <div className="theme-switcher-dropdown">
          <div className="theme-switcher-header">
            <h3>Choose Theme</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="close-button"
              aria-label="Close theme switcher"
            >
              ✕
            </button>
          </div>

          <div className="theme-options">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as any);
                  setIsOpen(false);
                }}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                aria-pressed={theme === t.id}
              >
                <span className="theme-option-icon">{t.icon}</span>
                <div className="theme-option-content">
                  <span className="theme-option-name">{t.name}</span>
                  <span className="theme-option-description">{t.description}</span>
                </div>
                {theme === t.id && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>

          <div className="accessibility-info">
            <div className="accessibility-item">
              <span className={shouldReduceMotion ? 'active' : ''}>
                {shouldReduceMotion ? '✅' : '⚪'} Reduced Motion
              </span>
            </div>
            <div className="accessibility-item">
              <span className={isHighContrast ? 'active' : ''}>
                {isHighContrast ? '✅' : '⚪'} High Contrast
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .theme-switcher-container {
          position: relative;
          z-index: 1000;
        }

        .theme-switcher-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theme-switcher-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .theme-icon {
          font-size: 1.2rem;
        }

        .theme-label {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .theme-switcher-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 16px;
          min-width: 280px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .theme-switcher-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .theme-switcher-header h3 {
          color: white;
          font-size: 1rem;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }

        .theme-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .theme-option:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .theme-option.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .theme-option-icon {
          font-size: 1.5rem;
          min-width: 24px;
        }

        .theme-option-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .theme-option-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .theme-option-description {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .check-mark {
          font-weight: bold;
          color: #22c55e;
        }

        .accessibility-info {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .accessibility-item {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .accessibility-item span.active {
          color: #22c55e;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .theme-switcher-dropdown {
            right: auto;
            left: 0;
            width: calc(100vw - 32px);
          }
        }
      `}</style>
    </div>
  );
}
