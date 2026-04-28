import { getSession } from '$lib/features/auth/api/auth.api';
import { clearSession, setSession } from '$lib/features/auth/state/session.store.svelte';
import { redirect } from '@sveltejs/kit';
import type { Role } from '@garras/shared-types';

export const ssr = false;

const ROLE_ALLOWED_PATHS: Record<Role, string[]> = {
	Administrador: ['/dashboard', '/users', '/inventory', '/suppliers'],
	Vendedor: ['/dashboard', '/inventory'],
	Almacenista: ['/dashboard', '/inventory', '/suppliers']
};

function isAllowedPath(role: Role, pathname: string): boolean {
	const allowed = ROLE_ALLOWED_PATHS[role] ?? [];
	return allowed.some((basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`));
}

export async function load({ fetch, url }) {
	const session = await getSession(fetch);

	if (!session.ok) {
		clearSession();
		throw redirect(302, `/login?next=${encodeURIComponent(url.pathname)}`);
	}

	setSession(session.data.user, session.data.expiresAt);

	if (!isAllowedPath(session.data.user.role, url.pathname)) {
		throw redirect(302, '/dashboard');
	}

	return { role: session.data.user.role };
}
