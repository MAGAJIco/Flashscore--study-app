// apps/backend/src/controllers/newsController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { News, INews } from '@/models/News'; // Named import with interface

// Request/Body interfaces
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
  isActive?: boolean;
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
      const news: INews[] = await News.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(20);

      // Check access
      const authHeader = req.headers.authorization;
      const authQuery = req.query?.auth;
      const isMember = authHeader?.includes('Bearer member') || authQuery === 'member';

      const responseData = isMember
        ? news
        : news.map((item: INews) => ({
            ...item.toObject(),
            fullContent: item.preview + '... [Member access required]',
            isPreview: true
          }));

      res.send({
        success: true,
        data: responseData,
        count: responseData.length,
        accessLevel: isMember ? 'member' : 'guest',
        memberBenefits: isMember
          ? null
          : {
              message: 'Upgrade to member access for full articles, exclusive analysis, and premium features.',
              features: ['Full article content', 'Exclusive analysis', 'Premium predictions', 'Ad-free experience']
            }
      });
    } catch (error) {
      req.log.error(error, 'Error fetching news');
      res.status(500).send({
        success: false,
        message: 'Failed to fetch news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get single news item by ID
  static async getNewsById(
    req: FastifyRequest<{ Params: NewsParams; Querystring: QueryWithAuth }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { id } = req.params;
      const news: INews | null = await News.findOne({ id: parseInt(id), isActive: true });

      if (!news) {
        res.status(404).send({ success: false, message: 'News item not found' });
        return;
      }

      const authHeader = req.headers.authorization;
      const authQuery = req.query?.auth;
      const isMember = authHeader?.includes('Bearer member') || authQuery === 'member';

      const responseData = isMember
        ? news
        : {
            ...news.toObject(),
            fullContent: news.preview + '... [Member access required]',
            isPreview: true,
            memberAccess: {
              required: true,
              message: 'Upgrade to member access to read full article and unlock premium content.'
            }
          };

      // Increment view count for members
      if (isMember) {
        await News.findByIdAndUpdate(news._id, { $inc: { viewCount: 1 } });
      }

      res.send({
        success: true,
        data: responseData,
        accessLevel: isMember ? 'member' : 'guest'
      });
    } catch (error) {
      req.log.error(error, 'Error fetching news by ID');
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
      const { title, preview, fullContent, author, tags, imageUrl, isActive } = req.body;

      const lastNews = await News.findOne().sort({ id: -1 });
      const nextId = lastNews ? lastNews.id + 1 : 1;

      const news = new News({
        id: nextId,
        title,
        preview,
        fullContent,
        author: author || 'Admin',
        tags: tags || [],
        imageUrl,
        isActive: isActive ?? true
      });

      const savedNews = await news.save();

      res.status(201).send({
        success: true,
        data: savedNews,
        message: 'News created successfully'
      });
    } catch (error) {
      req.log.error(error, 'Error creating news');
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

      const news: INews | null = await News.findOneAndUpdate(
        { id: parseInt(id) },
        updateData,
        { new: true, runValidators: true }
      );

      if (!news) {
        res.status(404).send({ success: false, message: 'News item not found' });
        return;
      }

      res.send({ success: true, data: news, message: 'News updated successfully' });
    } catch (error) {
      req.log.error(error, 'Error updating news');
      res.status(400).send({
        success: false,
        message: 'Failed to update news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Soft delete news
  static async deleteNews(
    req: FastifyRequest<{ Params: NewsParams }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { id } = req.params;

      const news: INews | null = await News.findOneAndUpdate(
        { id: parseInt(id) },
        { isActive: false },
        { new: true }
      );

      if (!news) {
        res.status(404).send({ success: false, message: 'News item not found' });
        return;
      }

      res.send({ success: true, message: 'News deleted successfully' });
    } catch (error) {
      req.log.error(error, 'Error deleting news');
      res.status(500).send({
        success: false,
        message: 'Failed to delete news',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}