import type { AuthUser } from '@garras/api-contracts';

export type SessionState = {
	user: AuthUser | null;
	expiresAt: string | null;
};

export const sessionState = $state<SessionState>({
	user: null,
	expiresAt: null
});

export function clearSession(): void {
	sessionState.user = null;
	sessionState.expiresAt = null;
}

export function setSession(user: AuthUser, expiresAt: string): void {
	sessionState.user = user;
	sessionState.expiresAt = expiresAt;
}
