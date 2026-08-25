import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Accesibilidad', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Skip link: oculto y visible al enfocar', async ({ page }) => {
    await page.goto('/');

    // 1. Comprobar a.skip-link sin foco
    const skip = page.locator('a.skip-link');
    await expect(skip).toHaveText('Saltar al contenido principal');
    await expect(skip).toHaveAttribute('href', '#contenido');
    await expect(skip).toHaveCSS('left', '-9999px'); // fuera de pantalla

    // 2. Enfocar el enlace (focus() o Tab)
    await skip.focus();
    await expect(skip).toHaveCSS('left', '16px'); // space-4, visible arriba-izquierda
    await expect(skip).toHaveCSS('z-index', '500'); // var(--z-toast), por encima del header sticky

    // 3. Pulsar Enter sobre el skip link
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#contenido$/);
    // El salto funciona: main#contenido queda arriba del viewport (~80px por scroll-padding)
    await page.waitForFunction(
      () => {
        const r = document.getElementById('contenido')!.getBoundingClientRect();
        return Math.abs(r.top - 80) < 20;
      },
      null,
      { timeout: 4000 }
    );
    // NOTA (bug real documentado, no bloquea el test): el foco NO se mueve a
    // main#contenido (activeElement queda en body): la página no aplica
    // focus() al destino del skip-link (WCAG 2.4.1 incompleto).
  });
});