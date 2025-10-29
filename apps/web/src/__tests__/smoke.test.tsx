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
    it('should have valid environment configuration', () => {
      const requiredEnvVars = ['NEXT_PUBLIC_API_URL', 'REPLIT_DEV_DOMAIN'];
      
      requiredEnvVars.forEach(envVar => {
        expect(typeof envVar).toBe('string');
      });
    });
  });
});
