
"use client";

import { useEffect } from 'react';

class HapticManager {
  private static instance: HapticManager;
  private isSupported: boolean = false;

  private constructor() {
    this.isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager();
    }
    return HapticManager.instance;
  }

  light() {
    if (this.isSupported) {
      navigator.vibrate(10);
    }
  }

  medium() {
    if (this.isSupported) {
      navigator.vibrate(20);
    }
  }

  heavy() {
    if (this.isSupported) {
      navigator.vibrate(30);
    }
  }

  success() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  error() {
    if (this.isSupported) {
      navigator.vibrate([20, 50, 20, 50, 20]);
    }
  }

  selection() {
    if (this.isSupported) {
      navigator.vibrate(5);
    }
  }

  // Enhanced haptic patterns for key actions
  predictionPlaced() {
    if (this.isSupported) {
      navigator.vibrate([15, 30, 15]);
    }
  }

  oddsChanged() {
    if (this.isSupported) {
      navigator.vibrate([5, 20, 5]);
    }
  }

  swipeAction() {
    if (this.isSupported) {
      navigator.vibrate(8);
    }
  }

  confidenceAdjust() {
    if (this.isSupported) {
      navigator.vibrate(3);
    }
  }

  refreshComplete() {
    if (this.isSupported) {
      navigator.vibrate([10, 30, 10]);
    }
  }
}

export const haptic = HapticManager.getInstance();

export function useHapticFeedback() {
  useEffect(() => {
    // Add haptic feedback to all buttons
    const buttons = document.querySelectorAll('button');
    
    const handleClick = () => haptic.light();
    
    buttons.forEach(button => {
      button.addEventListener('click', handleClick);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleClick);
      });
    };
  }, []);
}

export default HapticManager;
