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

  test('El error común "Confiar en bind con una Arrow Function" es el último item de ul.mistakes', async ({
    page,
  }) => {
    // 1. Navegar y localizar ul.mistakes de main section#resumen
    await page.goto('/');
    const mistakes = page.locator('main section#resumen ul.mistakes');
    await expect(mistakes).toBeVisible();
    await expect(mistakes.locator('li.mistakes__item')).toHaveCount(4);

    // 2. Leer el último item de la lista
    const last = mistakes.locator('li.mistakes__item').last();
    await expect(last.locator('.mistakes__title')).toHaveText(
      'Confiar en bind con una Arrow Function'
    );
    await expect(last.locator('.mistakes__fix')).toContainText(
      'f.bind(otro) no cambia nada'
    );
    await expect(last.locator('.mistakes__fix')).toContainText(
      'la Arrow Function ignora la regla explícita'
    );
    await expect(last.locator('.mistakes__fix')).toContainText(
      'Si necesitas this dinámico, usa un método normal'
    );

    // 3. Verificar que los 3 primeros items se mantienen (regresión interna)
    const titles = await mistakes.locator('.mistakes__title').allTextContents();
    expect(titles.map((t) => t.trim())).toEqual([
      'Extraer un método y perder this',
      'Pasar un método a setTimeout',
      'Olvidar la prioridad',
      'Confiar en bind con una Arrow Function',
    ]);
  });
});