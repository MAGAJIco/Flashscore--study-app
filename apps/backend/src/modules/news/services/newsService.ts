
import { News } from "@/models";

export const newsService = {
  async getAllNews() {
    return await News.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(20);
  },

  async getNewsById(id: string) {
    return await News.findOne({ id: parseInt(id), isActive: true });
  },

  async createNews(data: any) {
    const lastNews = await News.findOne().sort({ id: -1 });
    const nextId = lastNews ? lastNews.id + 1 : 1;

    const news = new News({
      id: nextId,
      ...data,
      isActive: true,
      viewCount: 0
    });

    return await news.save();
  },

  async updateNews(id: string, data: any) {
    return await News.findOneAndUpdate(
      { id: parseInt(id) },
      data,
      { new: true }
    );
  },

  async deleteNews(id: string) {
    return await News.findOneAndUpdate(
      { id: parseInt(id) },
      { isActive: false },
      { new: true }
    );
  }
};
