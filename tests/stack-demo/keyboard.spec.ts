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

  test('Accesibilidad por teclado del stepper (Enter y Espacio)', async ({
    page,
  }) => {
    // 1. Navegar, scroll a #stack-demo, enfocar [data-next]
    await page.goto('/');
    await page.locator('#stack-demo').scrollIntoViewIfNeeded();

    // Tab hasta [data-next] (orden: skip-link, brand, 5 toc, CTA, data-next)
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const isNext = await page.evaluate(() =>
        document.activeElement?.hasAttribute('data-next')
      );
      if (isNext) break;
    }
    const next = page.locator('[data-next]');
    await expect(next).toBeFocused();

    // Con :focus-visible hay outline 2px (outline-style solid, width 2px, color var(--color-focus))
    await expect(next).toHaveCSS('outline-style', 'solid');
    await expect(next).toHaveCSS('outline-width', '2px');
    await expect(next).toHaveCSS('outline-color', 'rgb(199, 91, 18)');

    // 2. Pulsar Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-status]')).toHaveText(
      'Paso 2 de 6 · profundidad 2: Se llama a main(): su contexto entra al stack (push).'
    );
    await expect(page.locator('[data-depth]')).toHaveText('2');

    // 3. Pulsar Espacio
    await page.keyboard.press('Space');
    await expect(page.locator('[data-status]')).toHaveText(
      'Paso 3 de 6 · profundidad 3: Dentro de main(), se llama a saludar("Ana"): otro push.'
    );
    await expect(page.locator('[data-depth]')).toHaveText('3');
    // El foco sigue en el botón
    await expect(next).toBeFocused();
  });
});