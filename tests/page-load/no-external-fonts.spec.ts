import { test, expect } from '@playwright/test';
import { watchPageErrors } from '../support';

// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

test.describe('Carga de página', () => {
  let checkErrors: () => void;

  test.beforeEach(async ({ page }) => {
    checkErrors = watchPageErrors(page);
  });

  test.afterEach(() => {
    checkErrors();
  });

  test('No hay Google Fonts CDN en el HTML', async ({ page }) => {
    await page.goto('/');

    // 1. Obtener el HTML completo (page.content())
    const html = await page.content();
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('fonts.gstatic.com');

    // Único stylesheet: /src/styles/main.css
    const stylesheets = page.locator('link[rel="stylesheet"]');
    await expect(stylesheets).toHaveCount(1);
    await expect(stylesheets).toHaveAttribute('href', '/src/styles/main.css');

    // 2. Comprobar el script del módulo
    // En dev, Vite inyecta su propio cliente (/@vite/client); el único módulo de
    // la app es /src/js/main.js, antes de </body>.
    const moduleScripts = page.locator('script[type="module"]');
    const moduleCount = await moduleScripts.count();
    expect(moduleCount).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < moduleCount; i++) {
      const src = await moduleScripts.nth(i).getAttribute('src');
      expect(src === '/src/js/main.js' || src?.startsWith('/@vite/')).toBe(
        true
      );
    }
    await expect(
      page.locator('script[type="module"][src="/src/js/main.js"]')
    ).toHaveCount(1);
    expect(html.indexOf('/src/js/main.js')).toBeGreaterThan(
      html.indexOf('</main>')
    );

    // 3. Verificar el favicon
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
  });
});