import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class BackendErrorBoundary {
  static handle(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
    const statusCode = error.statusCode || 500;
    
    request.log.error({
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
    });

    reply.status(statusCode).send({
      error: true,
      message: error.message || 'Internal Server Error',
      statusCode,
    });
  }
}
