import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

const LINKS = ['#contexto', '#estricto', '#this', '#poo', '#clases', '#resumen'];

test.describe('TOC sticky y scrollspy', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('Los 6 enlaces del TOC navegan a sus secciones', async ({ page }) => {
    await page.goto('/');

    // 1. Para cada .toc__link: clic y esperar a que window.scrollY se estabilice
    //    (scroll-behavior: smooth; scroll-padding-top lleva la sección a ~80px)
    for (const href of LINKS) {
      await page.click(`.toc__link[href="${href}"]`);
      await page.waitForFunction(
        (h) => {
          const el = document.getElementById(h.slice(1));
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return Math.abs(r.top - 80) < 5 && r.bottom > 0;
        },
        href,
        { timeout: 4000 }
      );
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      const rect = await page
        .locator(href)
        .evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom };
        });
      expect(Math.abs(rect.top - 80)).toBeLessThan(15);
      expect(rect.bottom).toBeGreaterThan(0);
    }

    // 2. Verificar el header fijo tras scroll profundo
    const header = page.locator('header.site-header');
    await expect(header).toHaveCSS('position', 'sticky');
    await expect(header).toBeVisible();

    // 3. Pulsar .footer__back "Volver arriba ↑"
    await page.locator('.footer__back').click();
    await page.waitForFunction(
      () => location.hash === '#inicio',
      null,
      { timeout: 4000 }
    );
    await page.waitForFunction(
      () => document.getElementById('inicio')!.getBoundingClientRect().top < 200,
      null,
      { timeout: 4000 }
    );
    await expect(page.locator('h1#hero-title')).toBeInViewport();
  });
});