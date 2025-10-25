/**
 * Hydration Auto-Fix Utility - DISABLED
 * These automatic fixes can cause conflicts with Next.js 14's hydration
 */

export class HydrationAutoFix {
  private static instance: HydrationAutoFix;
  private fixApplied = false;

  private constructor() {}

  static getInstance(): HydrationAutoFix {
    if (!HydrationAutoFix.instance) {
      HydrationAutoFix.instance = new HydrationAutoFix();
    }
    return HydrationAutoFix.instance;
  }

  // Disabled - let Next.js handle hydration
  applyFixes(): void {
    // No-op
  }

  criticalReset(): void {
    console.warn('Hydration reset requested - reloading...');
    window.location.reload();
  }
}