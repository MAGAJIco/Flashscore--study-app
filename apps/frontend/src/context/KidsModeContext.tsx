"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type KidsModeContextValue = {
  kidsMode: boolean;
  setKidsMode: (v: boolean) => void;
};

const KidsModeContext = createContext<KidsModeContextValue | undefined>(
  undefined,
);

export const KidsModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [kidsMode, setKidsModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("kidsMode");
      return stored === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kidsMode", String(kidsMode));
    } catch {}
  }, [kidsMode]);

  const setKidsMode = (v: boolean) => {
    setKidsModeState(v);
  };

  return (
    <KidsModeContext.Provider value={{ kidsMode, setKidsMode }}>
      {children}
    </KidsModeContext.Provider>
  );
};

export const useKidsModeContext = (): KidsModeContextValue => {
  const ctx = useContext(KidsModeContext);
  if (!ctx)
    throw new Error("useKidsModeContext must be used inside KidsModeProvider");
  return ctx;
};
