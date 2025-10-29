
export interface ParentalControlSettings {
  kidsMode: boolean;
  contentFilter: 'strict' | 'moderate' | 'off';
  screenTimeLimit?: number; // minutes per day
  allowedFeatures: string[];
}

export function isFeatureAllowed(
  feature: string,
  settings: ParentalControlSettings
): boolean {
  if (!settings.kidsMode) return true;
  return settings.allowedFeatures.includes(feature);
}

export function getContentFilter(age: number): 'strict' | 'moderate' | 'off' {
  if (age < 13) return 'strict';
  if (age < 18) return 'moderate';
  return 'off';
}

export function checkCOPPACompliance(age: number, hasParentalConsent: boolean): boolean {
  if (age >= 13) return true;
  return hasParentalConsent;
}
