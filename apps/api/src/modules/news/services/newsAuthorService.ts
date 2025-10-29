
import { NewsAuthor } from "../../../models/NewsAuthor";

export class NewsAuthorService {
  static async getActiveAuthors() {
    return await NewsAuthor.find({ isActive: true })
      .sort({ collaborationCount: -1 });
  }

  static async getAuthorById(id: string) {
    return await NewsAuthor.findOne({ id, isActive: true });
  }

  static async createOrUpdateAuthor(data: any) {
    const author = await NewsAuthor.findOneAndUpdate(
      { id: data.id },
      {
        ...data,
        isActive: true
      },
      { new: true, upsert: true }
    );
    return author;
  }

  static async createCollaborationNews(authorId: string, data: any) {
    const author = await this.getAuthorById(authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    const News = require('../../../models/News').News;
    const lastNews = await News.findOne().sort({ id: -1 });
    const nextId = lastNews ? lastNews.id + 1 : 1;

    const news = new News({
      id: nextId,
      title: data.title,
      preview: data.preview,
      fullContent: data.fullContent,
      author: {
        id: author.id,
        name: author.name,
        icon: author.icon,
        bio: author.bio,
        expertise: author.expertise,
        collaborationCount: author.collaborationCount
      },
      collaborationType: data.collaborationType,
      tags: data.tags || [],
      isActive: true
    });

    await news.save();

    author.collaborationCount += 1;
    author.lastCollaboration = new Date();
    await author.save();

    return news;
  }

  static async generateAutoNews(authorId: string, eventType: string, eventData: any) {
    const templates: Record<string, any> = {
      prediction_success: {
        title: `🎯 ${eventData.matchName} - Prediction Success!`,
        preview: `Accurate prediction for ${eventData.matchName} with ${eventData.confidence}% confidence`,
        fullContent: `Our AI successfully predicted the outcome of ${eventData.matchName}. The model showed ${eventData.confidence}% confidence in this prediction, demonstrating the power of data-driven sports analysis.`,
        collaborationType: 'prediction' as const,
        tags: ['prediction', 'success', 'ai']
      },
      community_milestone: {
        title: `🎉 ${eventData.milestone} Predictions Milestone!`,
        preview: `Celebrating ${eventData.milestone} successful predictions`,
        fullContent: `We've reached an incredible milestone of ${eventData.milestone} predictions! Thank you to our amazing community for your continued support and engagement.`,
        collaborationType: 'community' as const,
        tags: ['milestone', 'community']
      },
      analysis_update: {
        title: `📊 New Analysis: ${eventData.topic}`,
        preview: `Expert analysis on ${eventData.topic}`,
        fullContent: `In-depth analysis of ${eventData.topic}, providing insights and data-driven takeaways for the community.`,
        collaborationType: 'analysis' as const,
        tags: ['analysis', 'update']
      }
    };

    const template = templates[eventType];
    if (!template) {
      return null;
    }

    return await this.createCollaborationNews(authorId, template);
  }

  static async initializeDefaultAuthors() {
    const defaultAuthors = [
      {
        id: 'mara',
        name: 'Mara AI',
        icon: '🤖',
        bio: 'AI-powered prediction specialist',
        expertise: ['predictions', 'machine-learning', 'analytics']
      },
      {
        id: 'alex_sports',
        name: 'Alex Sports',
        icon: '⚽',
        bio: 'Sports analyst and commentator',
        expertise: ['football', 'analysis', 'live-commentary']
      },
      {
        id: 'sarah_stats',
        name: 'Sarah Stats',
        icon: '📊',
        bio: 'Statistical analysis expert',
        expertise: ['statistics', 'data-science', 'trends']
      }
    ];

    for (const author of defaultAuthors) {
      await this.createOrUpdateAuthor(author);
    }
  }
}
