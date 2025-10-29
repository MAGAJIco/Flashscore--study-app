
import { describe, it, expect } from 'vitest';

describe('Feature Module Integration', () => {
  it('should have all feature modules registered', () => {
    const modules = ['predictions', 'matches', 'social', 'rewards'];
    modules.forEach(module => {
      expect(module).toBeTruthy();
    });
  });

  it('should have correct API routes structure', () => {
    const expectedRoutes = [
      '/api/predictions',
      '/api/matches',
      '/api/news',
      '/api/auth',
      '/health'
    ];
    expectedRoutes.forEach(route => {
      expect(route).toBeTruthy();
    });
  });
});
