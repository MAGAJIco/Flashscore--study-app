import { NewsAuthor, INewsAuthor } from '../models/NewsAuthor.js';
import { News, INews } from '../models/News.js';

export class NewsAuthorService {
  // Create or update a news author
  static async createOrUpdateAuthor(authorData: {
    id: string;
    name: string;
    icon: string;
    bio?: string;
    expertise?: string[];
  }): Promise<INewsAuthor> {
    try {
      const existingAuthor = await NewsAuthor.findOne({ id: authorData.id });

      if (existingAuthor) {
        // Update existing author
        existingAuthor.name = authorData.name;
        existingAuthor.icon = authorData.icon;
        existingAuthor.bio = authorData.bio || existingAuthor.bio;
        existingAuthor.expertise = authorData.expertise || existingAuthor.expertise;
        existingAuthor.updatedAt = new Date();

        return await existingAuthor.save();
      } else {
        // Create new author
        const newAuthor = new NewsAuthor({
          id: authorData.id,
          name: authorData.name,
          icon: authorData.icon,
          bio: authorData.bio || '',
          expertise: authorData.expertise || [],
          collaborationCount: 0,
          isActive: true
        });

        return await newAuthor.save();
      }
    } catch (error) {
      throw new Error(`Failed to create/update author: ${error}`);
    }
  }

  // Get all active authors
  static async getActiveAuthors(): Promise<INewsAuthor[]> {
    try {
      return await NewsAuthor.find({ isActive: true })
        .sort({ collaborationCount: -1, createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch authors: ${error}`);
    }
  }

  // Get author by ID
  static async getAuthorById(authorId: string): Promise<INewsAuthor | null> {
    try {
      return await NewsAuthor.findOne({ id: authorId, isActive: true });
    } catch (error) {
      throw new Error(`Failed to fetch author: ${error}`);
    }
  }

  // Create news after collaboration
  static async createCollaborationNews(authorId: string, collaborationData: {
    title: string;
    preview: string;
    fullContent: string;
    collaborationType: 'prediction' | 'analysis' | 'community' | 'update';
    tags?: string[];
  }): Promise<INews> {
    try {
      // Find the author
      const author = await NewsAuthor.findOne({ id: authorId });
      if (!author) {
        throw new Error('Author not found');
      }

      // Increment collaboration count
      author.collaborationCount += 1;
      author.lastCollaboration = new Date();
      await author.save();

      // Get next news ID
      const lastNews = await News.findOne().sort({ id: -1 });
      const nextId = lastNews ? lastNews.id + 1 : 1;

      // Create the news article
      const newsData = new News({
        id: nextId,
        title: collaborationData.title,
        preview: collaborationData.preview,
        fullContent: collaborationData.fullContent,
        author: {
          id: author.id,
          name: author.name,
          icon: author.icon,
          bio: author.bio,
          expertise: author.expertise,
          collaborationCount: author.collaborationCount
        },
        collaborationType: collaborationData.collaborationType,
        tags: collaborationData.tags || [],
        isActive: true,
        viewCount: 0
      });

      return await newsData.save();
    } catch (error) {
      throw new Error(`Failed to create collaboration news: ${error}`);
    }
  }

  // Initialize default authors (including mara example)
  static async initializeDefaultAuthors(): Promise<void> {
    const defaultAuthors = [
      {
        id: 'mara',
        name: 'Mara',
        icon: '⚡',
        bio: 'Sports analytics expert specializing in predictive modeling and community insights',
        expertise: ['analytics', 'predictions', 'community']
      },
      {
        id: 'alex_sports',
        name: 'Alex Sports',
        icon: '⚽',
        bio: 'Football analyst with deep knowledge of team dynamics and player performance',
        expertise: ['football', 'analysis', 'tactics']
      },
      {
        id: 'sarah_stats',
        name: 'Sarah Stats',
        icon: '📊',
        bio: 'Data scientist focused on sports statistics and performance metrics',
        expertise: ['statistics', 'data', 'performance']
      }
    ];

    for (const authorData of defaultAuthors) {
      await this.createOrUpdateAuthor(authorData);
    }
  }

  // Generate automatic news after specific events
  static async generateAutoNews(authorId: string, eventType: string, eventData: any): Promise<INews | null> {
    try {
      const author = await this.getAuthorById(authorId);
      if (!author) return null;

      let newsContent = null;

      switch (eventType) {
        case 'prediction_success':
          newsContent = {
            title: `${author.name} Nails Another Prediction!`,
            preview: `${author.name} successfully predicted the ${eventData.matchName} outcome...`,
            fullContent: `${author.name} continues their impressive streak with another accurate prediction. The ${eventData.matchName} ended exactly as ${author.name} forecasted, bringing their collaboration count to ${author.collaborationCount + 1}. This success further establishes ${author.name} as a reliable voice in sports analysis.`,
            collaborationType: 'prediction' as const,
            tags: ['prediction', 'success', author.name.toLowerCase()]
          };
          break;

        case 'community_milestone':
          newsContent = {
            title: `${author.name} Reaches ${eventData.milestone} Collaborations!`,
            preview: `Celebrating ${author.name}'s incredible contribution to our community...`,
            fullContent: `We're excited to celebrate ${author.name} reaching ${eventData.milestone} collaborations! ${author.icon} ${author.name} has been instrumental in providing quality insights and analysis. From ${author.expertise.join(', ')}, ${author.name} continues to elevate our sports community.`,
            collaborationType: 'community' as const,
            tags: ['milestone', 'community', author.name.toLowerCase()]
          };
          break;

        case 'analysis_update':
          newsContent = {
            title: `Fresh Analysis from ${author.name}`,
            preview: `${author.name} shares new insights on ${eventData.topic}...`,
            fullContent: `${author.name} ${author.icon} has provided updated analysis on ${eventData.topic}. With expertise in ${author.expertise.join(', ')}, ${author.name} offers unique perspectives that help our community make better informed decisions. This latest collaboration adds to ${author.name}'s growing portfolio of valuable contributions.`,
            collaborationType: 'analysis' as const,
            tags: ['analysis', 'update', author.name.toLowerCase()]
          };
          break;
      }

      if (newsContent) {
        return await this.createCollaborationNews(authorId, newsContent);
      }

      return null;
    } catch (error) {
      console.error('Failed to generate auto news:', error);
      return null;
    }
  }
}


export const newsAuthorService = new NewsAuthorService();