import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './+layout';

const mockGetSession = vi.fn();

vi.mock('$lib/features/auth/api/auth.api', () => ({
	getSession: (...args: unknown[]) => mockGetSession(...args)
}));

describe('(app) layout load', () => {
	beforeEach(() => {
		mockGetSession.mockReset();
	});

	it('redirects to /login when session is missing/expired', async () => {
		mockGetSession.mockResolvedValue({ ok: false, error: { code: 'SESSION_EXPIRED', message: 'expired' } });

		await expect(
			load({ fetch, url: new URL('http://localhost/dashboard') } as never),
		).rejects.toMatchObject({
			status: 302,
			location: '/login?next=%2Fdashboard'
		});
	});

	it('redirects to dashboard when role tries forbidden route', async () => {
		mockGetSession.mockResolvedValue({
			ok: true,
			data: {
				expiresAt: new Date().toISOString(),
				user: { id: '1', nombreUsuario: 'sell', role: 'Vendedor' }
			}
		});

		await expect(
			load({ fetch, url: new URL('http://localhost/users') } as never),
		).rejects.toMatchObject({ status: 302, location: '/dashboard' });
	});

	it('returns role for authorized path', async () => {
		mockGetSession.mockResolvedValue({
			ok: true,
			data: {
				expiresAt: new Date().toISOString(),
				user: { id: '1', nombreUsuario: 'admin', role: 'Administrador' }
			}
		});

		await expect(load({ fetch, url: new URL('http://localhost/users') } as never)).resolves.toEqual({
			role: 'Administrador'
		});
	});
});
