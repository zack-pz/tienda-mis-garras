import { describe, expect, it } from 'vitest';
import { getNavigationForRole } from './navigation.model';

describe('navigation model', () => {
	it('shows role-specific items', () => {
		const adminItems = getNavigationForRole('admin');

		expect(adminItems.map((item) => item.href)).toEqual([
			'/dashboard',
			'/users',
			'/inventory'
		]);
	});

	it('returns safe fallback for missing/unknown role', () => {
		expect(getNavigationForRole(undefined)).toEqual([{ title: 'Dashboard', href: '/dashboard' }]);
		expect(getNavigationForRole('super-admin')).toEqual([
			{ title: 'Dashboard', href: '/dashboard' }
		]);
	});
});
