"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface UserPreferences {
  favoriteSports: string[];
  favoriteTeams: string[];
  predictionStyle: 'conservative' | 'balanced' | 'aggressive';
  language: string;
  notificationSettings: {
    enabled: boolean;
    minConfidence: number;
    sportsFilter: string[];
  };
  dashboardLayout: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: 'predictions' | 'live-scores' | 'news' | 'leaderboard' | 'social-feed' | 'achievements';
  position: number;
  enabled: boolean;
}

const defaultPreferences: UserPreferences = {
  favoriteSports: [],
  favoriteTeams: [],
  predictionStyle: 'balanced',
  language: 'en',
  notificationSettings: {
    enabled: true,
    minConfidence: 70,
    sportsFilter: [],
  },
  dashboardLayout: [
    { id: '1', type: 'predictions', position: 0, enabled: true },
    { id: '2', type: 'live-scores', position: 1, enabled: true },
    { id: '3', type: 'news', position: 2, enabled: true },
    { id: '4', type: 'leaderboard', position: 3, enabled: true },
    { id: '5', type: 'social-feed', position: 4, enabled: true },
    { id: '6', type: 'achievements', position: 5, enabled: true },
  ],
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        const response = await fetch('/api/preferences');
        if (response.ok) {
          const data = await response.json();
          if (data.preferences) {
            setPreferences(data.preferences);
            localStorage.setItem('userPreferences', JSON.stringify(data.preferences));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));

      // If language is updated, also set the cookie
      if (updates.language) {
        document.cookie = `NEXT_LOCALE=${updates.language}; path=/; max-age=31536000; SameSite=Lax`;
      }

      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences),
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, isLoading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
}
