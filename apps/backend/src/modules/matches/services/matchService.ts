
import { Match } from "@/models";

export const matchService = {
  async getAllMatches() {
    return await Match.find().sort({ date: -1 });
  },

  async createMatch(data: any) {
    const match = new Match(data);
    await match.save();
    return match;
  },

  async getMatchById(id: string) {
    return await Match.findById(id);
  },

  async getLiveMatches() {
    return await Match.find({ status: "live" }).sort({ date: -1 });
  },

  async updateMatch(id: string, data: any) {
    return await Match.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteMatch(id: string) {
    return await Match.findByIdAndDelete(id);
  }
};
