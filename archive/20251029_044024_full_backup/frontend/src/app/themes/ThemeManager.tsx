
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, getTheme, getAvailableThemes } from './index';

interface ThemeContextType {
  currentTheme: Theme;
  themeId: string;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeManager() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeManager must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState('default');
  const [currentTheme, setCurrentTheme] = useState(getTheme('default'));
  const availableThemes = getAvailableThemes();

  useEffect(() => {
    const savedTheme = localStorage.getItem('active-theme');
    if (savedTheme) {
      setThemeId(savedTheme);
      setCurrentTheme(getTheme(savedTheme));
    }
  }, []);

  useEffect(() => {
    const theme = getTheme(themeId);
    setCurrentTheme(theme);
    localStorage.setItem('active-theme', themeId);
    applyTheme(theme);
  }, [themeId]);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    root.setAttribute('data-theme', theme.id);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeId, setTheme: setThemeId, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}
