
import { FastifyRequest, FastifyReply } from "fastify";
import { NewsAuthorService } from "../services/newsAuthorService";

export class NewsAuthorController {
  static async getAllAuthors(request: FastifyRequest, reply: FastifyReply) {
    try {
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

  static async getAuthorById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
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

  static async initializeDefaultAuthors(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
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

  static async getAuthorProfile(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const author = await NewsAuthorService.getAuthorById(id);

      if (!author) {
        return reply.code(404).send({
          success: false,
          message: "Author not found",
        });
      }

      // Get author's news articles
      const News = require('../../../models/News').News;
      const authorNews = await News.find({ 'author.id': id, isActive: true })
        .sort({ createdAt: -1 })
        .limit(10);

      const profile = {
        author: {
          id: author.id,
          name: author.name,
          icon: author.icon,
          bio: author.bio,
          expertise: author.expertise,
          collaborationCount: author.collaborationCount,
          lastCollaboration: author.lastCollaboration,
          isActive: author.isActive,
        },
        recentNews: authorNews,
        stats: {
          totalArticles: authorNews.length,
          totalViews: authorNews.reduce((sum: number, news: any) => sum + (news.viewCount || 0), 0),
        }
      };

      reply.code(200).send({
        success: true,
        data: profile,
        message: "Author profile fetched successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch author profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
