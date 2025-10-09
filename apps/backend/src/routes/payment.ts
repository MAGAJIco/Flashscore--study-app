import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { attachKidsModeFlag } from '../middleware/kidsModeFilter';
import { verifyAgeForPayments, enforceMinorTransactionLimits } from '../middleware/ageVerification';

interface PaymentQuery {
  kidsMode?: string;
}

interface PaymentProcessBody {
  amount: number;
  type: string;
  description?: string;
  userAge?: number;
  isMinor?: boolean;
  parentalConsent?: boolean;
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
   * Process a payment (blocks gambling types if Kids Mode is active, with age verification)
   */
  fastify.post<{ Body: PaymentProcessBody; Querystring: PaymentQuery }>(
    '/process',
    async (request, reply) => {
      try {
        const { amount, type, description, userAge, isMinor, parentalConsent } = request.body;

        if (!amount || !type) {
          return reply.status(400).send({
            success: false,
            error: 'Amount and type are required',
          });
        }

        // Age verification for payments
        const MINIMUM_AGE_FOR_PAYMENTS = 18;
        const MINIMUM_AGE_WITH_CONSENT = 13;
        const MAX_MINOR_TRANSACTION = 50;
        
        // Category-based spending limits for minors
        const CATEGORY_LIMITS = {
          'in_app_purchase': 20,
          'subscription': 30,
          'picoins': 50,
          'premium': 40,
          'default': 25
        };
        
        const categoryLimit = CATEGORY_LIMITS[type as keyof typeof CATEGORY_LIMITS] || CATEGORY_LIMITS.default;

        if (userAge !== undefined) {
          // Block payments for users under 13
          if (userAge < MINIMUM_AGE_WITH_CONSENT) {
            return reply.status(403).send({
              success: false,
              error: `Payment processing is not available for users under ${MINIMUM_AGE_WITH_CONSENT} years old`,
              code: 'AGE_RESTRICTION_UNDERAGE',
              requiredAge: MINIMUM_AGE_WITH_CONSENT
            });
          }

          // Users 13-17 require parental consent
          if (userAge < MINIMUM_AGE_FOR_PAYMENTS && !parentalConsent) {
            return reply.status(403).send({
              success: false,
              error: 'Parental consent required for payment processing',
              code: 'PARENTAL_CONSENT_REQUIRED',
              requiredAge: MINIMUM_AGE_FOR_PAYMENTS,
              currentAge: userAge
            });
          }

          // Enforce transaction limits for minors
          if (userAge < MINIMUM_AGE_FOR_PAYMENTS && amount > MAX_MINOR_TRANSACTION) {
            return reply.status(403).send({
              success: false,
              error: `Transaction amount exceeds limit for minors. Maximum: $${MAX_MINOR_TRANSACTION}`,
              code: 'MINOR_AMOUNT_LIMIT_EXCEEDED',
              maxAmount: MAX_MINOR_TRANSACTION
            });
          }
          
          // Check category-specific limits
          if (userAge < MINIMUM_AGE_FOR_PAYMENTS && amount > categoryLimit) {
            return reply.status(403).send({
              success: false,
              error: `${type} purchases limited to $${categoryLimit} for minors`,
              code: 'CATEGORY_LIMIT_EXCEEDED',
              maxAmount: categoryLimit,
              category: type
            });
          }
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
              code: 'KIDS_MODE_RESTRICTION'
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