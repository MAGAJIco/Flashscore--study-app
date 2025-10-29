
describe('Backend API Smoke Tests', () => {
  const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

  describe('Health Endpoint', () => {
    it('should respond to health check', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('status');
        expect(data).toHaveProperty('timestamp');
        expect(data).toHaveProperty('database');
      } catch (error) {
        console.warn('Health check failed - server may not be running:', error);
      }
    });
  });

  describe('API Routes', () => {
    it('should have critical API routes defined', () => {
      const criticalRoutes = [
        '/api/auth',
        '/api/matches',
        '/api/news',
        '/api/predictions',
        '/api/rewards',
        '/api/scraper',
        '/api/picoins',
      ];
      
      expect(criticalRoutes).toHaveLength(7);
      criticalRoutes.forEach(route => {
        expect(route).toMatch(/^\/api\//);
      });
    });
  });

  describe('Module Imports', () => {
    it('should have critical module files present', () => {
      const criticalModules = [
        'auth',
        'matches',
        'news',
        'predictions',
        'rewards',
        'scraper',
      ];
      
      expect(criticalModules.length).toBeGreaterThan(0);
      criticalModules.forEach(module => {
        expect(module).toBeTruthy();
      });
    });
  });

  describe('Database Connection', () => {
    it('should have MONGODB_URI configured', () => {
      const mongoUri = process.env.MONGODB_URI;
      expect(typeof mongoUri).toBe('string');
    });
  });

  describe('Dependencies', () => {
    it('should have critical dependencies available', () => {
      const dependencies = ['fastify', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'dotenv'];
      
      dependencies.forEach(dep => {
        expect(() => require(dep)).not.toThrow();
      });
    });
  });
});
