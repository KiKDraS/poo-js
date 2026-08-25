import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Responsive (viewport 375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Sin overflow horizontal en 375px', async ({ page }) => {
    // 1. Contexto 375x812, medir documentElement.scrollWidth vs clientWidth
    // Guard de regresión: el bug conocido (figure.stack-diagram con white-space
    // nowrap → scrollWidth 454px > 375px) ya está corregido; este test lo vigila.
    await page.goto('/');
    const dims = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth);

    // 2. Verificar interacción en 375px a pesar del desbordamiento
    // Scroll vertical funcional
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    // #stack-demo operativo
    await page.locator('#stack-demo').scrollIntoViewIfNeeded();
    await page.locator('[data-next]').click();
    await expect(page.locator('[data-depth]')).toHaveText('2');

    // #strict-demo operativo
    await page.locator('#strict-demo').scrollIntoViewIfNeeded();
    await page.locator('[data-strict-switch]').click();
    await expect(page.locator('[data-strict-badge]')).toHaveText(
      'modo estricto'
    );
  });
});