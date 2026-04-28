import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AppShell from './app-shell.svelte';

describe('app-shell', () => {
	it('renders shell and role-based navigation', async () => {
		render(AppShell, {
			role: 'staff'
		});

		await expect.element(page.getByRole('heading', { level: 2 })).toHaveTextContent('Mis Garras');
		await expect.element(page.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Inventario' })).toBeInTheDocument();
	});
});
