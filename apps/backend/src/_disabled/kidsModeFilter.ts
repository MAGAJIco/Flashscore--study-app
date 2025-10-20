import { FastifyRequest, FastifyReply } from "fastify";

/**
 * Middleware that enforces Kids Mode based on:
 *  - User's database record (authoritative source)
 *  - Age verification
 *  - COPPA consent status
 *
 * Server-side enforcement prevents client-side bypass attempts.
 */
export async function attachKidsModeFlag(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    // Extract user ID from various auth sources
    const userId = (req as any).userId || (req as any).user?.id || (req as any).user?._id;
    
    if (!userId) {
      // No authenticated user - default to safe mode for public access
      (req as any).kidsMode = false;
      (req as any).ageVerified = false;
      return;
    }

    // Fetch user from database for authoritative Kids Mode status
    const { User } = await import('../models/User');
    const user = await User.findById(userId).select('age isUnder13 kidsMode coppaConsent accountRestricted accessRestrictions');

    if (!user) {
      req.log.warn({ userId }, 'User not found for Kids Mode check');
      (req as any).kidsMode = false;
      return;
    }

    // SERVER-SIDE ENFORCEMENT: Cannot be bypassed by client
    const isChild = user.age < 13 || user.isUnder13;
    const hasValidConsent = user.coppaConsent?.status === 'approved';
    const isRestricted = user.accountRestricted === true;

    // Kids Mode is enforced if:
    // 1. User is under 13 (COPPA requirement)
    // 2. Account is explicitly restricted
    // 3. User explicitly enabled Kids Mode
    const kidsModeEnforced = isChild || isRestricted || user.kidsMode === true;

    (req as any).kidsMode = kidsModeEnforced;
    (req as any).isChild = isChild;
    (req as any).hasParentalConsent = hasValidConsent;
    (req as any).ageVerified = user.age !== undefined;
    (req as any).accessRestrictions = user.accessRestrictions || {};

    // Log enforcement for audit trail
    if (kidsModeEnforced) {
      req.log.info({
        userId,
        age: user.age,
        isChild,
        hasConsent: hasValidConsent,
        endpoint: req.url
      }, 'Kids Mode enforced server-side');
    }

    // Block access to restricted endpoints
    const restrictedEndpoints = ['/api/payments', '/coppa/request-consent'];
    const isRestrictedEndpoint = restrictedEndpoints.some(ep => req.url.startsWith(ep));

    if (isRestrictedEndpoint && isChild && !hasValidConsent) {
      req.log.warn({
        userId,
        endpoint: req.url,
        age: user.age,
        consent: user.coppaConsent?.status
      }, 'Blocked access to restricted endpoint - COPPA violation attempt');

      return reply.status(403).send({
        error: 'Parental consent required',
        code: 'COPPA_CONSENT_REQUIRED',
        message: 'This feature requires verified parental consent for users under 13',
        action: 'REQUEST_PARENTAL_CONSENT'
      });
    }

  } catch (err) {
    req.log.error({ err }, 'Error in Kids Mode enforcement');
    // Fail safe: enable Kids Mode on error
    (req as any).kidsMode = true;
    (req as any).ageVerified = false;
  }
}

/**
 * Utility to filter gambling fields from an object.
 * Customize the fields/names to match your API responses.
 */
export function filterGamblingContent(payload: any): any {
  if (!payload) return payload;

  // If payload is an array
  if (Array.isArray(payload)) {
    return payload.map(filterGamblingContent);
  }

  // Remove keys commonly used for gambling/odds
  const cloned: any = { ...payload };
  const bannedKeys = [
    "odds",
    "bettingTips",
    "bet",
    "bets",
    "oddsData",
    "recommendedWagers",
    "depositButton",
  ];
  for (const k of bannedKeys) {
    if (k in cloned) delete cloned[k];
  }

  // If nested items have isGambling flag, filter them out
  if (cloned.items && Array.isArray(cloned.items)) {
    cloned.items = cloned.items
      .filter((it: any) => !it.isGambling)
      .map(filterGamblingContent);
  }

  return cloned;
}
