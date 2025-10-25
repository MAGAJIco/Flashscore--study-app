
import { Request, Response, NextFunction } from 'fastify';

export class BackendErrorBoundary {
  static handle(error: Error, request: Request, reply: Response) {
    console.error('🚨 Backend Error Boundary caught:', error);

    // Log to monitoring service
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      path: request.url,
      method: request.method,
    };

    console.error('Error Log:', JSON.stringify(errorLog, null, 2));

    // Always return MagajiCo branding even on fatal errors
    return reply.status(500).send({
      success: false,
      service: 'MagajiCo Backend',
      error: error.message,
      message: 'Backend service encountered an error but is still running',
      timestamp: new Date().toISOString(),
    });
  }

  static wrap(handler: Function) {
    return async (request: Request, reply: Response) => {
      try {
        return await handler(request, reply);
      } catch (error) {
        return BackendErrorBoundary.handle(error as Error, request, reply);
      }
    };
  }
}

// Process-level error handlers
process.on('uncaughtException', (error) => {
  console.error('🚨 UNCAUGHT EXCEPTION - Backend Still Running:', error);
  // Don't exit - keep service alive
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION - Backend Still Running:', reason);
  // Don't exit - keep service alive
});
