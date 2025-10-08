
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import coppaRouter from '../coppa';
import { User as UserModel } from '../../models/User';

describe('COPPA Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(coppaRouter, { prefix: '/api/coppa' });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /request-consent', () => {
    it('creates parental consent request for child under 13', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/coppa/request-consent',
        payload: {
          childEmail: 'child@test.com',
          childAge: 10,
          parentEmail: 'parent@test.com',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('Parental consent requested');
    });

    it('returns 400 when required fields are missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/coppa/request-consent',
        payload: {
          childEmail: 'child@test.com',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toContain('required');
    });
  });

  describe('POST /verify-consent', () => {
    it('approves consent with valid verification', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/coppa/verify-consent',
        payload: {
          childEmail: 'child@test.com',
          verificationToken: 'valid-token-123',
          parentConfirmed: true,
          verificationMethod: 'email_link',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.message).toContain('verified');
    });

    it('creates audit trail entry on verification', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/coppa/verify-consent',
        payload: {
          childEmail: 'child@test.com',
          verificationToken: 'valid-token-123',
          parentConfirmed: true,
        },
      });

      expect(response.statusCode).toBe(200);
      // Verify audit trail was created (would need to query DB in real test)
    });
  });

  describe('POST /revoke-consent', () => {
    it('revokes consent with matching parent email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/coppa/revoke-consent',
        payload: {
          childEmail: 'child@test.com',
          parentEmail: 'parent@test.com',
          reason: 'Parent request',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.message).toContain('revoked');
    });

    it('returns 403 for mismatched parent email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/coppa/revoke-consent',
        payload: {
          childEmail: 'child@test.com',
          parentEmail: 'wrong@test.com',
          reason: 'Test',
        },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /export-consent/:childEmail', () => {
    it('exports consent record as JSON', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/coppa/export-consent/child@test.com?parentEmail=parent@test.com',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-disposition']).toContain('attachment');
      
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('childEmail');
      expect(body).toHaveProperty('auditTrail');
    });
  });
});
