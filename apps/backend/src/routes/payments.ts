import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { attachKidsModeFlag, filterGamblingContent } from '../middleware/kidsModeFilter';

interface PaymentProcessBody {
  amount: number;
  type: string;
  description?: string;
}

const paymentsRoutes: FastifyPluginAsync = async (fastify) => {

  fastify.get('/transactions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Fetch transactions from database
      const transactions: any[] = []; // TODO: Implement actual DB query

      // Filter gambling-related transactions if kids mode is active
      const kidsMode = (request as any).kidsMode || request.query.kidsMode === 'true';

      if (kidsMode) {
        const filteredTransactions = transactions.filter(tx => {
          const isGambling =
            tx.type?.toLowerCase().includes('bet') ||
            tx.type?.toLowerCase().includes('wager') ||
            tx.type?.toLowerCase().includes('deposit') ||
            tx.description?.toLowerCase().includes('gambling');
          return !isGambling;
        });
        return reply.send({ success: true, data: filteredTransactions });
      }

      return reply.send({ success: true, data: transactions });
    } catch (error) {
      return reply.status(500).send({ success: false, error: 'Failed to fetch transactions' });
    }
  });

  fastify.post<{ Body: PaymentProcessBody }>(
    '/process',
    async (request: FastifyRequest<{ Body: PaymentProcessBody }>, reply: FastifyReply) => {
      try {
        const { amount, type, description } = request.body;

        // Block gambling payments in kids mode
        const kidsMode = (request as any).kidsMode || request.query.kidsMode === 'true';

        if (kidsMode) {
          const isGambling =
            type?.toLowerCase().includes('bet') ||
            type?.toLowerCase().includes('wager') ||
            type?.toLowerCase().includes('deposit') ||
            description?.toLowerCase().includes('gambling');

          if (isGambling) {
            return reply.status(403).send({
              success: false,
              error: 'This payment type is not available in Kids Mode'
            });
          }
        }

        // Process payment
        // TODO: Implement actual payment processing

        return reply.send({ success: true, message: 'Payment processed' });
      } catch (error) {
        return reply.status(500).send({ success: false, error: 'Payment processing failed' });
      }
    }
  );
};

export default paymentsRoutes;