import { expect, test } from '@playwright/test';

test('renders /login and submits credentials', async ({ page }) => {
	await page.route('**/auth/session', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				ok: true,
				data: {
					expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
					user: { id: '1', nombreUsuario: 'admin', role: 'Administrador' }
				}
			})
		});
	});

	await page.route('**/auth/login', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				ok: true,
				data: {
					expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
					user: { id: '1', nombreUsuario: 'admin', role: 'Administrador' }
				}
			})
		});
	});

	await page.goto('/login');
	await page.waitForLoadState('networkidle');
	await page.getByLabel('Usuario').fill('admin');
	await page.getByLabel('Contraseña').fill('password');
	const loginRequest = page.waitForRequest('**/auth/login');
	await page.getByRole('button', { name: 'Ingresar' }).click();
	await loginRequest;
	await expect(page).toHaveURL(/\/dashboard$/);
});

test('shows safe error on invalid credentials', async ({ page }) => {
	await page.route('**/auth/login', async (route) => {
		await route.fulfill({
			status: 401,
			contentType: 'application/json',
			body: JSON.stringify({
				ok: false,
				error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' }
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

	await expect(page).toHaveURL(/\/login$/);
	await expect(page.getByText('Credenciales inválidas')).toBeVisible();
});

test('redirects to /login when app session is expired', async ({ page }) => {
	await page.route('**/auth/session', async (route) => {
		await route.fulfill({
			status: 401,
			contentType: 'application/json',
			body: JSON.stringify({ ok: false, error: { code: 'SESSION_EXPIRED', message: 'expired' } })
		});
	});

	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
});

test('redirects forbidden role access to dashboard', async ({ page }) => {
	await page.route('**/auth/session', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				ok: true,
				data: {
					expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
					user: { id: '2', nombreUsuario: 'vendedor', role: 'Vendedor' }
				}
			})
		});
	});

	await page.goto('/users');
	await expect(page).toHaveURL(/\/dashboard$/);
});
