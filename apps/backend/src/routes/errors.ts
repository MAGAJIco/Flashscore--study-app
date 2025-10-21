
import { FastifyPluginAsync } from 'fastify';
import { ErrorLog } from '../models/ErrorLog.js';

const errorsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all errors with filtering
  fastify.get('/errors', async (request, reply) => {
    try {
      const { type, severity, resolved, limit = 50 } = request.query as any;
      
      const filter: any = {};
      if (type) filter.type = type;
      if (severity) filter.severity = severity;
      if (resolved !== undefined) filter.resolved = resolved === 'true';

      const errors = await ErrorLog.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      const stats = await ErrorLog.aggregate([
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 }
          }
        }
      ]);

      return reply.send({
        success: true,
        data: errors,
        stats: stats.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {} as Record<string, number>),
        total: errors.length
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error fetching error logs');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch error logs'
      });
    }
  });

  // Get error by ID
  fastify.get('/errors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const error = await ErrorLog.findById(id);

      if (!error) {
        return reply.status(404).send({
          success: false,
          error: 'Error log not found'
        });
      }

      return reply.send({
        success: true,
        data: error
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error fetching error log');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch error log'
      });
    }
  });

  // Mark error as resolved
  fastify.patch('/errors/:id/resolve', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const error = await ErrorLog.findByIdAndUpdate(
        id,
        { resolved: true },
        { new: true }
      );

      if (!error) {
        return reply.status(404).send({
          success: false,
          error: 'Error log not found'
        });
      }

      return reply.send({
        success: true,
        data: error
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error resolving error log');
      return reply.status(500).send({
        success: false,
        error: 'Failed to resolve error log'
      });
    }
  });

  // Error statistics dashboard
  fastify.get('/errors/stats/dashboard', async (request, reply) => {
    try {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [total, recent, bySeverity, byType, unresolved] = await Promise.all([
        ErrorLog.countDocuments(),
        ErrorLog.countDocuments({ createdAt: { $gte: last24Hours } }),
        ErrorLog.aggregate([
          { $group: { _id: '$severity', count: { $sum: 1 } } }
        ]),
        ErrorLog.aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        ErrorLog.countDocuments({ resolved: false })
      ]);

      return reply.send({
        success: true,
        dashboard: {
          total,
          last24Hours: recent,
          unresolved,
          bySeverity: bySeverity.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
          }, {} as Record<string, number>),
          byType: byType.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
          }, {} as Record<string, number>)
        }
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error fetching error stats');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch error statistics'
      });
    }
  });

  // Log a new error (internal use)
  fastify.post('/errors/log', async (request, reply) => {
    try {
      const errorData = request.body as any;
      const errorLog = new ErrorLog(errorData);
      await errorLog.save();

      return reply.status(201).send({
        success: true,
        data: errorLog
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error logging error');
      return reply.status(500).send({
        success: false,
        error: 'Failed to log error'
      });
    }
  });

  // Error pattern analysis
  fastify.get('/errors/patterns', async (request, reply) => {
    try {
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const patterns = await ErrorLog.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        {
          $group: {
            _id: {
              message: { $substr: ['$message', 0, 50] },
              type: '$type',
              severity: '$severity'
            },
            count: { $sum: 1 },
            lastOccurrence: { $max: '$createdAt' },
            sources: { $addToSet: '$source' }
          }
        },
        { $match: { count: { $gte: 3 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      return reply.send({
        success: true,
        patterns: patterns.map(p => ({
          pattern: p._id.message,
          type: p._id.type,
          severity: p._id.severity,
          frequency: p.count,
          lastOccurrence: p.lastOccurrence,
          affectedSources: p.sources
        }))
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error analyzing patterns');
      return reply.status(500).send({
        success: false,
        error: 'Failed to analyze error patterns'
      });
    }
  });

  // Error trend analysis
  fastify.get('/errors/trends', async (request, reply) => {
    try {
      const { days = 7 } = request.query as any;
      const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

      const trends = await ErrorLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              type: '$type',
              severity: '$severity'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]);

      return reply.send({
        success: true,
        trends
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error analyzing trends');
      return reply.status(500).send({
        success: false,
        error: 'Failed to analyze error trends'
      });
    }
  });

  // Auto-resolve similar errors
  fastify.post('/errors/auto-resolve', async (request, reply) => {
    try {
      const { pattern, resolveAll = false } = request.body as any;

      const filter: any = { resolved: false };
      if (pattern) {
        filter.message = { $regex: pattern, $options: 'i' };
      }

      const result = await ErrorLog.updateMany(
        filter,
        { $set: { resolved: true, metadata: { autoResolved: true } } }
      );

      return reply.send({
        success: true,
        resolvedCount: result.modifiedCount
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error auto-resolving');
      return reply.status(500).send({
        success: false,
        error: 'Failed to auto-resolve errors'
      });
    }
  });
};

export default errorsRoutes;
