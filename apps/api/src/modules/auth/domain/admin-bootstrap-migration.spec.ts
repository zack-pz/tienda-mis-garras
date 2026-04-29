import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { verifyPassword } from './password-hasher';

describe('admin bootstrap migration', () => {
	it('defines initial admin credentials that are operational', () => {
		const migration = readFileSync(join(process.cwd(), 'drizzle/0004_auth-session-bootstrap.sql'), 'utf8');

		expect(migration).toContain("'admin'");
		expect(migration).toContain("WHERE r.nombre = 'Administrador'");
		expect(migration).not.toContain('CAMBIAR_POR_HASH_SEGURO');

		const hashMatch = migration.match(/'scrypt\$[^']+'/);
		expect(hashMatch).not.toBeNull();

		const passwordHash = (hashMatch?.[0] ?? '').slice(1, -1);
		expect(verifyPassword('password', passwordHash)).toBe(true);
		expect(verifyPassword('invalid-password', passwordHash)).toBe(false);
	});
});
