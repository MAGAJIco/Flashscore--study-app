
'use client';

/**
 * Centralized mobile detection utility
 * Single source of truth for mobile/desktop detection across the app
 */

export interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMobileWidth: boolean;
  isMobileDevice: boolean;
  isPWA: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenWidth: number;
  userAgent: string;
}

class MobileDetector {
  private static instance: MobileDetector;
  private listeners: Set<(result: MobileDetectionResult) => void> = new Set();
  private lastResult: MobileDetectionResult | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupListeners();
    }
  }

  static getInstance(): MobileDetector {
    if (!MobileDetector.instance) {
      MobileDetector.instance = new MobileDetector();
    }
    return MobileDetector.instance;
  }

  private setupListeners() {
    window.addEventListener('resize', () => this.notify());
    window.addEventListener('orientationchange', () => this.notify());
  }

  private detect(): MobileDetectionResult {
    if (typeof window === 'undefined') {
      // SSR fallback
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isMobileWidth: false,
        isMobileDevice: false,
        isPWA: false,
        deviceType: 'desktop',
        screenWidth: 1920,
        userAgent: '',
      };
    }

    const width = window.innerWidth;
    const userAgent = navigator.userAgent;

    // Device detection via user agent
    const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    // Width-based detection
    const isMobileWidth = width < 768;
    const isTabletWidth = width >= 768 && width < 1024;
    
    // Combined detection
    const isMobileDevice = isMobileUA && !isTabletUA;
    const isTablet = isTabletUA || (isTabletWidth && !isMobileUA);
    const isMobile = isMobileWidth || isMobileDevice;
    const isDesktop = !isMobile && !isTablet;

    // PWA detection
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true ||
                  document.referrer.includes('android-app://');

    const deviceType: 'mobile' | 'tablet' | 'desktop' = 
      isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    return {
      isMobile,
      isTablet,
      isDesktop,
      isMobileWidth,
      isMobileDevice,
      isPWA,
      deviceType,
      screenWidth: width,
      userAgent,
    };
  }

  get current(): MobileDetectionResult {
    if (!this.lastResult) {
      this.lastResult = this.detect();
    }
    return this.lastResult;
  }

  subscribe(callback: (result: MobileDetectionResult) => void): () => void {
    this.listeners.add(callback);
    // Immediately call with current value
    callback(this.current);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.lastResult = this.detect();
    this.listeners.forEach(listener => listener(this.lastResult!));
  }

  // Force a re-detection
  refresh() {
    this.notify();
  }
}

// Export singleton instance
export const mobileDetector = MobileDetector.getInstance();

// Convenience exports
export const getMobileState = () => mobileDetector.current;
export const subscribeMobileChanges = (callback: (result: MobileDetectionResult) => void) => 
  mobileDetector.subscribe(callback);
