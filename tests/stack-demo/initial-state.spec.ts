import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Stepper del call stack (#stack-demo)', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Estado inicial del stepper', async ({ page }) => {
    // 1. Navegar a la URL base y hacer scroll hasta #stack-demo
    await page.goto('/');
    await page.locator('#stack-demo').scrollIntoViewIfNeeded();
    await expect(page.locator('#stack-demo')).toBeVisible();

    // 2. Leer el botón [data-next]
    await expect(page.locator('[data-next]')).toHaveText(
      'Ejecutar paso a paso'
    );

    // 3. Comprobar [data-reset]
    const reset = page.locator('[data-reset]');
    await expect(reset).toHaveText('Reiniciar');
    await expect(reset).toBeDisabled();

    // 4. Leer [data-depth]
    await expect(page.locator('[data-depth]')).toHaveText('1');

    // 5. Leer los frames de [data-stack]
    await expect(page.locator('[data-stack] .frame')).toHaveCount(1);
    const globalFrame = page.locator('[data-stack] .frame[data-name="global"]');
    await expect(globalFrame).toHaveText('global');
    await expect(globalFrame).toHaveClass(/frame--enter/);
    await expect(page.locator('[data-stack]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );

    // 6. Leer [data-status]
    const status = page.locator('[data-status]');
    await expect(status).toHaveText(
      'Paso 1 de 6 · profundidad 1: Se crea el contexto global. El programa aún no ha llamado a nada.'
    );
    await expect(status).toHaveAttribute('aria-live', 'polite');

    // 7. Comprobar la línea activa en [data-code]
    await expect(page.locator('[data-code] .code-line.is-active')).toHaveCount(
      0
    );
  });
});