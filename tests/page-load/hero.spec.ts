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

  test('Hero: título, premisa, badge y CTA', async ({ page }) => {
    await page.goto('/');

    // 1. Leer el h1#hero-title
    await expect(page.locator('h1#hero-title')).toHaveText(
      'El Contexto de Ejecución y el misterio de this'
    );

    // 2. Leer p.hero__kicker
    await expect(page.locator('.hero__kicker')).toHaveText(
      'JavaScript para principiantes'
    );

    // 3. Leer p.hero__premise
    const premise = await page.locator('.hero__premise').textContent();
    expect(premise?.trimStart().startsWith('Antes de las clases, antes de los frameworks:')).toBe(
      true
    );
    expect(premise).toContain('quién es realmente this');

    // 4. Leer p.hero__badge
    await expect(page.locator('.hero__badge')).toHaveText(
      'Enfoque pre-ES6 · Base para entender POO'
    );

    // 5. Comprobar a.hero__cta
    const cta = page.locator('a.hero__cta');
    await expect(cta).toHaveText('Empezar la lección');
    await expect(cta).toHaveAttribute('href', '#contexto');
    await expect(cta).toHaveClass(/btn btn--primary/);

    // 6. Verificar .hero-visual (aria-hidden=true)
    await expect(page.locator('.hero-visual')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    const frames = page.locator('.hero-visual .frame--hero');
    await expect(frames).toHaveCount(3);
    await expect(frames.nth(0)).toHaveText('saludar("Ana")');
    await expect(frames.nth(1)).toHaveText('main()');
    await expect(frames.nth(2)).toHaveText('global');
    await expect(frames.nth(2)).toHaveClass(/frame--lit/);
    await expect(page.locator('.hero-visual__caption')).toHaveText(
      'LIFO · el último en entrar, primero en salir'
    );
  });
});