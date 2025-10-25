import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { newsAuthorService } from '@/services';

export async function authorsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // TODO: Fetch from database
      const authors: any[] = [];

      return reply.send({
        success: true,
        data: authors,
        count: authors.length
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error fetching authors');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch authors'
      });
    }
  });
}