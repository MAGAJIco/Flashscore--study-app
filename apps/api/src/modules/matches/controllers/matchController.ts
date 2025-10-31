
import { FastifyRequest, FastifyReply } from 'fastify';
import { Match } from '../../../models/Match';

interface MatchParams {
  id: string;
}

interface MatchQuery {
  status?: string;
  limit?: string;
}

export const matchController = {
  async getAllMatches(req: FastifyRequest<{ Querystring: MatchQuery }>, res: FastifyReply) {
    try {
      const limit = parseInt(req.query.limit || '20');
      const query: any = {};
      
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      const matches = await Match.find(query)
        .sort({ date: -1 })
        .limit(limit);
      
      res.send({ success: true, data: matches, count: matches.length });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch matches' });
    }
  },

  async getLiveMatches(req: FastifyRequest, res: FastifyReply) {
    try {
      const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
      
      const matches = await Match.find({
        $or: [
          { status: { $in: ['live', 'in_progress', '1H', '2H'] } },
          { 
            status: 'scheduled',
            date: { $lte: twoHoursFromNow, $gte: new Date() }
          }
        ]
      }).sort({ date: 1 }).limit(50);
      
      res.send({ success: true, data: matches, count: matches.length });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch live matches' });
    }
  },

  async getUpcomingMatches(req: FastifyRequest<{ Querystring: MatchQuery }>, res: FastifyReply) {
    try {
      const limit = parseInt(req.query.limit || '10');
      const matches = await Match.find({
        date: { $gte: new Date() },
        status: { $in: ['scheduled', 'upcoming'] }
      }).sort({ date: 1 }).limit(limit);
      
      res.send({ success: true, data: matches, count: matches.length });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch upcoming matches' });
    }
  },

  async getMatchById(req: FastifyRequest<{ Params: MatchParams }>, res: FastifyReply) {
    try {
      const match = await Match.findById(req.params.id);
      
      if (!match) {
        return res.status(404).send({ success: false, error: 'Match not found' });
      }
      
      res.send({ success: true, data: match });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch match' });
    }
  },

  async createMatch(req: FastifyRequest, res: FastifyReply) {
    try {
      const match = new Match(req.body);
      await match.save();
      
      res.status(201).send({ success: true, data: match });
    } catch (error) {
      req.log.error(error);
      res.status(400).send({ success: false, error: 'Failed to create match' });
    }
  },

  async updateMatch(req: FastifyRequest<{ Params: MatchParams }>, res: FastifyReply) {
    try {
      const match = await Match.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!match) {
        return res.status(404).send({ success: false, error: 'Match not found' });
      }
      
      res.send({ success: true, data: match });
    } catch (error) {
      req.log.error(error);
      res.status(400).send({ success: false, error: 'Failed to update match' });
    }
  }
};
