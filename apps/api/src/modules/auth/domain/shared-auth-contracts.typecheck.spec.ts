import type { LoginRequest, LoginResponse, SessionResponse } from '@garras/api-contracts';

type LocalBrokenLoginResponse = {
	ok: true;
	data: {
		token: string;
		user: { id: string; email: string; role: 'admin' };
	};
};

type IsAssignable<From, To> = From extends To ? true : false;
type Assert<T extends true> = T;

describe('shared auth contracts (type-level)', () => {
	it('keeps API auth payloads aligned to shared contract', () => {
		type RequestShape = Assert<
			IsAssignable<LoginRequest, { nombreUsuario: string; contrasena: string }>
		>;

		type LoginSuccess = Extract<LoginResponse, { ok: true }>;
		type SessionSuccess = Extract<SessionResponse, { ok: true }>;

		type LoginHasContractUser = Assert<
			IsAssignable<LoginSuccess['data']['user'], SessionSuccess['data']['user']>
		>;

		void (true as RequestShape);
		void (true as LoginHasContractUser);
		expect(true).toBe(true);
	});

	it('rejects local divergent auth DTOs at compile-time', () => {
		// @ts-expect-error local DTO diverges from source-of-truth LoginResponse
		const nonCompliantLogin: Assert<IsAssignable<LocalBrokenLoginResponse, LoginResponse>> = true;

		void nonCompliantLogin;
		expect(true).toBe(true);
	});
});
