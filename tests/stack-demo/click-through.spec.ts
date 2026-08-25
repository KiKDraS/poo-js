import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

const STATUS = {
  paso1:
    'Paso 1 de 6 · profundidad 1: Se crea el contexto global. El programa aún no ha llamado a nada.',
  paso2:
    'Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push).',
  paso3:
    'Paso 3 de 6 · profundidad 3: Dentro de main(), se llama a saludar("Ana"): otro push.',
  paso4:
    'Paso 4 de 6 · profundidad 3: Se ejecuta console.log("Hola Ana"). El contexto activo es saludar.',
  paso5:
    'Paso 5 de 6 · profundidad 2: saludar termina: su contexto sale del stack (pop) y se destruye.',
  paso6:
    'Paso 6 de 6 · profundidad 1: main termina: pop. Solo queda el contexto global. Fin del programa.',
};

test.describe('Stepper del call stack (#stack-demo)', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Recorrido completo: 6 pasos (frames, profundidad, líneas, status)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#stack-demo').scrollIntoViewIfNeeded();

    const next = page.locator('[data-next]');
    const reset = page.locator('[data-reset]');
    const status = page.locator('[data-status]');
    const frames = page.locator('[data-stack] .frame');
    const activeLines = page.locator('[data-code] .code-line.is-active');

    // 1. Clic en [data-next] + espera 500ms (FRAME_MS=450)
    await next.click();
    await expect(next).toHaveText('Siguiente paso');
    await expect(reset).toBeEnabled();
    await expect(page.locator('[data-depth]')).toHaveText('2');
    await expect(frames).toHaveCount(2);
    await expect(page.locator('[data-stack] .frame[data-name="global"]')).toBeVisible();
    await expect(page.locator('[data-stack] .frame[data-name="main"]')).toBeVisible();
    await expect(activeLines).toHaveCount(1);
    await expect(activeLines).toHaveAttribute('data-line', '6');
    await expect(status).toHaveText(STATUS.paso2);

    // 2. 2º clic + 500ms
    await next.click();
    await expect(page.locator('[data-depth]')).toHaveText('3');
    await expect(frames).toHaveCount(3);
    await expect(page.locator('[data-stack] .frame[data-name="saludar"]')).toBeVisible();
    await expect(activeLines).toHaveCount(1);
    await expect(activeLines).toHaveAttribute('data-line', '4');
    await expect(status).toHaveText(STATUS.paso3);

    // 3. 3er clic + 500ms
    await next.click();
    await expect(page.locator('[data-depth]')).toHaveText('3');
    await expect(frames).toHaveCount(3);
    await expect(activeLines).toHaveCount(1);
    await expect(activeLines).toHaveAttribute('data-line', '1');
    await expect(status).toHaveText(STATUS.paso4);

    // 4. 4º clic + 500ms (saludar recibe frame--leave y se elimina tras 450ms)
    await next.click();
    await expect(page.locator('[data-depth]')).toHaveText('2');
    await expect(frames).toHaveCount(2);
    await expect(page.locator('[data-stack] .frame[data-name="global"]')).toBeVisible();
    await expect(page.locator('[data-stack] .frame[data-name="main"]')).toBeVisible();
    await expect(
      page.locator('[data-stack] .frame[data-name="saludar"]')
    ).toHaveCount(0);
    await expect(activeLines).toHaveCount(1);
    await expect(activeLines).toHaveAttribute('data-line', '2');
    await expect(status).toHaveText(STATUS.paso5);

    // 5. 5º clic + 500ms
    await next.click();
    await expect(page.locator('[data-depth]')).toHaveText('1');
    await expect(frames).toHaveCount(1);
    await expect(page.locator('[data-stack] .frame[data-name="global"]')).toBeVisible();
    await expect(activeLines).toHaveCount(1);
    await expect(activeLines).toHaveAttribute('data-line', '5');
    await expect(status).toHaveText(STATUS.paso6);
    await expect(next).toHaveText('Reiniciar'); // último paso
  });
});