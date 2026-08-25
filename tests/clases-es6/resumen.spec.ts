import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Clases ES6 (#clases)', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Resumen renumerado a 06 con el siguiente paso TypeScript', async ({
    page,
  }) => {
    // 1. Localizar main section#resumen
    await page.goto('/');
    const section = page.locator('main section#resumen');
    await expect(section.locator('.section__num')).toHaveText('06 · Resumen');
    await expect(page.locator('h2#resumen-title')).toHaveText(
      'Resumen (cheat sheet)'
    );

    // 2. Verificar el bloque next-step
    const nextStep = section.locator('.next-step');
    await expect(nextStep).toBeVisible();
    await expect(nextStep.locator('h3')).toHaveText('Siguiente paso: TypeScript');
    await expect(nextStep).toContainText('implements');
    await expect(nextStep).toContainText('abstract');
    await expect(nextStep).toContainText('public');
    await expect(nextStep).toContainText('private');
    await expect(nextStep).toContainText('protected');
  });
});