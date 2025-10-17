
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * COPPA Enforcement Middleware
 * Blocks access to age-restricted features for children without parental consent
 */
export async function coppaEnforcementMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const isChild = (req as any).isChild;
  const hasParentalConsent = (req as any).hasParentalConsent;
  
  if (!isChild) {
    return; // Not a child, no COPPA restrictions
  }

  // Define COPPA-restricted endpoints
  const coppaRestrictedPaths = [
    '/api/payments',
    '/api/marketplace',
    '/coppa/request-consent',
    '/api/social/chat',
    '/api/user/public-profile'
  ];

  const isRestricted = coppaRestrictedPaths.some(path => req.url.startsWith(path));

  if (isRestricted && !hasParentalConsent) {
    req.log.warn({
      userId: (req as any).userId,
      endpoint: req.url,
      coppaViolation: true
    }, 'COPPA enforcement: Blocked access to restricted feature');

    return reply.status(403).send({
      success: false,
      error: 'COPPA Compliance Restriction',
      code: 'COPPA_PARENTAL_CONSENT_REQUIRED',
      message: 'This feature requires verified parental consent for users under 13 years old',
      compliance: 'COPPA',
      requiredAction: 'OBTAIN_PARENTAL_CONSENT',
      parentalConsentUrl: '/coppa/request-consent'
    });
  }
}

/**
 * Apply COPPA enforcement to Fastify instance
 */
export function registerCoppaEnforcement(fastify: any) {
  fastify.addHook('onRequest', coppaEnforcementMiddleware);
}
