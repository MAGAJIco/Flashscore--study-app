
// Set test environment variables
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
process.env.ALLOW_LIMITED_MODE = 'true';
process.env.API_URL = process.env.API_URL || 'http://localhost:3001';

// Increase timeout for async operations
jest.setTimeout(10000);
