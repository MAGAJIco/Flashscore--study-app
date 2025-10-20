import { FastifyRequest, FastifyReply } from 'fastify';
import News from '../models/News';

// Define interfaces for request types
interface NewsParams {
  id: string;
}

interface CreateNewsBody {
  title: string;
  preview: string;
  fullContent: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
}

interface UpdateNewsBody {
  title?: string;
  preview?: string;
  fullContent?: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
  isActive?: boolean;
}

interface QueryWithAuth {
  auth?: string;
}

export class NewsController {
  // Get all active news
  static async getAllNews(
    req: FastifyRequest<{ Querystring: QueryWithAuth }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const news = await News.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(20);

      // Check user access level
      const authHeader = req.headers.authorization;
      const authQuery = req.query?.auth;
      const isValidAuth = authHeader?.includes('Bearer member') || authQuery === 'member';

      let responseData;

      if (isValidAuth) {
        // Member access - return full content
        responseData = news;
      } else {
        // Guest access - return preview only
        responseData = news.map(item => ({
          ...item.toObject(),
          fullContent: item.preview + '... [Member access required]',
          isPreview: true
        }));
      }

      res.send({
        success: true,
        data: responseData,
        count: responseData.length,
        accessLevel: isValidAuth ? 'member' : 'guest',
        memberBenefits: isValidAuth ? null : {
          message: 'Upgrade to member access for full articles, exclusive analysis, and premium features.',
          features: ['Full article content', 'Exclusive analysis', 'Premium predictions', 'Ad-free experience']
        }
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).send({
        success: false,
        message: 'Failed to fetch news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get single news item
  static async getNewsById(
    req: FastifyRequest<{ Params: NewsParams; Querystring: QueryWithAuth }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { id } = req.params;
      const news = await News.findOne({ id: parseInt(id), isActive: true });

      if (!news) {
        res.status(404).send({
          success: false,
          message: 'News item not found'
        });
        return;
      }

      // Check user access level
      const authHeader = req.headers.authorization;
      const authQuery = req.query?.auth;
      const isValidAuth = authHeader?.includes('Bearer member') || authQuery === 'member';

      let responseData;

      if (isValidAuth) {
        // Member access - return full content
        responseData = news;
        // Increment view count for members
        await News.findByIdAndUpdate(news._id, { $inc: { viewCount: 1 } });
      } else {
        // Guest access - return limited content
        responseData = {
          ...news.toObject(),
          fullContent: news.preview + '... [Member access required for full content]',
          isPreview: true,
          memberAccess: {
            required: true,
            message: 'Upgrade to member access to read the full article and unlock premium content.'
          }
        };
      }

      res.send({
        success: true,
        data: responseData,
        accessLevel: isValidAuth ? 'member' : 'guest'
      });
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      res.status(500).send({
        success: false,
        message: 'Failed to fetch news item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new news item
  static async createNews(
    req: FastifyRequest<{ Body: CreateNewsBody }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { title, preview, fullContent, author, tags, imageUrl } = req.body;

      // Get the next ID
      const lastNews = await News.findOne().sort({ id: -1 });
      const nextId = lastNews ? lastNews.id + 1 : 1;

      const news = new News({
        id: nextId,
        title,
        preview,
        fullContent,
        author: author || 'Admin',
        tags: tags || [],
        imageUrl
      });

      const savedNews = await news.save();

      res.status(201).send({
        success: true,
        data: savedNews,
        message: 'News created successfully'
      });
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(400).send({
        success: false,
        message: 'Failed to create news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update news item
  static async updateNews(
    req: FastifyRequest<{ Params: NewsParams; Body: UpdateNewsBody }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const news = await News.findOneAndUpdate(
        { id: parseInt(id) },
        updateData,
        { new: true, runValidators: true }
      );

      if (!news) {
        res.status(404).send({
          success: false,
          message: 'News item not found'
        });
        return;
      }

      res.send({
        success: true,
        data: news,
        message: 'News updated successfully'
      });
    } catch (error) {
      console.error('Error updating news:', error);
      res.status(400).send({
        success: false,
        message: 'Failed to update news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete news item (soft delete)
  static async deleteNews(
    req: FastifyRequest<{ Params: NewsParams }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { id } = req.params;

      const news = await News.findOneAndUpdate(
        { id: parseInt(id) },
        { isActive: false },
        { new: true }
      );

      if (!news) {
        res.status(404).send({
          success: false,
          message: 'News item not found'
        });
        return;
      }

      res.send({
        success: true,
        message: 'News deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      res.status(500).send({
        success: false,
        message: 'Failed to delete news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}