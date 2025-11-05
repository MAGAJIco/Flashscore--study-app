
'use client';

import React, { useState } from 'react';

interface TouchOptimizedProps {
  children: React.ReactNode;
  onTap?: () => void;
  haptic?: boolean;
}

export function TouchOptimized({ children, onTap, haptic = true }: TouchOptimizedProps) {
  const [isPressed, setIsPressed] = useState(false);

  const triggerHaptic = () => {
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTouchStart = () => {
    setIsPressed(true);
    triggerHaptic();
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (onTap) onTap();
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`transition-transform ${isPressed ? 'scale-95' : 'scale-100'}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </div>
  );
}
