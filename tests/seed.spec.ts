import { test, expect } from '@playwright/test';

// spec: specs/test-plan.md
// Seed de la landing: carga la página base con la que arrancan las suites 2-7.

test('seed: la página base carga', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(
    'Contexto de Ejecución y this — JavaScript para principiantes'
  );
});