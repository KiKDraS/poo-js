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

  test('Estado inicial: modo normal activo', async ({ page }) => {
    // 1. Navegar y hacer scroll hasta #strict-demo
    await page.goto('/');
    await page.locator('#strict-demo').scrollIntoViewIfNeeded();
    await expect(page.locator('#strict-demo')).toBeVisible();
    await expect(page.locator('#strict-demo')).not.toHaveClass(/is-strict/);

    // 2. Comprobar button.switch[data-strict-switch]
    const sw = page.locator('[data-strict-switch]');
    await expect(sw).toHaveAttribute('role', 'switch');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(sw).toHaveAttribute('aria-label', 'Cambiar a modo estricto');
    await expect(sw.locator('span.switch__thumb')).toBeVisible();

    // 3. Leer las etiquetas .strict-demo__label
    await expect(page.locator('.strict-demo__label--normal')).toBeVisible();
    await expect(page.locator('.strict-demo__label--normal')).toHaveText(
      'modo normal'
    );
    await expect(page.locator('.strict-demo__label--strict')).toBeVisible();
    await expect(page.locator('.strict-demo__label--strict')).toHaveText(
      'modo estricto'
    );

    // 4. Leer la insignia [data-strict-badge]
    await expect(page.locator('[data-strict-badge]')).toHaveText('modo normal');

    // 5. Comprobar las salidas .console--output
    await expect(page.locator('[data-output-normal]')).toBeVisible();
    await expect(
      page.locator('[data-output-normal] .console__line')
    ).toHaveText('window (el objeto global)');
    await expect(page.locator('[data-output-strict]')).toBeHidden();
    await expect(
      page.locator('[data-output-strict] .console__line')
    ).toHaveText('undefined');
  });
});