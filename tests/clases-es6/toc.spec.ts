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

  test('El enlace del TOC "Clases" está entre POO y Resumen y navega a #clases', async ({
    page,
  }) => {
    // 1. Localizar los enlaces .toc__link y comprobar el orden
    await page.goto('/');
    const tocLinks = page.locator('.toc__link');
    await expect(tocLinks).toHaveCount(6);
    const toc = [
      ['Contexto', '#contexto'],
      ['Estricto', '#estricto'],
      ['this', '#this'],
      ['POO', '#poo'],
      ['Clases', '#clases'],
      ['Resumen', '#resumen'],
    ];
    for (let i = 0; i < toc.length; i++) {
      await expect(tocLinks.nth(i)).toHaveText(toc[i][0]);
      await expect(tocLinks.nth(i)).toHaveAttribute('href', toc[i][1]);
    }

    // 2. Clic en el enlace "Clases" y esperar a que el scroll se estabilice
    await page.locator('.toc__link[href="#clases"]').click();
    await page.waitForFunction(
      () => {
        const el = document.getElementById('clases')!;
        const r = el.getBoundingClientRect();
        return Math.abs(r.top - 80) < 5 && r.bottom > 0;
      },
      null,
      { timeout: 4000 }
    );
    await expect(page).toHaveURL(/#clases$/);
    const rect = await page
      .locator('main section#clases')
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      });
    expect(Math.abs(rect.top - 80)).toBeLessThan(15);
    expect(rect.bottom).toBeGreaterThan(0);

    // 3. Volver arriba y clicar el enlace "POO"
    await page.locator('.toc__link[href="#poo"]').click();
    await page.waitForFunction(
      () => {
        const el = document.getElementById('poo')!;
        const r = el.getBoundingClientRect();
        return Math.abs(r.top - 80) < 5 && r.bottom > 0;
      },
      null,
      { timeout: 4000 }
    );
    await expect(page).toHaveURL(/#poo$/);
  });
});