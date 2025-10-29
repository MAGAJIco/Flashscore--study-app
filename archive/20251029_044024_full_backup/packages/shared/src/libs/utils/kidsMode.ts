// Lightweight Kids Mode utilities used by tests and app code.
// Purpose: provide deterministic functions to validate age and manage Kids Mode state.
// This file is intentionally small and fully testable (no external dependencies).

export type ConsentRecord = {
  parentEmail: string;
  childId: string;
  granted: boolean;
  grantedAt?: string; // ISO timestamp when consent was given
  method?: 'email-link' | 'credit-card' | 'id-check' | 'other';
};

/**
 * isChild - determines if an ISO date-of-birth string (YYYY-MM-DD) or numeric age indicates < 13.
 * Accepts either an age number or a date string. Returns true if the person is under 13.
 */
export function isChild({ dob, age }: { dob?: string; age?: number }): boolean {
  if (typeof age === 'number') {
    return age < 13;
  }
  if (typeof dob === 'string') {
    // Parse YYYY-MM-DD ignoring timezones (safe for testing)
    const [y, m, d] = dob.split('-').map(Number);
    if (!y || !m || !d) return false;
    const birth = new Date(Date.UTC(y, m - 1, d));
    const now = new Date();
    let years = now.getUTCFullYear() - birth.getUTCFullYear();
    const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birth.getUTCDate())) {
      years--;
    }
    return years < 13;
  }
  // Unknown -> not considered child
  return false;
}

/**
 * kidsModeEnabledForAccount - determines whether Kids Mode should be enabled for an account.
 * - If child (under 13) => true
 * - If explicit flag provided (forceKidsMode) => obey it
 * - If parental consent is present and granted => false (Kids Mode can be relaxed depending on consent)
 */
export function kidsModeEnabledForAccount({
  age,
  dob,
  forceKidsMode,
  parentalConsent,
}: {
  age?: number;
  dob?: string;
  forceKidsMode?: boolean;
  parentalConsent?: ConsentRecord | null;
}): boolean {
  if (forceKidsMode === true) return true;
  if (parentalConsent && parentalConsent.granted === true) return false;
  return isChild({ age, dob });
}

/**
 * createConsentRecord - returns a canonical ConsentRecord object (adds timestamp when granted)
 */
export function createConsentRecord(args: {
  parentEmail: string;
  childId: string;
  granted: boolean;
  method?: ConsentRecord['method'];
}): ConsentRecord {
  const record: ConsentRecord = {
    parentEmail: args.parentEmail,
    childId: args.childId,
    granted: args.granted,
    method: args.method || 'email-link',
  };
  if (args.granted) {
    record.grantedAt = new Date().toISOString();
  }
  return record;
}

// Named exports only - no default export
export const kidsModeUtils = {
  isChild,
  kidsModeEnabledForAccount,
  createConsentRecord,
};
