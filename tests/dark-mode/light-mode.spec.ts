import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Modo oscuro (prefers-color-scheme)', () => {
  test.use({ colorScheme: 'light' });

  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Light mode (por defecto): fondo claro', async ({ page }) => {
    // 1. Navegar con colorScheme light
    await page.goto('/');
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(247, 242, 233)' // #f7f2e9
    );
    const token = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg')
        .trim()
    );
    expect(token).toBe('#f7f2e9');
  });
});