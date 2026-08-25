import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Accesibilidad', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Región aria-live anuncia los pasos del stepper', async ({ page }) => {
    await page.goto('/');

    // 1. Localizar los elementos con aria-live
    const live = page.locator('[aria-live]');
    await expect(live).toHaveCount(1);
    const status = page.locator('[data-status]');
    await expect(status).toHaveAttribute('aria-live', 'polite');

    // 2. Clic en [data-next] y comprobar el anuncio
    await page.locator('[data-next]').click();
    await expect(status).toHaveText(
      'Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push).'
    );

    // 3. Comprobar ocultación de decorativos para lectores de pantalla
    await expect(page.locator('[data-stack]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    await expect(page.locator('.hero-visual')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    await expect(page.locator('.progress')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});