import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Modo oscuro (prefers-color-scheme)', () => {
  test.use({ colorScheme: 'dark' });

  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Dark mode: fondo y texto oscuros', async ({ page, browser }) => {
    // 1. Contexto colorScheme dark y navegar
    await page.goto('/');
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(16, 21, 31)' // #10151f
    );
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(232, 228, 216)'); // #e8e4d8

    // 2. Comprobar el token en :root
    const token = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg')
        .trim()
    );
    expect(token).toBe('#10151f');

    // 3. Verificar que no cambia el layout
    const darkWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const lightPage = await browser.newPage({ colorScheme: 'light' });
    await lightPage.goto('/');
    const lightWidth = await lightPage.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(darkWidth).toBe(lightWidth);
    await lightPage.close();

    // Interactivos operativos en dark
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-status]')).toHaveText(/Paso 2 de 6/);
  });
});