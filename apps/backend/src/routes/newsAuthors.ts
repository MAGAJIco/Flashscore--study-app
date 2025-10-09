import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { NewsAuthorController } from '../controllers/newsAuthorController';
import { authMiddleware } from '../middleware/authMiddleware';
import { NewsAuthorService } from '../services/newsAuthorService';

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

  // Get all authors with leaderboard
  fastify.get('/api/news-authors', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { limit = 10 } = request.query as { limit?: number };
      const authors = await NewsAuthorService.getActiveAuthors();

      return reply.send({
        success: true,
        authors,
        total: authors.length
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error fetching news authors');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch news authors'
      });
    }
  });

  // Get single author by ID
  fastify.get('/api/news-authors/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const author = await NewsAuthorService.getAuthorById(id);

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
      fastify.log.error({ err: error }, 'Error fetching author');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch author'
      });
    }
  });

  // Get all authors (alternate endpoint)
  fastify.get('/news-authors', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    return NewsAuthorController.getAllAuthors(request, reply);
  });

  // Get single author (alternate endpoint)
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
  }, async (request: any, reply: FastifyReply) => {
    return NewsAuthorController.createOrUpdateAuthor(request, reply);
  });

  // Create collaboration
  fastify.post<{ Params: { id: string }; Body: CreateCollaborationBody }>(
    '/:id/collaborations',
    async (request, reply) => {
      // TODO: Implement collaboration tracking service
      // await collaborationService.trackCollaborationEvent(request as any, {
      //   ...collaboration event data
      // });
      return NewsAuthorController.createCollaborationNews(request, reply);
    });

  // Auto-generate news
  fastify.post('/news-authors/auto-news', {
    preHandler: authMiddleware.requireMemberAccess
  }, async (request: any, reply: FastifyReply) => {
    return NewsAuthorController.generateAutoNews(request, reply);
  });

  // ----- Routes for Internal Use (e.g., testing, specific API endpoints) -----

  // Get top authors (using getActiveAuthors instead)
  fastify.get('/authors/top', async (request, reply) => {
    try {
      const { limit = 10 } = request.query as any;
      const authors = await NewsAuthorService.getActiveAuthors();
      
      // Sort by collaboration count and limit
      const topAuthors = authors
        .sort((a, b) => (b.collaborationCount || 0) - (a.collaborationCount || 0))
        .slice(0, parseInt(limit));

      return reply.send({
        success: true,
        data: topAuthors
      });
    } catch (error) {
      fastify.log.error(error, 'Error fetching top authors');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch top authors'
      });
    }
  });

  // Get single author by ID
  fastify.get('/authors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const author = await NewsAuthorService.getAuthorById(id);

      if (!author) {
        return reply.status(404).send({
          success: false,
          error: 'Author not found'
        });
      }

      return reply.send({
        success: true,
        data: author
      });
    } catch (error) {
      fastify.log.error(error, 'Error fetching author');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch author'
      });
    }
  });

  // Create author (using createOrUpdateAuthor)
  fastify.post('/authors', async (request, reply: FastifyReply) => {
    try {
      const { id, name, icon, bio, expertise } = request.body as CreateAuthorBody;
      const newAuthor = await NewsAuthorService.createOrUpdateAuthor({
        id,
        name,
        icon,
        bio,
        expertise
      });

      return reply.status(201).send({
        success: true,
        author: newAuthor
      });
    } catch (error) {
      fastify.log.error(error, 'Error creating author');
      return reply.status(500).send({
        success: false,
        error: 'Failed to create author'
      });
    }
  });

  // Track collaboration event
  fastify.post('/authors/track-event', async (request, reply: FastifyReply) => {
    try {
      const { authorId, eventType, eventData } = request.body as {
        authorId: string;
        eventType: string;
        eventData: any;
      };

      // Track collaboration event (service not yet implemented)
      // await collaborationService.trackEvent({
      //   authorId: authorId,
      //   eventType: eventType,
      //   eventData: eventData
      // });

      return reply.send({
        success: true,
        message: 'Event tracked successfully (simulation)'
      });
    } catch (error) {
      fastify.log.error(error, 'Error tracking event');
      return reply.status(500).send({
        success: false,
        error: 'Failed to track event'
      });
    }
  });
}