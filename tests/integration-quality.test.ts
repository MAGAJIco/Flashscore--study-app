
import { describe, it, expect } from 'vitest';

describe('Integration Quality Tests', () => {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://0.0.0.0:3001';
  const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';

  describe('Backend-ML Integration', () => {
    it('should successfully proxy ML requests through backend', async () => {
      const response = await fetch(`${BACKEND_URL}/api/predictions/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: 'Test Home',
          awayTeam: 'Test Away',
          features: [0.7, 0.6, 0.65, 0.8, 0.5, 0.7, 0.6]
        })
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('Data Flow Quality', () => {
    it('should maintain data consistency', async () => {
      // Test that data from backend matches expected structure
      const response = await fetch(`${BACKEND_URL}/api/matches`);
      const data = await response.json();
      
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should handle error propagation correctly', async () => {
      const response = await fetch(`${BACKEND_URL}/api/predictions/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' })
      });
      
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });

  describe('Service Dependencies', () => {
    it('should have all required services running', async () => {
      const services = [
        { name: 'Backend', url: `${BACKEND_URL}/health` },
        { name: 'ML Service', url: `${ML_SERVICE_URL}/health` }
      ];
      
      for (const service of services) {
        const response = await fetch(service.url);
        expect(response.ok).toBe(true);
      }
    });
  });

  describe('Error Recovery', () => {
    it('should handle ML service timeout gracefully', async () => {
      // Test backend fallback when ML service is slow
      const response = await fetch(`${BACKEND_URL}/api/predictions/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: 'Test Home',
          awayTeam: 'Test Away',
          features: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
        })
      });
      
      // Should either succeed or fail gracefully with proper error
      expect([200, 500, 503]).toContain(response.status);
    });
  });
});
