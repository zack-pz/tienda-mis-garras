import { INestApplication } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/modules/auth/auth.module';
import { LoginLocalUseCase } from '../src/modules/auth/application/use-cases/login-local.use-case';
import { DrizzleAuthSessionRepository } from '../src/modules/auth/infrastructure/persistence/drizzle/repositories/drizzle-auth-session.repository';
import { DrizzleAuthUserRepository } from '../src/modules/auth/infrastructure/persistence/drizzle/repositories/drizzle-auth-user.repository';
import { configurePlatform } from '../src/common/http/platform-bootstrap';

function readSidCookie(setCookieHeader: string | string[] | undefined): string {
	const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : setCookieHeader ? [setCookieHeader] : [];
	const sidCookie = cookies.find((cookie) => cookie.startsWith('sid='));

	if (!sidCookie) {
		throw new Error('Expected sid cookie in Set-Cookie header');
	}

	return sidCookie;
}

describe('Auth sessions (e2e)', () => {
	let app: INestApplication<App>;

	const sessions = new Map<string, { revoked: boolean; role: 'Administrador' | 'Vendedor' | 'Almacenista' }>();

	const sessionsRepoMock = {
		createSession: jest.fn(),
		resolveCalls: 0,
		resolveSession: jest.fn(async (sessionId: string) => {
			sessionsRepoMock.resolveCalls += 1;
			const session = sessions.get(sessionId);
			if (!session || session.revoked) return null;
			if (sessionId === 'expired-session') return null;
			return {
				user: { id: '1' as import('@garras/shared-types').UserId, nombreUsuario: 'admin', role: session.role },
				expiresAt: new Date(Date.now() + 15 * 60_000)
			};
		}),
		revokeSession: jest.fn(async (sessionId: string) => {
			const current = sessions.get(sessionId);
			if (!current) return;
			sessions.set(sessionId, { ...current, revoked: true });
		})
	};

	const loginUseCaseMock = {
		execute: jest.fn(async ({ nombreUsuario, contrasena }: { nombreUsuario: string; contrasena: string }) => {
			if (nombreUsuario !== 'admin' || contrasena !== 'password') {
				throw new UnauthorizedException('Credenciales inválidas');
			}

			sessions.set('active-session', { revoked: false, role: 'Administrador' });
			return {
				sessionId: 'active-session',
				response: {
					ok: true,
					data: {
						expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
						user: { id: '1' as import('@garras/shared-types').UserId, nombreUsuario: 'admin', role: 'Administrador' }
					}
				}
			};
		})
	};

	beforeEach(async () => {
		sessions.clear();
		jest.clearAllMocks();
		sessionsRepoMock.resolveCalls = 0;

		const moduleRef = await Test.createTestingModule({ imports: [AuthModule] })
			.overrideProvider(LoginLocalUseCase)
			.useValue(loginUseCaseMock)
			.overrideProvider(DrizzleAuthUserRepository)
			.useValue({ findByUsername: jest.fn() })
			.overrideProvider(DrizzleAuthSessionRepository)
			.useValue(sessionsRepoMock)
			.compile();

		app = moduleRef.createNestApplication();
		configurePlatform(app);
		await app.init();
	});

	afterEach(async () => {
		if (app) await app.close();
	});

	it('login sets sid cookie, then session resolves and logout revokes it', async () => {
		const loginResponse = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ nombreUsuario: 'admin', contrasena: 'password' })
			.expect(200);

		const sidCookie = readSidCookie(loginResponse.headers['set-cookie']);
		expect(sidCookie).toContain('HttpOnly');

		await request(app.getHttpServer()).get('/auth/session').set('Cookie', sidCookie).expect(200);

		await request(app.getHttpServer()).post('/auth/logout').set('Cookie', sidCookie).expect(200);

		await request(app.getHttpServer()).get('/auth/session').set('Cookie', sidCookie).expect(401);
	});

	it('returns 401 when session is expired', async () => {
		await request(app.getHttpServer())
			.get('/auth/session')
			.set('Cookie', 'sid=expired-session')
			.expect(401);
	});

	it('returns predictable 401 for invalid login credentials', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ nombreUsuario: 'admin', contrasena: 'invalid-password' })
			.expect(401);

		expect(response.body).toMatchObject({
			statusCode: 401,
			error: 'Unauthorized',
			message: 'Credenciales inválidas',
			path: '/auth/login'
		});
	});

	it('touches session activity by extending expiry on each valid /auth/session request', async () => {
		const loginResponse = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ nombreUsuario: 'admin', contrasena: 'password' })
			.expect(200);

		const sidCookie = readSidCookie(loginResponse.headers['set-cookie']);

		const first = await request(app.getHttpServer())
			.get('/auth/session')
			.set('Cookie', sidCookie)
			.expect(200);

		await new Promise((resolve) => setTimeout(resolve, 20));

		const second = await request(app.getHttpServer())
			.get('/auth/session')
			.set('Cookie', sidCookie)
			.expect(200);

		expect(new Date(second.body.data.expiresAt).getTime()).toBeGreaterThan(
			new Date(first.body.data.expiresAt).getTime(),
		);
		expect(sessionsRepoMock.resolveSession).toHaveBeenCalledTimes(2);
		expect(sessionsRepoMock.resolveCalls).toBe(2);
	});
});
