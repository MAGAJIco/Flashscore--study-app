
"use client";

import { useState, useEffect } from 'react';

export function useEmpireVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [wasHidden, setWasHidden] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const nowVisible = !document.hidden;
      setIsVisible(nowVisible);
      
      if (!nowVisible) {
        setWasHidden(true);
      }
    };

    // Initial check
    setIsVisible(!document.hidden);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isVisible,
    wasHidden,
    isHidden: !isVisible
  };
}
