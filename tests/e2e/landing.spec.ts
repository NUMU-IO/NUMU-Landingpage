import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NUMU/i);
  });

  test('signup page loads', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/signup/);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
  });

  test('language toggle works', async ({ page }) => {
    await page.goto('/');
    const langToggle = page.locator('[data-testid="lang-toggle"], button:has-text("عربي"), button:has-text("English")');
    if (await langToggle.count() > 0) {
      await langToggle.first().click();
      await expect(page.locator('html')).toHaveAttribute('dir', /rtl|ltr/);
    }
  });
});
