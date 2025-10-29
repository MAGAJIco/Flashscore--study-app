import { FastifyRequest, FastifyReply } from "fastify";

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
 * Middleware to verify user age for payment operations (DISABLED)
 */
export async function verifyAgeForPayments(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Age verification disabled - allow all users
  return;
}

/**
 * Middleware to enforce transaction limits for minors (DISABLED)
 */
export async function enforceMinorTransactionLimits(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Transaction limits disabled - allow all transactions
  return;
}

export {
  MINIMUM_AGE_FOR_PAYMENTS,
  MINIMUM_AGE_WITH_CONSENT,
  calculateAge
};