
import { Match } from "@/models";

export const matchService = {
  async getAllMatches(limit: number = 20, status?: string, competition?: string) {
    const query: any = {};
    if (status) query.status = status;
    if (competition) query.competition = new RegExp(competition, 'i');

    return await Match.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .populate('predictions');
  },

  async createMatch(data: any) {
    const match = new Match({
      ...data,
      scrapedAt: new Date()
    });
    await match.save();
    return match;
  },

  async getMatchById(id: string) {
    return await Match.findById(id).populate('predictions');
  },

  async getLiveMatches() {
    return await Match.find({ 
      status: { $in: ["live", "in_progress", "1H", "2H"] } 
    })
      .sort({ date: -1 })
      .limit(50);
  },

  async getUpcomingMatches(limit: number = 10) {
    return await Match.find({
      date: { $gte: new Date() },
      status: { $in: ["scheduled", "live"] }
    })
      .sort({ date: 1 })
      .limit(limit);
  },

  async getTodayMatches(limit: number = 20) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Match.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({ date: 1 })
      .limit(limit)
      .populate('predictions');
  },

  async updateMatch(id: string, data: any) {
    return await Match.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteMatch(id: string) {
    return await Match.findByIdAndDelete(id);
  }
};
