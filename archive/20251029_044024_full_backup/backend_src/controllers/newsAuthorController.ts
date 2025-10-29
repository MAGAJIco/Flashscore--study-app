// apps/backend/src/controllers/newsAuthorController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { NewsAuthorService } from "@/services";

export class NewsAuthorController {
  // GET /api/news-authors - Get all active authors
  static async getAllAuthors(request: FastifyRequest, reply: FastifyReply) {
    try {
      // ✅ FIXED: Call static method on class
      const authors = await NewsAuthorService.getActiveAuthors();

      reply.code(200).send({
        success: true,
        data: authors,
        message: "Authors fetched successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch authors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/news-authors/:id - Get author by ID
  static async getAuthorById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      // ✅ FIXED: Call static method on class
      const author = await NewsAuthorService.getAuthorById(id);

      if (!author) {
        return reply.code(404).send({
          success: false,
          message: "Author not found",
        });
      }

      reply.code(200).send({
        success: true,
        data: author,
        message: "Author fetched successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch author",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors - Create or update author
  static async createOrUpdateAuthor(
    request: FastifyRequest<{
      Body: {
        id: string;
        name: string;
        icon: string;
        bio?: string;
        expertise?: string[];
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const authorData = request.body;

      if (!authorData.id || !authorData.name || !authorData.icon) {
        return reply.code(400).send({
          success: false,
          message: "Author ID, name, and icon are required",
        });
      }

      // ✅ FIXED: Call static method on class
      const author = await NewsAuthorService.createOrUpdateAuthor(authorData);

      reply.code(200).send({
        success: true,
        data: author,
        message: "Author created/updated successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to create/update author",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors/:id/collaborate - Create news from collaboration
  static async createCollaborationNews(
    request: FastifyRequest<{
      Params: { id: string };
      Body: {
        title: string;
        preview: string;
        fullContent: string;
        collaborationType: "prediction" | "analysis" | "community" | "update";
        tags?: string[];
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const collaborationData = request.body;

      if (
        !collaborationData.title ||
        !collaborationData.preview ||
        !collaborationData.fullContent
      ) {
        return reply.code(400).send({
          success: false,
          message: "Title, preview, and full content are required",
        });
      }

      // ✅ FIXED: Call static method on class
      const news = await NewsAuthorService.createCollaborationNews(
        id,
        collaborationData,
      );

      reply.code(201).send({
        success: true,
        data: news,
        message: "Collaboration news created successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to create collaboration news",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors/auto-news - Generate automatic news
  static async generateAutoNews(
    request: FastifyRequest<{
      Body: {
        authorId: string;
        eventType: string;
        eventData: any;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { authorId, eventType, eventData } = request.body;

      if (!authorId || !eventType) {
        return reply.code(400).send({
          success: false,
          message: "Author ID and event type are required",
        });
      }

      // ✅ FIXED: Call static method on class
      const news = await NewsAuthorService.generateAutoNews(
        authorId,
        eventType,
        eventData,
      );

      if (!news) {
        return reply.code(400).send({
          success: false,
          message: "Could not generate news for this event",
        });
      }

      reply.code(201).send({
        success: true,
        data: news,
        message: "Auto news generated successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to generate auto news",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors/initialize - Initialize default authors
  static async initializeDefaultAuthors(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      // ✅ FIXED: Call static method on class
      await NewsAuthorService.initializeDefaultAuthors();

      reply.code(200).send({
        success: true,
        message: "Default authors initialized successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to initialize default authors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}