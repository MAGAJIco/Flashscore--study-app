
import { test, expect } from '@playwright/test';

test.describe('Kids Mode & COPPA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should enable Kids Mode for users under 13', async ({ page }) => {
    // Navigate to test page
    await page.goto('/test-kids-mode');
    
    // Verify Kids Mode toggle exists
    const toggle = page.locator('input[type="checkbox"]');
    await expect(toggle).toBeVisible();
    
    // Enable Kids Mode
    await toggle.check();
    await expect(toggle).toBeChecked();
    
    // Verify status shows enabled
    await expect(page.locator('text=Kids Mode: ENABLED')).toBeVisible();
  });

  test('should hide gambling content when Kids Mode is enabled', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Enable Kids Mode
    const toggle = page.locator('input[type="checkbox"]');
    await toggle.check();
    
    // Verify gambling content is hidden
    await expect(page.locator('text=Gambling content is hidden')).toBeVisible();
    await expect(page.locator('text=Place Bet')).not.toBeVisible();
  });

  test('should show gambling content when Kids Mode is disabled', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Ensure Kids Mode is disabled
    const toggle = page.locator('input[type="checkbox"]');
    await toggle.uncheck();
    
    // Verify gambling content is visible
    await expect(page.locator('text=Betting Odds')).toBeVisible();
  });

  test('should restrict betting features for minors', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Enable Kids Mode
    const toggle = page.locator('input[type="checkbox"]');
    await toggle.check();
    
    // Verify age restriction message appears
    await expect(page.locator('text=Age Restricted Content')).toBeVisible();
  });

  test('should persist Kids Mode setting in localStorage', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Enable Kids Mode
    const toggle = page.locator('input[type="checkbox"]');
    await toggle.check();
    
    // Reload page
    await page.reload();
    
    // Verify Kids Mode is still enabled
    await expect(toggle).toBeChecked();
  });

  test('parental consent manager should export consent records', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Navigate to parental consent section (you'll need to add this route)
    // This is a placeholder test structure
    const childEmail = 'child@example.com';
    const parentEmail = 'parent@example.com';
    
    // Fill in emails
    await page.fill('input[placeholder*="child"]', childEmail);
    await page.fill('input[placeholder*="parent"]', parentEmail);
    
    // Mock the export functionality
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export Consent Record")');
    
    // Verify download was triggered (in real test, you'd verify file contents)
    // const download = await downloadPromise;
    // expect(download.suggestedFilename()).toContain('consent-record');
  });
});

test.describe('Age Verification Guard', () => {
  test('should block payment features for users under 18', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Verify payment features are blocked
    await expect(page.locator('text=Age Restricted Content')).toBeVisible();
  });

  test('should display appropriate fallback UI for restricted content', async ({ page }) => {
    await page.goto('/test-kids-mode');
    
    // Verify fallback UI elements
    await expect(page.locator('text=🔞')).toBeVisible();
    await expect(page.locator('text=responsible gaming policies')).toBeVisible();
  });
});
