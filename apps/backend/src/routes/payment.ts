import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { attachKidsModeFlag } from '../middleware/kidsModeFilter';

interface PaymentQuery {
  kidsMode?: string;
}

interface PaymentProcessBody {
  amount: number;
  type: string;
  description?: string;
}

const paymentsRoutes: FastifyPluginAsync = async (fastify) => {
  // 🧩 Attach Kids Mode Middleware
  fastify.addHook('preHandler', attachKidsModeFlag);

  /**
   * 🧾 GET /transactions
   * Fetch transaction history (filters gambling if Kids Mode is active)
   */
  fastify.get<{ Querystring: PaymentQuery }>(
    '/transactions',
    async (request, reply) => {
      try {
        // Placeholder data – replace with real DB fetch later
        const transactions: any[] = [
          { type: 'wallet', amount: 2000, description: 'Food' },
          { type: 'bet', amount: 1000, description: 'Football wager' },
        ];

        const kidsMode =
          (request as any).kidsMode || request.query.kidsMode === 'true';

        const filtered = kidsMode
          ? transactions.filter((tx) => {
              const isGambling =
                tx.type?.toLowerCase().includes('bet') ||
                tx.type?.toLowerCase().includes('wager') ||
                tx.description?.toLowerCase().includes('gambling');
              return !isGambling;
            })
          : transactions;

        return reply.send({ success: true, data: filtered });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch transactions',
        });
      }
    }
  );

  /**
   * 💳 POST /process
   * Process a payment (blocks gambling types if Kids Mode is active)
   */
  fastify.post<{ Body: PaymentProcessBody; Querystring: PaymentQuery }>(
    '/process',
    async (request, reply) => {
      try {
        const { amount, type, description } = request.body;

        if (!amount || !type) {
          return reply.status(400).send({
            success: false,
            error: 'Amount and type are required',
          });
        }

        const kidsMode =
          (request as any).kidsMode || request.query.kidsMode === 'true';

        if (kidsMode) {
          const isGambling =
            type.toLowerCase().includes('bet') ||
            type.toLowerCase().includes('wager') ||
            description?.toLowerCase().includes('gambling');

          if (isGambling) {
            return reply.status(403).send({
              success: false,
              error: 'This payment type is not available in Kids Mode',
            });
          }
        }

        // Simulate payment success
        const transaction = {
          id: `TX-${Date.now()}`,
          type,
          amount,
          description,
          status: 'success',
          processedAt: new Date().toISOString(),
        };

        return reply.send({
          success: true,
          message: `Payment of ₦${amount} for ${type} processed successfully`,
          transaction,
        });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Payment processing failed',
        });
      }
    }
  );
};

export default paymentsRoutes;