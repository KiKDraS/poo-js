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

  test('El sub-bloque "Las flechas y el POO": h3, código (saludarFlecha, call ignorado, TypeError) y callout "Trampa clásica"', async ({
    page,
  }) => {
    // 1. Navegar a la URL base y localizar main section#clases
    await page.goto('/');
    const section = page.locator('main section#clases');
    await expect(section).toBeVisible();
    // h3 del sub-bloque (2º h3 de #clases, tras el callout--pattern)
    await expect(
      section.locator('h3', { hasText: 'Las flechas y el POO' })
    ).toBeVisible();
    // #clases tiene exactamente 2 pre.code-block (bloque Persona + bloque flechas)
    await expect(section.locator('pre.code-block')).toHaveCount(2);

    // 2. Localizar el bloque de flechas (2º pre.code-block: filter hasText "FLECHAS Y POO") y leer su texto
    const arrow = section
      .locator('pre.code-block')
      .filter({ hasText: 'FLECHAS Y POO' });
    await expect(arrow).toBeVisible();
    await expect(arrow).toContainText('class Usuario');
    await expect(arrow).toContainText('saludarFlecha = () => {');
    await expect(arrow).toContainText('Campo-flecha: this = la instancia (léxico)');
    await expect(arrow).toContainText('const f = u.saludar;'); // Método extraído: pierde this
    await expect(arrow).toContainText('Método extraído: pierde this');
    await expect(arrow).toContainText('TypeError / undefined (regla por defecto)');
    await expect(arrow).toContainText('const g = u.saludarFlecha;'); // Flecha extraída: conserva this
    await expect(arrow).toContainText('Flecha extraída: conserva this');
    await expect(arrow).toContainText('"Hola, soy Ana" (auto-bind)');
    await expect(arrow).toContainText('u.saludarFlecha.call({ nombre: "Beto" })');
    await expect(arrow).toContainText('call ignorado'); // contraparte "call aplica" en u.saludar.call
    await expect(arrow).toContainText('new (() => {})');
    await expect(arrow).toContainText('TypeError — la flecha no es constructor');

    // hint del bloque de flechas (ambos hints son idénticos; lo scopeamos al split de flechas)
    const split = section.locator('.split', { hasText: 'FLECHAS Y POO' });
    await expect(split.locator('.code-block__hint')).toHaveText(
      'Pégalo en la consola de tu navegador o en Node.'
    );

    // 3. Verificar la prosa del 2º split (prose split__body del bloque de flechas)
    const prose = split.locator('.prose');
    await expect(prose).toContainText('La flecha no tiene this propio');
    await expect(prose).toContainText('lo hereda del ámbito donde nació (léxico)');
    await expect(prose).toContainText('call');
    await expect(prose).toContainText('apply');
    await expect(prose).toContainText('bind');
    await expect(prose).toContainText('new');
    await expect(prose).toContainText('TypeError');
    await expect(prose).toContainText('saludarFlecha = () => {}'); // copia por instancia
    await expect(prose).toContainText('auto-bind');
    await expect(prose).toContainText('setTimeout(this.saludarFlecha)');

    // 4. Localizar el .callout--trap de #clases (inmediatamente tras el split de flechas)
    const trap = section.locator('.callout--trap');
    await expect(trap).toBeVisible();
    await expect(trap.locator('.callout__label')).toHaveText('Trampa clásica');
    await expect(trap.locator('.callout__text')).toContainText(
      'Fuera de una clase, la flecha no captura el objeto.'
    );
    // HTML: `const o = { saluda: () =&gt; this.nombre }` → texto renderizado "=>"
    await expect(trap.locator('.callout__text')).toContainText(
      'const o = { saluda: () => this.nombre }'
    );
    await expect(trap.locator('.callout__text')).toContainText(
      'window en normal'
    );
    await expect(trap.locator('.callout__text')).toContainText(
      'undefined en estricto'
    );
  });
});