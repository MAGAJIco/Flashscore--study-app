
import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
  logger: true,
});

// CORS
fastify.register(cors, {
  origin: true,
  credentials: true,
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', service: 'api', timestamp: new Date().toISOString() };
});

// ML Service proxy
fastify.get('/api/ml/health', async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    return { ml_service: data, status: 'connected' };
  } catch (error) {
    return { ml_service: null, status: 'disconnected', error: String(error) };
  }
});

// Start server
const start = async () => {
  try {
    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`✅ API Server running at http://0.0.0.0:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
