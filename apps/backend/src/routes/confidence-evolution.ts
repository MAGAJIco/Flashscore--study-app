
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

interface ConfidenceFactor {
  name: string;
  impact: number;
  timestamp: Date;
  description: string;
}

interface ConfidenceSnapshot {
  timestamp: Date;
  confidence: number;
  factors: ConfidenceFactor[];
}

interface ConfidenceEvolutionData {
  predictionId: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialPrediction: string;
  currentPrediction: string;
  timeline: ConfidenceSnapshot[];
  currentConfidence: number;
  initialConfidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  keyEvents: string[];
}

interface UpdateFactorBody {
  predictionId: string;
  factorName: string;
  impact: number;
  description: string;
}

export const confidenceEvolutionRoutes: FastifyPluginAsync = async (fastify) => {
  
  // Get confidence evolution for a prediction
  fastify.get<{ Params: { predictionId: string } }>(
    '/:predictionId',
    async (request: FastifyRequest<{ Params: { predictionId: string } }>, reply: FastifyReply) => {
      try {
        const { predictionId } = request.params;

        // Mock data - replace with database query
        const evolution: ConfidenceEvolutionData = {
          predictionId,
          matchId: 'match_001',
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          initialPrediction: 'Over 2.5 Goals',
          currentPrediction: 'Over 2.5 Goals',
          timeline: [
            {
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
              confidence: 75,
              factors: [
                {
                  name: 'Initial Analysis',
                  impact: 0,
                  timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
                  description: 'Based on team statistics and historical data'
                }
              ]
            }
          ],
          currentConfidence: 75,
          initialConfidence: 75,
          trend: 'stable',
          keyEvents: []
        };

        return reply.send({
          success: true,
          data: evolution,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        fastify.log.error({ err: error }, 'Confidence evolution fetch error');
        return reply.status(500).send({
          error: 'Failed to fetch confidence evolution',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Update confidence with new factor
  fastify.post<{ Body: UpdateFactorBody }>(
    '/update',
    async (request: FastifyRequest<{ Body: UpdateFactorBody }>, reply: FastifyReply) => {
      try {
        const { predictionId, factorName, impact, description } = request.body;

        if (!predictionId || !factorName || impact === undefined) {
          return reply.status(400).send({
            error: 'Missing required fields: predictionId, factorName, impact'
          });
        }

        // Calculate new confidence
        const newSnapshot: ConfidenceSnapshot = {
          timestamp: new Date(),
          confidence: 75 + impact, // Replace with actual calculation
          factors: [
            {
              name: factorName,
              impact,
              timestamp: new Date(),
              description: description || 'Confidence factor update'
            }
          ]
        };

        return reply.send({
          success: true,
          data: {
            predictionId,
            newSnapshot,
            message: `Confidence updated by ${impact > 0 ? '+' : ''}${impact}%`
          },
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        fastify.log.error({ err: error }, 'Confidence update error');
        return reply.status(500).send({
          error: 'Failed to update confidence',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // Get all active evolutions
  fastify.get(
    '/active',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Mock data - replace with database query
        const evolutions: ConfidenceEvolutionData[] = [
          {
            predictionId: 'pred_001',
            matchId: 'match_001',
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            initialPrediction: 'Over 2.5 Goals',
            currentPrediction: 'Over 2.5 Goals',
            timeline: [],
            currentConfidence: 75,
            initialConfidence: 75,
            trend: 'stable',
            keyEvents: []
          }
        ];

        return reply.send({
          success: true,
          data: evolutions,
          count: evolutions.length,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        fastify.log.error({ err: error }, 'Active evolutions fetch error');
        return reply.status(500).send({
          error: 'Failed to fetch active evolutions',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
};
