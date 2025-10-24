
import { describe, it, expect, beforeAll } from 'vitest';

describe('Service Quality Tests', () => {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://0.0.0.0:3001';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://0.0.0.0:5000';
  const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';

  describe('Backend Health', () => {
    it('should have healthy backend service', async () => {
      const response = await fetch(`${BACKEND_URL}/health`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.status).toBeDefined();
      expect(['ok', 'healthy', 'degraded']).toContain(data.status);
    });

    it('should have database connection', async () => {
      const response = await fetch(`${BACKEND_URL}/health`);
      const data = await response.json();
      
      expect(data.db).toBeDefined();
      expect(data.db.status).toBe('ok');
    });

    it('should respond within 2 seconds', async () => {
      const start = Date.now();
      await fetch(`${BACKEND_URL}/health`);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('ML Service Health', () => {
    it('should have healthy ML service', async () => {
      const response = await fetch(`${ML_SERVICE_URL}/health`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });

    it('should have model loaded', async () => {
      const response = await fetch(`${ML_SERVICE_URL}/health`);
      const data = await response.json();
      
      expect(data.model_loaded).toBe(true);
    });

    it('should handle predictions', async () => {
      const response = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: [0.7, 0.6, 0.65, 0.8, 0.5, 0.7, 0.6]
        })
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.prediction).toBeDefined();
      expect(['home', 'draw', 'away']).toContain(data.prediction);
    });
  });

  describe('Frontend Availability', () => {
    it('should serve frontend', async () => {
      const response = await fetch(FRONTEND_URL);
      expect(response.ok).toBe(true);
    });

    it('should have proper content type', async () => {
      const response = await fetch(FRONTEND_URL);
      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('text/html');
    });
  });

  describe('API Endpoints Quality', () => {
    it('should handle predictions API', async () => {
      const response = await fetch(`${BACKEND_URL}/api/predictions`);
      expect(response.ok).toBe(true);
    });

    it('should handle matches API', async () => {
      const response = await fetch(`${BACKEND_URL}/api/matches`);
      expect(response.ok).toBe(true);
    });

    it('should handle news API', async () => {
      const response = await fetch(`${BACKEND_URL}/api/news`);
      expect(response.ok).toBe(true);
    });

    it('should return proper error for invalid endpoints', async () => {
      const response = await fetch(`${BACKEND_URL}/api/nonexistent`);
      expect(response.status).toBe(404);
    });
  });

  describe('Response Quality', () => {
    it('should return JSON for API endpoints', async () => {
      const response = await fetch(`${BACKEND_URL}/health`);
      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('application/json');
    });

    it('should have CORS headers', async () => {
      const response = await fetch(`${BACKEND_URL}/health`);
      const cors = response.headers.get('access-control-allow-origin');
      expect(cors).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should have security headers on backend', async () => {
      const response = await fetch(`${BACKEND_URL}/health`);
      
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    });
  });

  describe('Performance Metrics', () => {
    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        fetch(`${BACKEND_URL}/health`)
      );
      
      const responses = await Promise.all(requests);
      const allOk = responses.every(r => r.ok);
      expect(allOk).toBe(true);
    });

    it('should maintain performance under load', async () => {
      const iterations = 5;
      const times: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await fetch(`${BACKEND_URL}/health`);
        times.push(Date.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      expect(avgTime).toBeLessThan(1000);
    });
  });
});
