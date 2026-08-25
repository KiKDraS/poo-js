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

  test('La página carga con idioma español, título y estructura completa', async ({
    page,
  }) => {
    // 1. Navegar a la URL base y esperar a que cargue la red
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(
      'Contexto de Ejecución y this — JavaScript para principiantes'
    );

    // 2. Comprobar el atributo lang del elemento html
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    // 3. Contar las secciones dentro de main
    const sections = page.locator('main section');
    await expect(sections).toHaveCount(7);
    const expected = [
      ['#inicio', 'hero-title'],
      ['#contexto', 'contexto-title'],
      ['#this', 'this-title'],
      ['#estricto', 'estricto-title'],
      ['#poo', 'poo-title'],
      ['#clases', 'clases-title'],
      ['#resumen', 'resumen-title'],
    ];
    for (const [id, labelId] of expected) {
      await expect(page.locator(`main section${id}`)).toHaveAttribute(
        'aria-labelledby',
        labelId
      );
    }

    // 4. Comprobar main#contenido, header.site-header, footer.site-footer y nav.toc
    await expect(page.locator('main#contenido')).toBeVisible();
    const header = page.locator('header.site-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('position', 'sticky');
    await expect(page.locator('.footer__love')).toHaveText(
      'Hecho con ♥ para estudiantes de JavaScript'
    );
    const back = page.locator('.footer__back');
    await expect(back).toHaveText('Volver arriba ↑');
    await expect(back).toHaveAttribute('href', '#inicio');
    await expect(
      page.locator('nav.toc[data-toc]')
    ).toHaveAttribute('aria-label', 'Índice de la lección');

    // 5. Verificar los 6 enlaces .toc__link del TOC
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

    // 6. Verificar el script type="application/ld+json"
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(ld ?? '{}');
    expect(data['@type']).toBe('LearningResource');
    expect(data.inLanguage).toBe('es');
    expect(data.teaches).toHaveLength(6);
  });
});