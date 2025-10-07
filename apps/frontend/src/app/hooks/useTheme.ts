
"use client";

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'auto' | 'high-contrast' | 'sports' | 'nature';
type EffectiveTheme = 'light' | 'dark' | 'high-contrast';
type MotionPreference = 'no-preference' | 'reduce';
type ContrastPreference = 'no-preference' | 'more' | 'less';

interface ThemeState {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  motionPreference: MotionPreference;
  contrastPreference: ContrastPreference;
}

export function useTheme() {
  const [state, setState] = useState<ThemeState>({
    theme: 'auto',
    effectiveTheme: 'light',
    motionPreference: 'no-preference',
    contrastPreference: 'no-preference'
  });

  // Detect system preferences
  const detectSystemPreferences = useCallback(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    return {
      isDark: darkQuery.matches,
      reducedMotion: motionQuery.matches ? 'reduce' : 'no-preference' as MotionPreference,
      highContrast: contrastQuery.matches ? 'more' : 'no-preference' as ContrastPreference
    };
  }, []);

  // Calculate effective theme
  const calculateEffectiveTheme = useCallback((theme: Theme): EffectiveTheme => {
    if (theme === 'high-contrast') return 'high-contrast';
    if (theme === 'auto') {
      const { isDark } = detectSystemPreferences();
      return isDark ? 'dark' : 'light';
    }
    return theme === 'dark' ? 'dark' : 'light';
  }, [detectSystemPreferences]);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const { reducedMotion, highContrast } = detectSystemPreferences();
    
    const theme = savedTheme || 'auto';
    const effectiveTheme = calculateEffectiveTheme(theme);

    setState({
      theme,
      effectiveTheme,
      motionPreference: reducedMotion,
      contrastPreference: highContrast
    });

    // Apply theme classes
    document.documentElement.className = effectiveTheme;
    document.body.className = theme === 'sports' ? 'sports' : theme === 'nature' ? 'nature' : '';
    
    if (reducedMotion === 'reduce') {
      document.documentElement.classList.add('reduce-motion');
    }
    if (highContrast === 'more') {
      document.documentElement.classList.add('high-contrast');
    }
  }, [calculateEffectiveTheme, detectSystemPreferences]);

  // Listen for system preference changes
  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const handleDarkChange = (e: MediaQueryListEvent) => {
      if (state.theme === 'auto') {
        setState(prev => ({
          ...prev,
          effectiveTheme: e.matches ? 'dark' : 'light'
        }));
        document.documentElement.className = e.matches ? 'dark' : 'light';
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      const motionPref = e.matches ? 'reduce' : 'no-preference' as MotionPreference;
      setState(prev => ({ ...prev, motionPreference: motionPref }));
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      const contrastPref = e.matches ? 'more' : 'no-preference' as ContrastPreference;
      setState(prev => ({ ...prev, contrastPreference: contrastPref }));
      document.documentElement.classList.toggle('high-contrast', e.matches);
    };

    darkQuery.addEventListener('change', handleDarkChange);
    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      darkQuery.removeEventListener('change', handleDarkChange);
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, [state.theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    const effectiveTheme = calculateEffectiveTheme(newTheme);
    setState(prev => ({ ...prev, theme: newTheme, effectiveTheme }));
    localStorage.setItem('theme', newTheme);
    
    document.documentElement.className = effectiveTheme;
    document.body.className = newTheme === 'sports' ? 'sports' : newTheme === 'nature' ? 'nature' : '';
    
    if (state.motionPreference === 'reduce') {
      document.documentElement.classList.add('reduce-motion');
    }
    if (state.contrastPreference === 'more') {
      document.documentElement.classList.add('high-contrast');
    }
  }, [calculateEffectiveTheme, state.motionPreference, state.contrastPreference]);

  return {
    ...state,
    setTheme,
    isDark: state.effectiveTheme === 'dark',
    isHighContrast: state.effectiveTheme === 'high-contrast',
    shouldReduceMotion: state.motionPreference === 'reduce'
  };
}
