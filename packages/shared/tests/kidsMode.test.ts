
import { describe, test, expect } from 'vitest';
import { isChild, kidsModeEnabledForAccount, createConsentRecord } from '../src/libs/utils/kidsMode';

describe('Kids Mode utilities', () => {
  describe('isChild', () => {
    test('returns true for age < 13', () => {
      expect(isChild({ age: 12 })).toBe(true);
      expect(isChild({ age: 10 })).toBe(true);
      expect(isChild({ age: 5 })).toBe(true);
    });

    test('returns false for age >= 13', () => {
      expect(isChild({ age: 13 })).toBe(false);
      expect(isChild({ age: 18 })).toBe(false);
      expect(isChild({ age: 25 })).toBe(false);
    });

    test('returns true for dob indicating under 13', () => {
      const elevenYearsAgo = new Date();
      elevenYearsAgo.setFullYear(elevenYearsAgo.getFullYear() - 11);
      const dob = elevenYearsAgo.toISOString().split('T')[0];
      expect(isChild({ dob })).toBe(true);
    });

    test('returns false for dob indicating 13 or older', () => {
      const fifteenYearsAgo = new Date();
      fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
      const dob = fifteenYearsAgo.toISOString().split('T')[0];
      expect(isChild({ dob })).toBe(false);
    });

    test('handles edge case of exactly 13 years old', () => {
      const thirteenYearsAgo = new Date();
      thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
      const dob = thirteenYearsAgo.toISOString().split('T')[0];
      expect(isChild({ dob })).toBe(false);
    });
  });

  describe('kidsModeEnabledForAccount', () => {
    test('returns true when forceKidsMode is true', () => {
      expect(kidsModeEnabledForAccount({ age: 30, forceKidsMode: true })).toBe(true);
    });

    test('returns true for children without consent', () => {
      expect(kidsModeEnabledForAccount({ age: 10, forceKidsMode: false })).toBe(true);
    });

    test('returns false when parental consent is granted', () => {
      const consent = createConsentRecord({
        parentEmail: 'parent@example.com',
        childId: 'child-123',
        granted: true,
        method: 'email-link',
      });
      expect(kidsModeEnabledForAccount({ age: 10, parentalConsent: consent })).toBe(false);
    });

    test('returns true when parental consent is not granted', () => {
      const consent = createConsentRecord({
        parentEmail: 'parent@example.com',
        childId: 'child-123',
        granted: false,
      });
      expect(kidsModeEnabledForAccount({ age: 10, parentalConsent: consent })).toBe(true);
    });
  });

  describe('createConsentRecord', () => {
    test('includes grantedAt timestamp when consent is granted', () => {
      const record = createConsentRecord({
        parentEmail: 'parent@example.com',
        childId: 'child-1',
        granted: true,
      });
      expect(record.granted).toBe(true);
      expect(typeof record.grantedAt).toBe('string');
      expect(record.parentEmail).toBe('parent@example.com');
    });

    test('omits grantedAt when consent is not granted', () => {
      const record = createConsentRecord({
        parentEmail: 'parent@example.com',
        childId: 'child-2',
        granted: false,
      });
      expect(record.granted).toBe(false);
      expect(record.grantedAt).toBeUndefined();
    });

    test('defaults to email-link verification method', () => {
      const record = createConsentRecord({
        parentEmail: 'parent@example.com',
        childId: 'child-3',
        granted: true,
      });
      expect(record.method).toBe('email-link');
    });

    test('allows custom verification method', () => {
      const record = createConsentRecord({
        parentEmail: 'parent@example.com',
        childId: 'child-4',
        granted: true,
        method: 'credit-card',
      });
      expect(record.method).toBe('credit-card');
    });
  });
});
