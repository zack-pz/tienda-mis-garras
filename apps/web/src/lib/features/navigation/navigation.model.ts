import type { Role } from '@garras/shared-types';

export type NavigationItem = {
	title: string;
	href: string;
};

const NAVIGATION_BY_ROLE: Record<Role, NavigationItem[]> = {
	admin: [
		{ title: 'Dashboard', href: '/dashboard' },
		{ title: 'Usuarios', href: '/users' },
		{ title: 'Inventario', href: '/inventory' }
	],
	staff: [
		{ title: 'Dashboard', href: '/dashboard' },
		{ title: 'Inventario', href: '/inventory' }
	],
	viewer: [{ title: 'Dashboard', href: '/dashboard' }]
};

const SAFE_FALLBACK: NavigationItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export function getNavigationForRole(role?: Role | string | null): NavigationItem[] {
	if (!role) return SAFE_FALLBACK;
	if (role in NAVIGATION_BY_ROLE) {
		return NAVIGATION_BY_ROLE[role as Role];
	}

	return SAFE_FALLBACK;
}
