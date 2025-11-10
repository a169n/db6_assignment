import { test, expect } from '@playwright/test';

test('homepage renders hero copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /discover products/i })).toBeVisible();
});
