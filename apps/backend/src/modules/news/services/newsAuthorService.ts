
import { NewsAuthor } from "@/models";

export const newsAuthorService = {
  async getAllAuthors() {
    return await NewsAuthor.find({ isActive: true })
      .sort({ collaborationCount: -1 });
  },

  async getAuthorById(id: string) {
    return await NewsAuthor.findOne({ id, isActive: true });
  },

  async createAuthor(data: any) {
    const author = new NewsAuthor({
      ...data,
      collaborationCount: 0,
      isActive: true
    });
    return await author.save();
  },

  async updateAuthor(id: string, data: any) {
    return await NewsAuthor.findOneAndUpdate(
      { id },
      data,
      { new: true }
    );
  }
};
