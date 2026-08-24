import { expect, Page } from '@playwright/test';

// Vigila pageerror/console.error durante el test; devuelve el checker para afterEach.
export function watchPageErrors(page: Page): () => void {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  return () =>
    expect(errors, 'errores de consola durante el test').toEqual([]);
}

// Scroll instantáneo (desactiva scroll-behavior: smooth de la página).
export async function scrollToInstant(page: Page, y: number): Promise<void> {
  await page.evaluate((target) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, target);
  }, y);
}

export async function scrollBottomInstant(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

// scaleX actual de la barra de progreso (componente a de la matriz transform).
export async function scaleXOf(page: Page): Promise<number> {
  return page
    .locator('[data-progress]')
    .evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
}