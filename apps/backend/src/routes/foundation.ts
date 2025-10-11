import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Foundation from '../models/Foundation';

interface FoundationParams {
  userId: string;
}

interface StartBuildingBody {
  phaseId: string;
}

interface CompletePhaseBody {
  phaseId: string;
}

export async function foundationRoutes(server: FastifyInstance) {
  // Get user's foundation progress
  server.get<{ Params: FoundationParams }>(
    '/foundation/:userId',
    async (request: FastifyRequest<{ Params: FoundationParams }>, reply: FastifyReply) => {
      try {
        const { userId } = request.params;

        let foundation = await Foundation.findOne({ userId });

        // Initialize foundation for new user
        if (!foundation) {
          foundation = new Foundation({
            userId,
            totalPower: 0,
            phases: (Foundation as any).getDefaultPhases()
          });
          await foundation.save();
        }

        return reply.send({
          success: true,
          data: foundation
        });
      } catch (error) {
        request.log.error({ error }, 'Error fetching foundation');
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch foundation progress'
        });
      }
    }
  );

  // Start building a phase
  server.post<{ Params: FoundationParams; Body: StartBuildingBody }>(
    '/foundation/:userId/start-building',
    async (request: FastifyRequest<{ Params: FoundationParams; Body: StartBuildingBody }>, reply: FastifyReply) => {
      try {
        const { userId } = request.params;
        const { phaseId } = request.body;

        const foundation = await Foundation.findOne({ userId });

        if (!foundation) {
          return reply.status(404).send({
            success: false,
            error: 'Foundation not found'
          });
        }

        // Find the phase
        const phase = foundation.phases.find(p => p.id === phaseId);

        if (!phase) {
          return reply.status(404).send({
            success: false,
            error: 'Phase not found'
          });
        }

        // Check if phase is unlocked
        if (!phase.unlocked) {
          return reply.status(400).send({
            success: false,
            error: 'Phase is not unlocked yet'
          });
        }

        // Check if already completed
        if (phase.completed) {
          return reply.status(400).send({
            success: false,
            error: 'Phase already completed'
          });
        }

        // Set phase as building
        phase.building = true;

        await foundation.save();

        return reply.send({
          success: true,
          data: foundation
        });
      } catch (error) {
        request.log.error({ error }, 'Error starting phase build');
        return reply.status(500).send({
          success: false,
          error: 'Failed to start building phase'
        });
      }
    }
  );

  // Complete a phase
  server.post<{ Params: FoundationParams; Body: CompletePhaseBody }>(
    '/foundation/:userId/complete-phase',
    async (request: FastifyRequest<{ Params: FoundationParams; Body: CompletePhaseBody }>, reply: FastifyReply) => {
      try {
        const { userId } = request.params;
        const { phaseId } = request.body;

        const foundation = await Foundation.findOne({ userId });

        if (!foundation) {
          return reply.status(404).send({
            success: false,
            error: 'Foundation not found'
          });
        }

        // Find the phase
        const phase = foundation.phases.find(p => p.id === phaseId);

        if (!phase) {
          return reply.status(404).send({
            success: false,
            error: 'Phase not found'
          });
        }

        // Install all components and calculate power boost
        let powerBoost = 0;
        phase.components.forEach(component => {
          if (!component.installed) {
            component.installed = true;
            powerBoost += component.powerBoost;
          }
        });

        // Update phase status
        phase.building = false;
        phase.completed = true;

        // Update total power
        foundation.totalPower += powerBoost;

        // Unlock next phases based on new power
        foundation.phases.forEach(p => {
          if (foundation.totalPower >= p.requiredPower && !p.completed) {
            p.unlocked = true;
          }
        });

        await foundation.save();

        return reply.send({
          success: true,
          data: foundation,
          powerBoost
        });
      } catch (error) {
        request.log.error({ error }, 'Error completing phase');
        return reply.status(500).send({
          success: false,
          error: 'Failed to complete phase'
        });
      }
    }
  );

  // Reset foundation progress
  server.post<{ Params: FoundationParams }>(
    '/foundation/:userId/reset',
    async (request: FastifyRequest<{ Params: FoundationParams }>, reply: FastifyReply) => {
      try {
        const { userId } = request.params;

        const foundation = await Foundation.findOneAndUpdate(
          { userId },
          {
            totalPower: 0,
            phases: (Foundation as any).getDefaultPhases()
          },
          { new: true, upsert: true }
        );

        return reply.send({
          success: true,
          data: foundation,
          message: 'Foundation reset successfully'
        });
      } catch (error) {
        request.log.error({ error }, 'Error resetting foundation');
        return reply.status(500).send({
          success: false,
          error: 'Failed to reset foundation'
        });
      }
    }
  );

  // Get leaderboard (top users by total power)
  server.get('/foundation/leaderboard', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const leaderboard = await Foundation.find()
        .sort({ totalPower: -1 })
        .limit(10)
        .select('userId totalPower phases');

      const formatted = leaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        totalPower: entry.totalPower,
        completedPhases: entry.phases.filter(p => p.completed).length,
        totalPhases: entry.phases.length
      }));

      return reply.send({
        success: true,
        data: formatted
      });
    } catch (error) {
      request.log.error({ error }, 'Error fetching leaderboard');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch leaderboard'
      });
    }
  });
}
