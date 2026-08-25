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

  test('La sección #clases existe, está entre #poo y #resumen y está bien cableada', async ({
    page,
  }) => {
    // 1. Navegar a la URL base y localizar main section#clases
    await page.goto('/');
    const section = page.locator('main section#clases');
    await expect(section).toBeVisible();
    await expect(section).toHaveClass(/section/);

    // 2. Verificar la posición en el orden de secciones
    const ids = await page.locator('main section').evaluateAll((secs) =>
      secs.map((s) => s.id)
    );
    expect(ids).toEqual([
      'inicio',
      'contexto',
      'this',
      'estricto',
      'poo',
      'clases',
      'resumen',
    ]);

    // 3. Leer el número de sección y el encabezado
    await expect(section.locator('.section__num')).toHaveText('05 · Clases ES6');
    await expect(page.locator('h2#clases-title')).toHaveText(
      'Clases ES6: la POO moderna'
    );

    // 4. Verificar aria-labelledby y su objetivo
    await expect(section).toHaveAttribute('aria-labelledby', 'clases-title');
    expect(
      await page.evaluate(() => !!document.getElementById('clases-title'))
    ).toBe(true);

    // 5. Contar elementos [data-reveal] dentro de #clases
    // 9: header, prose, split Persona, callout--pattern, h3 Arrow Functions, split Arrow Functions,
    //    callout--trap, h3 versiones, table-wrap (el sub-bloque de Arrow Functions añade 3)
    await expect(section.locator('[data-reveal]')).toHaveCount(9);
  });
});