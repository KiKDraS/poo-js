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

  test('A11y: orden de encabezados intacto y todos los aria-labelledby resueltos', async ({
    page,
  }) => {
    // 1. Recorrer los encabezados de main (h1, h2, h3) en orden de documento
    await page.goto('/');
    const heads = await page
      .locator('main h1, main h2, main h3, main h4, main h5, main h6')
      .evaluateAll((els) =>
        els.map((h) => ({ level: Number(h.tagName[1]), id: h.id }))
      );

    const h1s = heads.filter((h) => h.level === 1);
    expect(h1s).toHaveLength(1);
    expect(h1s[0].id).toBe('hero-title');

    const h2s = heads.filter((h) => h.level === 2).map((h) => h.id);
    expect(h2s).toEqual([
      'contexto-title',
      'estricto-title',
      'this-title',
      'poo-title',
      'clases-title',
      'resumen-title',
    ]);

    // Ningún nivel saltado: todos los h3 cuelgan de un h2 inmediatamente anterior,
    // no hay h3 antes del primer h2 ni niveles h4+.
    const only123 = heads.every((h) => h.level <= 3);
    expect(only123).toBe(true);
    const firstH2 = heads.findIndex((h) => h.level === 2);
    const beforeFirstH2 = heads.slice(0, firstH2);
    expect(beforeFirstH2.every((h) => h.level === 1)).toBe(true);
    // Orden intacto: h1 → h2s → h3s, sin que un h3 preceda a su h2
    let sawH2 = false;
    for (const h of heads) {
      if (h.level === 2) sawH2 = true;
      if (h.level === 3) expect(sawH2).toBe(true);
    }

    // 2. Para cada section de main, resolver su aria-labelledby
    const sections = await page
      .locator('main section')
      .evaluateAll((secs) =>
        secs.map((s) => {
          const ref = s.getAttribute('aria-labelledby');
          const target = ref ? document.getElementById(ref) : null;
          return {
            id: s.id,
            ref,
            targetExists: !!target,
            targetIsHeading: !!target && /^H[1-6]$/.test(target.tagName),
          };
        })
      );
    expect(sections).toHaveLength(7);
    for (const s of sections) {
      expect(s.ref, `section#${s.id} sin aria-labelledby`).toBeTruthy();
      expect(s.targetExists, `aria-labelledby "${s.ref}" sin resolver`).toBe(
        true
      );
      expect(s.targetIsHeading, `objetivo de #${s.id} no es un encabezado`).toBe(
        true
      );
    }
  });
});