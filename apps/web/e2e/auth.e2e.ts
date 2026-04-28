import { expect, test } from '@playwright/test';

test.describe('login route', () => {
	test('shows a clear error when login fails', async ({ page }) => {
		await page.route('**/auth/login', async (route) => {
			await route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify({
					ok: false,
					error: {
						code: 'INVALID_CREDENTIALS',
						message: 'Credenciales inválidas'
					}
				})
			});
		});

		await page.goto('/login');
		await page.waitForLoadState('networkidle');
		await page.getByLabel('Usuario').fill('admin');
		await page.getByLabel('Contraseña').fill('incorrecta');
		const loginRequest = page.waitForRequest('**/auth/login');
		await page.getByRole('button', { name: 'Ingresar' }).click();
		await loginRequest;

		await expect(page.getByText('Credenciales inválidas')).toBeVisible();
		await expect(page).toHaveURL(/\/login/);
	});

	test('redirects to next route when login succeeds', async ({ page }) => {
		await page.route('**/auth/login', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					ok: true,
					data: {
						user: { id: 1, nombreUsuario: 'admin', role: 'Administrador' },
						expiresAt: '2099-01-01T00:00:00.000Z'
					}
				})
			});
		});

		await page.route('**/auth/session', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					ok: true,
					data: {
						user: { id: 1, nombreUsuario: 'admin', role: 'Administrador' },
						expiresAt: '2099-01-01T00:00:00.000Z'
					}
				})
			});
		});

		await page.goto('/login?next=%2Fdashboard');
		await page.waitForLoadState('networkidle');
		await page.getByLabel('Usuario').fill('admin');
		await page.getByLabel('Contraseña').fill('password');
		const loginRequest = page.waitForRequest('**/auth/login');
		await page.getByRole('button', { name: 'Ingresar' }).click();
		await loginRequest;

		await expect(page).toHaveURL(/\/dashboard/);
	});
});
