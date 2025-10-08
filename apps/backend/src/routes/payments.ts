
import { FastifyPluginAsync } from 'fastify';
import { attachKidsModeFlag } from '../middleware/kidsModeFilter';

interface PaymentQuery {
  kidsMode?: string;
}

const paymentsRoutes: FastifyPluginAsync = async (fastify) => {
  // Attach Kids Mode Middleware
  fastify.addHook('preHandler', attachKidsModeFlag);

  /**
   * GET /payments/transactions
   * Fetch payment transaction history
   */
  fastify.get<{ Querystring: PaymentQuery }>(
    '/transactions',
    async (request, reply) => {
      try {
        const kidsMode = (request as any).kidsMode || request.query.kidsMode === 'true';
        
        // Placeholder data - replace with real DB fetch
        const payments: any[] = [
          { type: 'subscription', amount: 29.99, description: 'Premium subscription' },
          { type: 'picoins', amount: 9.99, description: 'PiCoins purchase' },
        ];

        const filtered = kidsMode
          ? payments.filter((payment) => {
              const isGambling =
                payment.type?.toLowerCase().includes('bet') ||
                payment.type?.toLowerCase().includes('wager') ||
                payment.description?.toLowerCase().includes('gambling');
              return !isGambling;
            })
          : payments;

        return reply.send({ success: true, data: filtered });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch payments',
        });
      }
    }
  );

  /**
   * POST /payments/process
   * Process a payment
   */
  fastify.post<{ Body: any; Querystring: PaymentQuery }>(
    '/process',
    async (request, reply) => {
      try {
        const kidsMode = (request as any).kidsMode || request.query.kidsMode === 'true';
        
        // Add payment processing logic here
        
        return reply.send({ 
          success: true, 
          message: 'Payment processed successfully' 
        });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to process payment',
        });
      }
    }
  );
};

export default paymentsRoutes;
