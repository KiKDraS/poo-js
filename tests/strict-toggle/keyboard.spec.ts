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

  test('Accesibilidad por teclado del switch', async ({ page }) => {
    await page.goto('/');
    await page.locator('#strict-demo').scrollIntoViewIfNeeded();

    // Tab hasta el switch (orden: skip-link, brand, 5 toc, CTA, data-next, pre, switch)
    const sw = page.locator('[data-strict-switch]');
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const isSwitch = await page.evaluate(() =>
        document.activeElement?.hasAttribute('data-strict-switch')
      );
      if (isSwitch) break;
    }
    await expect(sw).toBeFocused();

    // 1. Enfocar [data-strict-switch] y pulsar Enter
    await page.keyboard.press('Enter');
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-strict-badge]')).toHaveText(
      'modo estricto'
    );
    await expect(page.locator('[data-output-strict]')).toBeVisible();

    // 2. Pulsar Espacio
    await page.keyboard.press('Space');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('[data-strict-badge]')).toHaveText('modo normal');
    await expect(page.locator('[data-output-normal]')).toBeVisible();
    // El switch sigue enfocado
    await expect(sw).toBeFocused();
  });
});