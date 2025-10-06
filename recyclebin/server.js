// server.js - Fastify + Next.js PWA Setup

const fastify = require('fastify')({ logger: true });
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare Next.js
app.prepare().then(() => {
  
  // Serve static files (icons, manifest, service worker)
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/'
  });

  // CORS for PWA
  fastify.register(require('@fastify/cors'), {
    origin: true,
    credentials: true
  });

  // Helmet for security with PWA-friendly CSP
  fastify.register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        workerSrc: ["'self'", "blob:"],
        manifestSrc: ["'self'"]
      }
    }
  });

  // Service Worker route - CRITICAL for PWA
  fastify.get('/service-worker.js', async (req, reply) => {
    const filePath = path.join(__dirname, 'public', 'service-worker.js');
    const stat = fs.statSync(filePath);
    
    reply
      .header('Content-Type', 'application/javascript; charset=utf-8')
      .header('Cache-Control', 'no-cache, no-store, must-revalidate')
      .header('Service-Worker-Allowed', '/')
      .send(fs.createReadStream(filePath));
  });

  // Manifest route
  fastify.get('/manifest.json', async (req, reply) => {
    const filePath = path.join(__dirname, 'public', 'manifest.json');
    
    reply
      .header('Content-Type', 'application/manifest+json')
      .header('Cache-Control', 'public, max-age=3600')
      .send(fs.createReadStream(filePath));
  });

  // Offline page
  fastify.get('/offline.html', async (req, reply) => {
    const filePath = path.join(__dirname, 'public', 'offline.html');
    
    reply
      .header('Content-Type', 'text/html')
      .send(fs.createReadStream(filePath));
  });

  // Health check endpoint
  fastify.get('/api/health', async (req, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes with proper headers for PWA
  fastify.all('/api/*', async (req, reply) => {
    reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    return handle(req.raw, reply.raw);
  });

  // Static assets with long cache
  fastify.get('/_next/*', async (req, reply) => {
    reply.header('Cache-Control', 'public, max-age=31536000, immutable');
    return handle(req.raw, reply.raw);
  });

  // Images and icons with cache
  fastify.get('/icons/*', async (req, reply) => {
    reply.header('Cache-Control', 'public, max-age=86400');
    return handle(req.raw, reply.raw);
  });

  // All other routes handled by Next.js
  fastify.all('*', async (req, reply) => {
    return handle(req.raw, reply.raw);
  });

  // Start server
  fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`✅ Server ready at ${address}`);
    console.log(`🚀 PWA enabled - Install prompt will show on HTTPS`);
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await fastify.close();
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

}).catch((err) => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});