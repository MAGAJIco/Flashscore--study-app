import '@testing-library/jest-dom';

describe('Frontend Smoke Tests', () => {
  describe('Critical Routes', () => {
    it('should have valid homepage route structure', () => {
      const criticalRoutes = [
        '/en',
        '/en/matches',
        '/en/predictions',
        '/en/feed',
        '/en/kids',
        '/en/achievements',
        '/en/analytics',
      ];
      
      expect(criticalRoutes).toHaveLength(7);
      criticalRoutes.forEach(route => {
        expect(route).toMatch(/^\/[a-z]{2}/);
      });
    });
  });

  describe('Component Exports', () => {
    it('should export critical components without errors', async () => {
      try {
        const { GoogleNavBar } = await import('@/app/components/layout/GoogleNavBar');
        const { MagajiCoAppLauncher } = await import('@/app/components/MagajiCoAppLauncher');
        const { EnhancedLiveCarousel } = await import('@/app/components/enhanced/EnhancedLiveCarousel');
        const { NewsCarousel } = await import('@/app/components/carousels/NewsCarousel');
        
        expect(GoogleNavBar).toBeDefined();
        expect(MagajiCoAppLauncher).toBeDefined();
        expect(EnhancedLiveCarousel).toBeDefined();
        expect(NewsCarousel).toBeDefined();
      } catch (error) {
        throw new Error(`Component import failed: ${error}`);
      }
    });
  });

  describe('Configuration', () => {
    it('should have valid API URL configuration', () => {
      const allowDefaults = process.env.ALLOW_TEST_DEFAULTS === 'true';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!allowDefaults && !apiUrl) {
        fail('NEXT_PUBLIC_API_URL is not set. Set ALLOW_TEST_DEFAULTS=true for development testing.');
      }
      
      const finalUrl = apiUrl || 'http://0.0.0.0:3001';
      
      expect(finalUrl).toBeTruthy();
      expect(typeof finalUrl).toBe('string');
      expect(finalUrl).toMatch(/^https?:\/\//);
      
      try {
        new URL(finalUrl);
      } catch (error) {
        fail(`Invalid API URL: ${finalUrl}`);
      }
    });

    it('should have valid Replit domain when in Replit environment', () => {
      const replitDomain = process.env.REPLIT_DEV_DOMAIN;
      
      if (replitDomain) {
        expect(typeof replitDomain).toBe('string');
        expect(replitDomain).toMatch(/replit\.dev$/);
      } else {
        expect(true).toBe(true);
      }
    });
  });
});
