import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

const STATUS_PASO1 =
  'Paso 1 de 6 · profundidad 1: Se crea el contexto global. El programa aún no ha llamado a nada.';
const STATUS_PASO6 =
  'Paso 6 de 6 · profundidad 1: main termina: pop. Solo queda el contexto global. Fin del programa.';

test.describe('Stepper del call stack (#stack-demo)', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Reinicio: por label Reiniciar y por botón [data-reset]', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#stack-demo').scrollIntoViewIfNeeded();

    const next = page.locator('[data-next]');
    const reset = page.locator('[data-reset]');
    const status = page.locator('[data-status]');

    // 1. Avanzar 5 clics hasta el último paso (+500ms cada uno)
    for (let i = 0; i < 5; i++) {
      await next.click();
    }
    await expect(next).toHaveText('Reiniciar');
    await expect(page.locator('[data-depth]')).toHaveText('1');
    await expect(status).toHaveText(STATUS_PASO6);

    // 2. Clic en [data-next] (label Reiniciar) + 500ms
    await next.click();
    await expect(next).toHaveText('Ejecutar paso a paso');
    await expect(reset).toBeDisabled();
    await expect(page.locator('[data-depth]')).toHaveText('1');
    await expect(page.locator('[data-stack] .frame')).toHaveCount(1);
    await expect(
      page.locator('[data-stack] .frame[data-name="global"]')
    ).toHaveText('global');
    await expect(page.locator('[data-code] .code-line.is-active')).toHaveCount(
      0
    );
    await expect(status).toHaveText(STATUS_PASO1);

    // 3. Avanzar 2 pasos y pulsar [data-reset]
    await next.click();
    await next.click();
    await expect(reset).toBeEnabled();
    await expect(page.locator('[data-depth]')).toHaveText('3');
    await reset.click();
    await expect(next).toHaveText('Ejecutar paso a paso');
    await expect(reset).toBeDisabled();
    await expect(page.locator('[data-depth]')).toHaveText('1');
    await expect(page.locator('[data-stack] .frame')).toHaveCount(1);
    await expect(
      page.locator('[data-stack] .frame[data-name="global"]')
    ).toHaveText('global');
    await expect(page.locator('[data-code] .code-line.is-active')).toHaveCount(
      0
    );
    await expect(status).toHaveText(STATUS_PASO1);
  });
});