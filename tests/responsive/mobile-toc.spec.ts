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

  test('TOC y header en móvil: chips scrollables, marca colapsada', async ({
    page,
  }) => {
    // 1. Contexto viewport 375x812 y navegar
    await page.goto('/');
    await expect(page.locator('header.site-header')).toHaveCSS(
      'position',
      'sticky'
    );
    // Marca: logo visible, contenido dentro de la altura del header (4rem)
    const logo = page.locator('.brand__logo');
    await expect(logo).toBeVisible();
    const logoBox = await logo.boundingBox();
    const headerBox = await page.locator('header.site-header').boundingBox();
    expect(logoBox!.height).toBeCloseTo(32, 0); // 2rem
    expect(logoBox!.height).toBeLessThanOrEqual(headerBox!.height);

    // 2. Comprobar .toc__list
    const list = page.locator('.toc__list');
    await expect(list).toHaveCSS('overflow-x', 'auto');
    const dims = await list.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(dims.scrollWidth).toBeGreaterThan(dims.clientWidth);

    // 3. Verificar los 6 enlaces .toc__link
    await expect(page.locator('.toc__link')).toHaveCount(6);
    for (const href of [
      '#contexto',
      '#this',
      '#estricto',
      '#poo',
      '#clases',
      '#resumen',
    ]) {
      await expect(page.locator(`.toc__link[href="${href}"]`)).toHaveCount(1);
    }

    // 4. Comprobar el layout del stepper en móvil
    await page.locator('#stack-demo').scrollIntoViewIfNeeded();
    const panel = page.locator('#stack-demo .stack-demo__panel');
    const stage = page.locator('#stack-demo .stack-demo__stage');
    await expect(panel).toBeVisible();
    await expect(stage).toBeVisible();
    // Apilados verticalmente (media max: 52rem), sin solapamiento
    const gap = await page
      .locator('#stack-demo .stack-demo__layout')
      .evaluate((el) => {
        const p = el
          .querySelector('.stack-demo__panel')!
          .getBoundingClientRect();
        const s = el.querySelector('.stack-demo__stage')!.getBoundingClientRect();
        return s.top - p.bottom;
      });
    expect(gap).toBeGreaterThanOrEqual(0);
  });
});