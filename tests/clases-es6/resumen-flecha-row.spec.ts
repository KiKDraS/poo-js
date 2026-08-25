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

  test('La tabla "Las 4 reglas de this de un vistazo" tiene la fila "Flecha (excepción)" al final', async ({
    page,
  }) => {
    // 1. Navegar y localizar la tabla de las 4 reglas en main section#resumen
    // (table.sheet cuyo texto incluye el caption "Las 4 reglas de this de un vistazo")
    await page.goto('/');
    const section = page.locator('main section#resumen');
    const table = section.locator('table.sheet').filter({
      hasText: 'Las 4 reglas de this de un vistazo',
    });
    await expect(table).toBeVisible();
    await expect(table.locator('caption')).toHaveText(
      'Las 4 reglas de this de un vistazo'
    );
    const heads = table.locator('thead th');
    await expect(heads).toHaveCount(3);
    await expect(heads.nth(0)).toHaveText('Regla');
    await expect(heads.nth(1)).toHaveText('Cómo llamas');
    await expect(heads.nth(2)).toHaveText('this es…');
    for (let i = 0; i < 3; i++) {
      await expect(heads.nth(i)).toHaveAttribute('scope', 'col');
    }

    // 2. Verificar las filas del tbody (5 filas: 4 reglas + flecha)
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(5);
    const last = rows.last();
    await expect(last.locator('th')).toHaveText('Flecha (excepción)');
    await expect(last.locator('th')).toHaveAttribute('scope', 'row');
    await expect(last.locator('td').nth(0)).toHaveText('() => {}');
    await expect(last.locator('td').nth(1)).toContainText(
      'el this de donde nació (léxico)'
    );
    await expect(last.locator('td').nth(1)).toContainText('ignora call/bind');
    await expect(last.locator('td').nth(1)).toContainText('no es constructor');

    // 3. Verificar que las 4 filas previas se mantienen en orden (regresión interna)
    const rowHeads = await table.locator('tbody tr th').allTextContents();
    expect(rowHeads.map((t) => t.trim())).toEqual([
      'Por defecto',
      'Implícita',
      'Explícita',
      'Con new',
      'Flecha (excepción)',
    ]);
  });
});