
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';

describe('Database Connection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should require database in production', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.MONGODB_URI;

    const { connectDB } = await import('./db');
    
    await expect(connectDB()).rejects.toThrow('MONGODB_URI');
  });

  it('should allow optional database in development', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.MONGODB_URI;
    delete process.env.REQUIRE_DB;

    const { connectDB } = await import('./db');
    
    const result = await connectDB();
    expect(result).toBeNull();
  });

  it('should enforce database when REQUIRE_DB is true', async () => {
    process.env.REQUIRE_DB = 'true';
    delete process.env.MONGODB_URI;

    const { connectDB } = await import('./db');
    
    await expect(connectDB()).rejects.toThrow('MONGODB_URI');
  });
});
