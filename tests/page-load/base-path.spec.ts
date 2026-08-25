import { test, expect } from '@playwright/test';

// QA gate GH Pages (repo-site): el sitio construido debe servir bajo /poo-js/.
// Corre contra `vite preview --port 4173` (npm run build previo). URLs absolutas:
// NO depende del baseURL de playwright.config.ts.
//
// ponytail: el build de Vite empaqueta CSS/JS en dist/assets/*.hash.* — los
// caminos dev (/poo-js/src/styles/main.css, /poo-js/src/js/main.js) no existen
// en dist/. Se asertan los artefactos reales del build con regex de sufijo.

const PREVIEW = 'http://localhost:4173';
const BASE = '/poo-js/';

test.describe('Base path /poo-js/ (build + preview)', () => {
  test('el sitio construido carga y todos sus recursos resuelven 200', async ({
    page,
    request,
  }) => {
    // 5. Sin errores de consola durante la carga (pageerror + console.error)
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    // 1. HTML base: 200 y h1 "El Contexto de Ejecución"
    const response = await page.goto(`${PREVIEW}${BASE}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('El Contexto de Ejecución');
    expect(errors).toEqual([]);

    // 2. Stylesheet bajo /poo-js/ (artefacto del build, hasheado) → 200
    const css = page.locator('link[rel="stylesheet"]');
    await expect(css).toHaveCount(1);
    const cssHref = (await css.getAttribute('href')) ?? '';
    expect(cssHref).toMatch(/^\/poo-js\/assets\/.+\.css$/);
    const cssResp = await request.get(`${PREVIEW}${cssHref}`);
    expect(cssResp.status()).toBe(200);

    // 3. Módulo JS bajo /poo-js/ (artefacto del build, hasheado) → 200
    const jsSrc = (await page
      .locator('script[type="module"]')
      .getAttribute('src')) ?? '';
    expect(jsSrc).toMatch(/^\/poo-js\/assets\/.+\.js$/);
    const jsResp = await request.get(`${PREVIEW}${jsSrc}`);
    expect(jsResp.status()).toBe(200);

    // 4. Logo en public/ → /poo-js/logo.png → 200
    const logoResp = await request.get(`${PREVIEW}${BASE}logo.png`);
    expect(logoResp.status()).toBe(200);
  });
});