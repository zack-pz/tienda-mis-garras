import { resolveApiUrl } from '$lib/shared/utils/resolve.api';
import type { LoginRequest, LoginResponse, SessionResponse } from '@garras/api-contracts';

export async function getSession(fetcher: typeof fetch): Promise<SessionResponse> {
  const response = await fetcher(resolveApiUrl('/auth/session'), {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    return { ok: false, error: { code: 'SESSION_EXPIRED', message: 'Sesión expirada' } };
  }

  return (await response.json()) as SessionResponse;
}

export async function login(fetcher: typeof fetch, payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetcher(resolveApiUrl('/auth/login'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return (await response.json()) as LoginResponse;
}
