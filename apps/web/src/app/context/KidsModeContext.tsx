
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface KidsModeContextType {
  isKidsModeEnabled: boolean;
  toggleKidsMode: () => void;
  setKidsMode: (enabled: boolean) => void;
}

const KidsModeContext = createContext<KidsModeContextType | undefined>(undefined);

export function KidsModeProvider({ children }: { children: ReactNode }) {
  const [isKidsModeEnabled, setIsKidsModeEnabled] = useState(false);

  useEffect(() => {
    // Load Kids Mode preference from localStorage
    const savedMode = localStorage.getItem('kidsMode');
    if (savedMode === 'true') {
      setIsKidsModeEnabled(true);
    }
  }, []);

  const toggleKidsMode = () => {
    setIsKidsModeEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('kidsMode', String(newValue));
      return newValue;
    });
  };

  const setKidsMode = (enabled: boolean) => {
    setIsKidsModeEnabled(enabled);
    localStorage.setItem('kidsMode', String(enabled));
  };

  return (
    <KidsModeContext.Provider value={{ isKidsModeEnabled, toggleKidsMode, setKidsMode }}>
      {children}
    </KidsModeContext.Provider>
  );
}

export function useKidsModeContext() {
  const context = useContext(KidsModeContext);
  if (context === undefined) {
    throw new Error('useKidsModeContext must be used within a KidsModeProvider');
  }
  return context;
}

export { KidsModeContext };
