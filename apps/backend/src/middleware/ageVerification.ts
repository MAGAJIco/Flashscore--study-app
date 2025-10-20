import { FastifyRequest, FastifyReply } from "fastify";

interface UserData {
  age?: number;
  dateOfBirth?: string;
  isMinor?: boolean;
  parentalConsentGranted?: boolean;
  ageVerificationStatus?: 'verified' | 'pending' | 'failed';
}

const MINIMUM_AGE_FOR_PAYMENTS = 18;
const MINIMUM_AGE_WITH_CONSENT = 13;

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Middleware to verify user age for payment operations
 */
export async function verifyAgeForPayments(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = (request as any).user as UserData;
    
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: "Authentication required",
        code: "AUTHENTICATION_REQUIRED"
      });
    }

    // Calculate age if dateOfBirth is provided
    let userAge = user.age;
    if (!userAge && user.dateOfBirth) {
      userAge = calculateAge(user.dateOfBirth);
    }

    // Check age requirements
    if (userAge !== undefined) {
      // Users under 13 cannot make payments
      if (userAge < MINIMUM_AGE_WITH_CONSENT) {
        return reply.status(403).send({
          success: false,
          error: `Users must be at least ${MINIMUM_AGE_WITH_CONSENT} years old to make payments`,
          code: "AGE_RESTRICTION_UNDERAGE",
          requiredAge: MINIMUM_AGE_WITH_CONSENT
        });
      }

      // Users 13-17 need parental consent
      if (userAge < MINIMUM_AGE_FOR_PAYMENTS && !user.parentalConsentGranted) {
        return reply.status(403).send({
          success: false,
          error: "Parental consent required for payment processing",
          code: "PARENTAL_CONSENT_REQUIRED",
          requiredAge: MINIMUM_AGE_FOR_PAYMENTS,
          currentAge: userAge,
          action: "REQUEST_PARENTAL_CONSENT"
        });
      }

      // Attach verified age info to request for downstream handlers
      (request as any).ageVerification = {
        age: userAge,
        isMinor: userAge < MINIMUM_AGE_FOR_PAYMENTS,
        hasParentalConsent: user.parentalConsentGranted || false,
        verified: true
      };
    } else {
      // No age information - require verification
      return reply.status(403).send({
        success: false,
        error: "Age verification required for payment processing",
        code: "AGE_VERIFICATION_REQUIRED",
        action: "COMPLETE_AGE_VERIFICATION"
      });
    }

  } catch (error) {
    request.log.error({ error }, "Age verification failed");
    return reply.status(500).send({
      success: false,
      error: "Age verification failed",
      code: "AGE_VERIFICATION_ERROR"
    });
  }
}

/**
 * Middleware to enforce transaction limits for minors
 */
export async function enforceMinorTransactionLimits(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const ageVerification = (request as any).ageVerification;
  const body = request.body as any;

  if (!ageVerification || !ageVerification.isMinor) {
    return; // Not a minor, no limits
  }

  const MAX_MINOR_TRANSACTION = 50;
  const MAX_DAILY_MINOR_TOTAL = 100;

  // Check single transaction limit
  if (body.amount && body.amount > MAX_MINOR_TRANSACTION) {
    return reply.status(403).send({
      success: false,
      error: `Transaction amount exceeds minor limit of $${MAX_MINOR_TRANSACTION}`,
      code: "MINOR_TRANSACTION_LIMIT_EXCEEDED",
      maxAmount: MAX_MINOR_TRANSACTION,
      requestedAmount: body.amount
    });
  }

  // Note: Daily limit checking would require database tracking
  // This is a placeholder for that functionality
}

export {
  MINIMUM_AGE_FOR_PAYMENTS,
  MINIMUM_AGE_WITH_CONSENT,
  calculateAge
};
