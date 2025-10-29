
'use client';

import { useState, useEffect, useRef } from 'react';
import { safeStorage } from '@utils/safeHydrationStorage';

/**
 * Hook for accessing data that should only be available after hydration
 * Prevents hydration mismatches from localStorage or other client-only APIs
 */
export function useHydrationSafe<T>(
  key: string,
  defaultValue: T,
  source: 'localStorage' | 'sessionStorage' | 'custom' = 'localStorage'
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Load value after hydration
    const loadValue = async () => {
      try {
        if (source === 'localStorage') {
          const stored = safeStorage.get<T>(key, defaultValue);
          if (stored !== null) {
            setValue(stored);
          }
        } else if (source === 'sessionStorage') {
          const stored = sessionStorage.getItem(key);
          if (stored) {
            setValue(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.warn(`Failed to load ${key}:`, error);
      } finally {
        setIsHydrated(true);
      }
    };

    // Delay to ensure hydration is complete
    requestAnimationFrame(() => {
      loadValue();
    });
  }, [key, defaultValue, source]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    
    if (isHydrated) {
      try {
        if (source === 'localStorage') {
          safeStorage.set(key, newValue);
        } else if (source === 'sessionStorage') {
          sessionStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.warn(`Failed to save ${key}:`, error);
      }
    }
  };

  return [value, updateValue, isHydrated];
}
