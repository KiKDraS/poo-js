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

  test('La tabla timeline tiene 4 filas con cabeceras Característica/Versión/Año y las versiones clave', async ({
    page,
  }) => {
    // 1. Localizar la tabla .sheet de #clases (h3 "Versiones de ECMAScript" precediéndola)
    await page.goto('/');
    const section = page.locator('main section#clases');
    await expect(section.locator('h3', { hasText: 'Versiones de ECMAScript' })).toBeVisible();
    const table = section.locator('table.sheet');
    await expect(table).toBeVisible();
    const heads = table.locator('thead th');
    await expect(heads).toHaveCount(3);
    await expect(heads.nth(0)).toHaveText('Característica');
    await expect(heads.nth(1)).toHaveText('Versión');
    await expect(heads.nth(2)).toHaveText('Año');
    for (let i = 0; i < 3; i++) {
      await expect(heads.nth(i)).toHaveAttribute('scope', 'col');
    }
    await expect(table.locator('tbody tr')).toHaveCount(4);
    await expect(table.locator('caption')).toHaveText(
      'Versiones de ECMAScript de las características de clase'
    );
    await expect(table.locator('caption')).toHaveClass(/visually-hidden/);

    // 2. Leer los valores de la columna Versión
    const versionCells = await table
      .locator('tbody td:nth-child(2)')
      .allTextContents();
    expect(versionCells.join(' | ')).toContain('ES6 · ES2015'); // class/constructor/extends/super/static
    expect(versionCells.join(' | ')).toContain('ES2022 (ES13)'); // campos públicos y campos/métodos privados #
    expect(versionCells.join(' | ')).toContain('ES5 (2009) · en clase: ES6'); // get/set

    // 3. Verificar años
    const yearCells = await table.locator('tbody td:nth-child(3)').allTextContents();
    expect(yearCells.join(' | ')).toContain('2015');
    expect(yearCells.join(' | ')).toContain('2022');
  });
});