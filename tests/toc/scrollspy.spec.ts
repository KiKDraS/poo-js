import { test, expect } from '@playwright/test';
import { scaleXOf, watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

const SECTIONS = ['contexto', 'estricto', 'this', 'poo', 'clases', 'resumen'];

test.describe('TOC sticky y scrollspy', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Scrollspy: la sección en la banda central activa su enlace', async ({
    page,
  }) => {
    // 1. Navegar a la URL base (scrollY=0)
    await page.goto('/');
    await page.waitForTimeout(300); // deja que el IntersectionObserver inicial dispare
    // La banda 45-50% cae en el hero: ningún enlace activo al inicio
    await expect(page.locator('.toc__link.is-active')).toHaveCount(0);

    // Scroll instantáneo (sin animación smooth) para el resto del test
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    });

    // 2. Para cada objetivo: scrollTo(0, offsetTop - 1) y esperar .is-active
    let previous = '';
    for (const id of SECTIONS) {
      await page.evaluate(
        (sectionId) =>
          window.scrollTo(0, document.getElementById(sectionId)!.offsetTop - 1),
        id
      );
      const link = page.locator(`.toc__link[href="#${id}"]`);
      await page.waitForFunction(
        (sectionId) =>
          document
            .querySelector(`.toc__link[href="#${sectionId}"]`)
            ?.classList.contains('is-active'),
        id,
        { timeout: 3000 }
      );
      // Solo el enlace de la sección en banda tiene .is-active + aria-current="true"
      await expect(page.locator('.toc__link.is-active')).toHaveCount(1);
      await expect(link).toHaveClass(/is-active/);
      await expect(link).toHaveAttribute('aria-current', 'true');
      // El enlace anterior pierde .is-active y aria-current (atributo eliminado)
      if (previous) {
        const prevLink = page.locator(`.toc__link[href="#${previous}"]`);
        await expect(prevLink).not.toHaveClass(/is-active/);
        await expect(prevLink).not.toHaveAttribute('aria-current', 'true');
      }
      previous = id;
    }

    // 3. Scroll hasta el final y comprobar la barra de progreso
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight)
    );
    await expect
      .poll(() => scaleXOf(page), { timeout: 3000 })
      .toBeGreaterThan(0.99);
    await expect(page.locator('.progress')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});