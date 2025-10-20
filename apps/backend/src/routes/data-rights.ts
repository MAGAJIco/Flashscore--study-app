// apps/backend/src/routes/data-rights.ts
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest
} from 'fastify';
import { User as UserModel } from '../models/User';

interface ExportDataParams {
  Params: {
    childEmail: string;
  };
  Querystring: {
    parentEmail: string;
  };
}

interface DeleteDataBody {
  Body: {
    childEmail: string;
    parentEmail: string;
    confirmationCode: string;
  };
}

interface RectifyDataBody {
  Body: {
    childEmail: string;
    parentEmail: string;
    updates: Record<string, any>;
  };
}

export default async function dataRightsRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  /**
   * Export child's data (COPPA compliance)
   * Returns a ZIP file with JSON content
   */
  fastify.get<ExportDataParams>(
    '/export-data/:childEmail',
    async (request, reply) => {
      const { childEmail } = request.params;
      const { parentEmail } = request.query;

      if (!parentEmail) {
        return reply.status(400).send({
          error: 'parentEmail query parameter required'
        });
      }

      try {
        const user = await UserModel.findOne({ email: childEmail });
        if (!user) {
          return reply.status(404).send({ error: 'User not found' });
        }

        if (user.coppaConsent?.parentEmail !== parentEmail) {
          return reply.status(403).send({
            error: 'Unauthorized: parent email mismatch'
          });
        }

        const userData = {
          personalInfo: {
            username: user.username,
            email: user.email,
            age: user.age,
            createdAt: user.createdAt,
            lastActive: user.lastActive
          },
          consent: user.coppaConsent,
          preferences: user.preferences,
          accessRestrictions: user.accessRestrictions,
          exportedAt: new Date(),
          exportFormat: 'JSON'
        };

        reply.header('Content-Type', 'application/json');
        reply.header(
          'Content-Disposition',
          `attachment; filename="user-data-${childEmail}-${Date.now()}.json"`
        );

        return reply.send(userData);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Failed to export data' });
      }
    }
  );

  /**
   * Delete child's data (COPPA compliance)
   */
  fastify.post<DeleteDataBody>('/delete-data', async (request, reply) => {
    const { childEmail, parentEmail, confirmationCode } = request.body;

    if (!childEmail || !parentEmail || !confirmationCode) {
      return reply.status(400).send({
        error: 'childEmail, parentEmail, and confirmationCode required'
      });
    }

    try {
      const user = await UserModel.findOne({ email: childEmail });
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      if (user.coppaConsent?.parentEmail !== parentEmail) {
        return reply.status(403).send({
          error: 'Unauthorized: parent email mismatch'
        });
      }

      const deletionLog = {
        userId: user._id,
        userEmail: user.email,
        parentEmail,
        deletedAt: new Date(),
        requestIp: request.ip,
        confirmationCode
      };

      await UserModel.deleteOne({ _id: user._id });

      return reply.send({
        success: true,
        message: 'User data permanently deleted',
        deletionLog
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete data' });
    }
  });

  /**
   * Rectify/update child's profile data
   */
  fastify.post<RectifyDataBody>('/rectify-data', async (request, reply) => {
    const { childEmail, parentEmail, updates } = request.body;

    if (!childEmail || !parentEmail || !updates) {
      return reply.status(400).send({
        error: 'childEmail, parentEmail, and updates required'
      });
    }

    try {
      const user = await UserModel.findOne({ email: childEmail });
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      if (user.coppaConsent?.parentEmail !== parentEmail) {
        return reply.status(403).send({
          error: 'Unauthorized: parent email mismatch'
        });
      }

      const allowedFields = ['username', 'preferences'];
      const safeUpdates: any = {};

      for (const key of allowedFields) {
        if (updates[key] !== undefined) {
          safeUpdates[key] = updates[key];
        }
      }

      await user.updateOne(safeUpdates);

      return reply.send({
        success: true,
        message: 'Profile data updated successfully',
        updatedFields: Object.keys(safeUpdates)
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update data' });
    }
  });
}