import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';

describe('login schema', () => {
	it('accepts valid login payload', () => {
		expect(
			loginSchema.safeParse({
				nombreUsuario: 'admin',
				contrasena: 'password'
			}).success,
		).toBe(true);
	});

	it('requires username and password', () => {
		expect(loginSchema.safeParse({ nombreUsuario: '', contrasena: 'password' }).success).toBe(false);
		expect(loginSchema.safeParse({ nombreUsuario: 'admin', contrasena: '' }).success).toBe(false);
	});
});
