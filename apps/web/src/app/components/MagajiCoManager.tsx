
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MagajiCoContext {
  highlightedMatch: string | null;
  setHighlightedMatch: (matchId: string | null) => void;
  ceoMode: boolean;
  toggleCeoMode: () => void;
}

const MagajiCoContext = createContext<MagajiCoContext | null>(null);

export function useMagajiCo() {
  const context = useContext(MagajiCoContext);
  if (!context) {
    throw new Error('useMagajiCo must be used within MagajiCoProvider');
  }
  return context;
}

export function MagajiCoProvider({ children }: { children: React.ReactNode }) {
  const [highlightedMatch, setHighlightedMatch] = useState<string | null>(null);
  const [ceoMode, setCeoMode] = useState(false);

  const toggleCeoMode = () => {
    setCeoMode(prev => !prev);
  };

  return (
    <MagajiCoContext.Provider value={{
      highlightedMatch,
      setHighlightedMatch,
      ceoMode,
      toggleCeoMode
    }}>
      {children}
    </MagajiCoContext.Provider>
  );
}

export const MagajiCoManager = {
  highlightMatch: (matchId: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('magajico:highlight', { 
        detail: { matchId } 
      }));
    }
  }
};
