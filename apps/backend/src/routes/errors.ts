
import { FastifyPluginAsync } from 'fastify';
import { ErrorLog } from '../models/ErrorLog';

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
};

export default errorsRoutes;
