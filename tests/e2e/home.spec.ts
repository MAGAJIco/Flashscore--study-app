import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Life Connection Hub')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Predictions')).toBeVisible();
  });

  test('should show sports central section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Sports Central')).toBeVisible();
  });

  test('should display predictive alert button', async ({ page }) => {
    await page.goto('/');
    
    const alertButton = page.locator('button[title="Predictive Alerts"]');
    await expect(alertButton).toBeVisible();
  });

  test('should toggle alert panel when button clicked', async ({ page }) => {
    await page.goto('/');
    
    const alertButton = page.locator('button[title="Predictive Alerts"]');
    await alertButton.click();
    
    await expect(page.locator('text=Smart Alerts')).toBeVisible();
  });
});
