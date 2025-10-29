import { FastifyRequest, FastifyReply } from 'fastify';

interface PaymentBody {
  amount: number;
  type: string;
  description?: string;
  userAge?: number;
  isMinor?: boolean;
  parentalConsent?: boolean;
}

export async function processPayment(
  request: FastifyRequest<{ Body: PaymentBody }>,
  reply: FastifyReply
) {
  try {
    const { amount, type, description, userAge, isMinor, parentalConsent } = request.body;

    if (!amount || !type) {
      return reply.status(400).send({
        success: false,
        error: 'Amount and type are required',
      });
    }

    const MINIMUM_AGE_FOR_PAYMENTS = 18;
    const MINIMUM_AGE_WITH_CONSENT = 13;
    const MAX_MINOR_TRANSACTION = 50;

    if (userAge !== undefined) {
      if (userAge < MINIMUM_AGE_WITH_CONSENT) {
        return reply.status(403).send({
          success: false,
          error: `Payment processing is not available for users under ${MINIMUM_AGE_WITH_CONSENT} years old`,
          code: 'AGE_RESTRICTION_UNDERAGE',
          requiredAge: MINIMUM_AGE_WITH_CONSENT
        });
      }

      if (userAge < MINIMUM_AGE_FOR_PAYMENTS && !parentalConsent) {
        return reply.status(403).send({
          success: false,
          error: 'Parental consent required for payment processing',
          code: 'PARENTAL_CONSENT_REQUIRED',
          requiredAge: MINIMUM_AGE_FOR_PAYMENTS,
          currentAge: userAge
        });
      }

      if (userAge < MINIMUM_AGE_FOR_PAYMENTS && amount > MAX_MINOR_TRANSACTION) {
        return reply.status(403).send({
          success: false,
          error: `Transaction amount exceeds limit for minors. Maximum: $${MAX_MINOR_TRANSACTION}`,
          code: 'MINOR_AMOUNT_LIMIT_EXCEEDED',
          maxAmount: MAX_MINOR_TRANSACTION
        });
      }
    }

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
      message: `Payment of $${amount} for ${type} processed successfully`,
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
