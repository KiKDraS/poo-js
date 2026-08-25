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

  test('El bloque de código contiene la clase Persona, herencia, campos privados y comentarios de versión', async ({
    page,
  }) => {
    // 1. Localizar el .code-block de #clases y leer su texto (textContent del pre)
    await page.goto('/');
    const codeBlock = page
      .locator('main section#clases pre.code-block')
      .first(); // bloque Persona — el 2º (flechas) lo cubre el escenario 8.8
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText('class Persona');
    await expect(codeBlock).toContainText('extends'); // class Estudiante extends Persona
    await expect(codeBlock).toContainText('#secreto'); // campo privado
    await expect(codeBlock).toContainText('super(nombre, edad)');
    await expect(codeBlock).toContainText('ES2015 (ES6)'); // comentario de versión
    await expect(codeBlock).toContainText('ES2022'); // campos/método privado
    await expect(codeBlock).toContainText(
      'SyntaxError — # es privado de verdad (ES2022)'
    );

    // 2. Verificar el hint del bloque
    await expect(
      page.locator('main section#clases p.code-block__hint').first() // 2 hints idénticos → .first()
    ).toHaveText('Pégalo en la consola de tu navegador o en Node.');
  });
});