
"use client";

import { useEffect } from 'react';
import { useTheme } from './useTheme';

interface ThemeSchedule {
  morning: { start: number; end: number; theme: string };
  afternoon: { start: number; end: number; theme: string };
  evening: { start: number; end: number; theme: string };
  night: { start: number; end: number; theme: string };
}

const DEFAULT_SCHEDULE: ThemeSchedule = {
  morning: { start: 6, end: 12, theme: 'light' },
  afternoon: { start: 12, end: 17, theme: 'light' },
  evening: { start: 17, end: 21, theme: 'dark' },
  night: { start: 21, end: 6, theme: 'dark' }
};

export function useThemeScheduler() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const schedule = localStorage.getItem('theme_schedule') 
      ? JSON.parse(localStorage.getItem('theme_schedule')!)
      : DEFAULT_SCHEDULE;

    const checkAndUpdateTheme = () => {
      const hour = new Date().getHours();
      let selectedTheme = 'auto';

      if (hour >= schedule.morning.start && hour < schedule.morning.end) {
        selectedTheme = schedule.morning.theme;
      } else if (hour >= schedule.afternoon.start && hour < schedule.afternoon.end) {
        selectedTheme = schedule.afternoon.theme;
      } else if (hour >= schedule.evening.start && hour < schedule.evening.end) {
        selectedTheme = schedule.evening.theme;
      } else {
        selectedTheme = schedule.night.theme;
      }

      setTheme(selectedTheme as any);
    };

    if (localStorage.getItem('theme_scheduler_enabled') === 'true') {
      checkAndUpdateTheme();
      const interval = setInterval(checkAndUpdateTheme, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [setTheme]);

  const updateSchedule = (schedule: ThemeSchedule) => {
    localStorage.setItem('theme_schedule', JSON.stringify(schedule));
  };

  const toggleScheduler = (enabled: boolean) => {
    localStorage.setItem('theme_scheduler_enabled', String(enabled));
  };

  return { updateSchedule, toggleScheduler };
}
