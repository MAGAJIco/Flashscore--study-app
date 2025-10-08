import { FastifyRequest, FastifyReply } from "fastify";

interface PaymentBody {
  amount: number;
  method?: string;
  userId?: string;
  userAge?: number;
  isMinor?: boolean;
  parentalConsent?: boolean;
}

interface UserPayload {
  age?: number;
  isMinor?: boolean;
  dateOfBirth?: string;
  parentalConsentGranted?: boolean;
}

const MINIMUM_AGE_FOR_PAYMENTS = 18;
const MINIMUM_AGE_WITH_CONSENT = 13;

export const processPayment = async (
  request: FastifyRequest<{ Body: PaymentBody }>,
  reply: FastifyReply
) => {
  try {
    const { 
      amount, 
      method = "wallet", 
      userId = "anonymous",
      userAge,
      isMinor,
      parentalConsent = false 
    } = request.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return reply.status(400).send({ 
        success: false, 
        error: "Valid amount is required",
        code: "INVALID_AMOUNT"
      });
    }

    // Age verification for payment processing
    if (userAge !== undefined) {
      // Block payments for users under 18 without proper consent
      if (userAge < MINIMUM_AGE_FOR_PAYMENTS) {
        // Check if user is at least 13 and has parental consent
        if (userAge < MINIMUM_AGE_WITH_CONSENT) {
          return reply.status(403).send({
            success: false,
            error: "Payment processing is not available for users under 13 years old",
            code: "AGE_RESTRICTION_UNDERAGE",
            requiredAge: MINIMUM_AGE_WITH_CONSENT
          });
        }

        if (!parentalConsent) {
          return reply.status(403).send({
            success: false,
            error: "Parental consent required for users under 18",
            code: "AGE_RESTRICTION_NO_CONSENT",
            requiredAge: MINIMUM_AGE_FOR_PAYMENTS,
            alternativeAction: "REQUEST_PARENTAL_CONSENT"
          });
        }
      }
    }

    // Additional check for minor status
    if (isMinor && !parentalConsent) {
      return reply.status(403).send({
        success: false,
        error: "Minors require parental consent for payment processing",
        code: "MINOR_CONSENT_REQUIRED"
      });
    }

    // Limit transaction amounts for minors with consent
    const MAX_MINOR_TRANSACTION = 50; // Maximum $50 per transaction
    if ((isMinor || (userAge && userAge < MINIMUM_AGE_FOR_PAYMENTS)) && amount > MAX_MINOR_TRANSACTION) {
      return reply.status(403).send({
        success: false,
        error: `Transaction amount exceeds limit for minors. Maximum: $${MAX_MINOR_TRANSACTION}`,
        code: "MINOR_AMOUNT_LIMIT_EXCEEDED",
        maxAmount: MAX_MINOR_TRANSACTION
      });
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate transaction data with age verification metadata
    const transaction = {
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      amount,
      method,
      status: "success",
      processedAt: new Date().toISOString(),
      message: `Payment of $${amount} via ${method} processed successfully.`,
      ageVerified: userAge !== undefined,
      parentalConsentProvided: parentalConsent,
      isMinorTransaction: isMinor || (userAge && userAge < MINIMUM_AGE_FOR_PAYMENTS)
    };

    return reply.send({
      success: true,
      transaction,
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: (error as Error).message || "Payment processing failed",
      code: "PAYMENT_PROCESSING_ERROR"
    });
  }
};