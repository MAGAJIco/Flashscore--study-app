import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { NewsAuthorController } from '../controllers/newsAuthorController';
import { authMiddleware } from '../middleware/authMiddleware';

// ==== Request Body Interfaces (DTOs) ====
interface CreateAuthorBody {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise?: string[];
}

interface CreateCollaborationBody {
  title: string;
  preview: string;
  fullContent: string;
  collaborationType: 'prediction' | 'analysis' | 'community' | 'update';
  tags?: string[];
}

// ==== Routes ====
export default async function newsAuthorsRoutes(fastify: FastifyInstance) {
  // ----- Public Routes -----

  // Get all authors
  fastify.get('/news-authors', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.getAllAuthors(request, reply);
  });

  // Get single author
  fastify.get('/news-authors/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.getAuthorById(request, reply);
  });

  // Initialize default authors
  fastify.post('/news-authors/initialize', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.initializeDefaultAuthors(request, reply);
  });


  // ----- Member Routes (Require Auth) -----

  // Create or update author
  fastify.post('/news-authors', {
    preHandler: authMiddleware.requireMemberAccess
  }, async (
    request: FastifyRequest<{ Body: CreateAuthorBody }>,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.createOrUpdateAuthor(request, reply);
  });

  // Create collaboration
  fastify.post('/news-authors/:id/collaborate', {
    preHandler: authMiddleware.requireMemberAccess
  }, async (
    request: FastifyRequest<{ Params: { id: string }, Body: CreateCollaborationBody }>,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.createCollaborationNews(request, reply);
  });

  // Auto-generate news
  fastify.post('/news-authors/auto-news', {
    preHandler: authMiddleware.requireMemberAccess
  }, async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.generateAutoNews(request, reply);
  });

}
import { FastifyInstance } from 'fastify';
import { newsAuthorService } from '../services/newsAuthorService';

export default async function newsAuthorsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/news-authors', async (request, reply) => {
    try {
      const { limit = 10 } = request.query as { limit?: number };
      const authors = await newsAuthorService.getTopAuthors(Number(limit));
      
      return reply.send({
        success: true,
        authors,
        total: authors.length
      });
    } catch (error) {
      fastify.log.error('Error fetching news authors:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch news authors'
      });
    }
  });

  fastify.get('/api/news-authors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const author = await newsAuthorService.getAuthorById(id);
      
      if (!author) {
        return reply.status(404).send({
          success: false,
          error: 'Author not found'
        });
      }
      
      return reply.send({
        success: true,
        author
      });
    } catch (error) {
      fastify.log.error('Error fetching author:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch author'
      });
    }
  });
}
