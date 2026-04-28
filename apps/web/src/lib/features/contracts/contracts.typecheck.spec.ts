import { describe, expect, it } from 'vitest';
import type {
	ApiErrorResponse,
	ApiSuccessResponse,
	ListUsersResponse,
	LoginResponse
} from '@garras/api-contracts';

type LocalBrokenLoginResponse = {
	ok: true;
	data: {
		token: string;
		user: {
			id: string;
			email: string;
			role: 'admin';
		};
	};
};

type LocalBrokenUsersResponse = {
	ok: true;
	data: {
		users: Array<{
			id: string;
			email: string;
			displayName: string;
			role: 'owner';
		}>;
	};
};

type IsAssignable<From, To> = From extends To ? true : false;
type Assert<T extends true> = T;

describe('shared contracts type-compatibility', () => {
	it('accepts canonical shared response families', () => {
		type LoginSuccess = Extract<LoginResponse, { ok: true }>;
		type UsersSuccess = Extract<ListUsersResponse, { ok: true }>;

		const loginSuccessIsShared: Assert<
			IsAssignable<LoginSuccess, ApiSuccessResponse<LoginSuccess['data']>>
		> = true;

		const usersSuccessIsShared: Assert<
			IsAssignable<UsersSuccess, ApiSuccessResponse<UsersSuccess['data']>>
		> = true;

		const loginErrorIsShared: Assert<IsAssignable<ApiErrorResponse, LoginResponse>> = true;
		const usersErrorIsShared: Assert<IsAssignable<ApiErrorResponse, ListUsersResponse>> = true;

		void loginSuccessIsShared;
		void usersSuccessIsShared;
		void loginErrorIsShared;
		void usersErrorIsShared;
		expect(true).toBe(true);
	});

	it('detects local contract mismatches at compile time', () => {
		const brokenLogin = {} as LocalBrokenLoginResponse;
		const brokenUsers = {} as LocalBrokenUsersResponse;

		// @ts-expect-error local contract diverges from shared LoginResponse
		const nonCompliantLogin: Assert<IsAssignable<LocalBrokenLoginResponse, LoginResponse>> = true;
		// @ts-expect-error local contract diverges from shared ListUsersResponse
		const nonCompliantUsers: Assert<IsAssignable<LocalBrokenUsersResponse, ListUsersResponse>> = true;

		void brokenLogin;
		void brokenUsers;
		void nonCompliantLogin;
		void nonCompliantUsers;
		expect(true).toBe(true);
	});
});
