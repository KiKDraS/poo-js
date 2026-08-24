import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Carga de página', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Contenido de enseñanza y ejemplos pre-ES6 (var, no const)', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Contar <span class="tok-kw">var</span> en el HTML renderizado
    // Nota: la página real tiene 5 tokens var (hoisting, Reglas 2-4 y #poo);
    // el plan citaba "≥7" pero sus propios ejemplos enumeran 4. El umbral ≥5
    // vigila que ningún ejemplo var desaparezca.
    const varCount = await page.evaluate(
      () =>
        [...document.querySelectorAll('span.tok-kw')].filter(
          (el) => el.textContent === 'var'
        ).length
    );
    expect(varCount).toBeGreaterThanOrEqual(5);

    const codeBlocks = await page.locator('.code-block').allTextContents();
    const code = codeBlocks.join('\n');
    expect(code).toContain('var ana = { nombre: "Ana" };'); // Regla 2
    expect(code).toContain('var fija = foo.bind(objeto);'); // Regla 3
    expect(code).toContain('var ana = new Persona("Ana");'); // Regla 4 y #poo

    // 2. Buscar el token const en bloques de código
    const constCount = await page.evaluate(
      () =>
        [...document.querySelectorAll('.code-block span.tok-kw')].filter(
          (el) => el.textContent === 'const'
        ).length
    );
    expect(constCount).toBe(0);

    // 3. Verificar strings clave en el texto visible
    await expect(page.locator('h2#contexto-title')).toHaveText(
      'Contexto de Ejecución'
    );
    await expect(
      page.locator('.section__num', { hasText: '01 · Contexto de Ejecución' })
    ).toHaveText('01 · Contexto de Ejecución');
    await expect(page.locator('h2#this-title')).toHaveText(
      'this y las 4 reglas'
    );
    await expect(page.locator('.rule-card__title').first()).toHaveText(
      'Por defecto'
    );
    await expect(
      page.locator('.section__num', {
        hasText: '03 · Modo estricto vs normal',
      })
    ).toHaveText('03 · Modo estricto vs normal');
    expect(code.split('Persona').length - 1).toBeGreaterThanOrEqual(2); // #poo y Regla 4
    expect(code).toContain('Hola, soy Ana');

    // 4. Verificar los 5 h2 y referencias MDN
    const h2s = await page.locator('main h2').allTextContents();
    expect(h2s.map((t) => t.trim())).toEqual([
      'Contexto de Ejecución',
      'this y las 4 reglas',
      'Modo estricto vs normal',
      'Puente a la POO',
      'Resumen (cheat sheet)',
    ]);
    const mdn = page.locator('footer a[href^="https://developer.mozilla.org"]');
    await expect(mdn).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(mdn.nth(i)).toHaveAttribute('target', '_blank');
      await expect(mdn.nth(i)).toHaveAttribute('rel', 'noopener');
    }
  });
});