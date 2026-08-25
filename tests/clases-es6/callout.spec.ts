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

  test('El callout de patrón está presente con su spotlight "contesta: ana · instancia de Estudiante"', async ({
    page,
  }) => {
    // 1. Localizar el .callout--pattern dentro de #clases
    await page.goto('/');
    const callout = page.locator('main section#clases .callout--pattern');
    await expect(callout).toBeVisible();
    await expect(callout.locator('.callout__label')).toHaveText('Patrón');
    await expect(callout.locator('.callout__text')).toContainText(
      'Clases = azúcar, debajo sigue el motor.'
    );

    // 2. Verificar el spotlight
    await expect(callout.locator('.spotlight__owner')).toHaveText(
      'contesta: ana · instancia de Estudiante'
    );
    await expect(callout.locator('.spotlight')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});