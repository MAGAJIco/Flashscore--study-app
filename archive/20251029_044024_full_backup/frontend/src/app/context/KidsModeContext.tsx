"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface KidsModeContextType {
  isKidsModeEnabled: boolean;
  toggleKidsMode: () => void;
  setKidsMode: (enabled: boolean) => void;
}

const KidsModeContext = createContext<KidsModeContextType | undefined>(undefined);

export function KidsModeProvider({ children }: { children: ReactNode }) {
  const [isKidsModeEnabled, setIsKidsModeEnabled] = useState(false);

  const toggleKidsMode = () => {
    setIsKidsModeEnabled(prev => !prev);
  };

  const setKidsMode = (enabled: boolean) => {
    setIsKidsModeEnabled(enabled);
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
