import { test, expect } from '@playwright/test';
import { scaleXOf, scrollBottomInstant, watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('TOC sticky y scrollspy', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Barra de progreso de lectura', async ({ page }) => {
    // 1. Navegar a la URL base
    await page.goto('/');
    // scaleX = 0 (transform matrix con escala 0)
    await expect.poll(() => scaleXOf(page)).toBe(0);

    // 2. Scroll hasta el fondo (scrollTo(0, scrollHeight)) y esperar estabilización
    await scrollBottomInstant(page);
    await expect
      .poll(() => scaleXOf(page), { timeout: 3000 })
      .toBeGreaterThan(0.99);

    // 3. Volver arriba
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
    });
    await expect
      .poll(() => scaleXOf(page), { timeout: 3000 })
      .toBeLessThan(0.01);
  });
});