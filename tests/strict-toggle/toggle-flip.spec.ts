import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Toggle modo normal/estricto (#strict-demo)', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Cambio de modo: normal → estricto → normal', async ({ page }) => {
    await page.goto('/');
    await page.locator('#strict-demo').scrollIntoViewIfNeeded();

    const sw = page.locator('[data-strict-switch]');
    const normal = page.locator('[data-output-normal]');
    const strict = page.locator('[data-output-strict]');

    // 1. Clic en [data-strict-switch]
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(sw).toHaveAttribute('aria-label', 'Cambiar a modo normal');
    await expect(page.locator('[data-strict-badge]')).toHaveText(
      'modo estricto'
    );
    await expect(page.locator('#strict-demo')).toHaveClass(/is-strict/);
    await expect(normal).toBeHidden();
    await expect(strict).toBeVisible();
    await expect(strict.locator('.console__line')).toHaveText('undefined');

    // 2. Clic de nuevo en [data-strict-switch]
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(sw).toHaveAttribute('aria-label', 'Cambiar a modo estricto');
    await expect(page.locator('[data-strict-badge]')).toHaveText('modo normal');
    await expect(page.locator('#strict-demo')).not.toHaveClass(/is-strict/);
    await expect(normal).toBeVisible();
    await expect(normal.locator('.console__line')).toHaveText(
      'window (el objeto global)'
    );
    await expect(strict).toBeHidden();
  });
});