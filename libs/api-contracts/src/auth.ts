import type { Role, UserId } from '@garras/shared-types';
import type { ApiResponse } from './responses';

export type AuthUser = {
  id: UserId;
  nombreUsuario: string;
  role: Role;
};

export type LoginRequest = {
  nombreUsuario: string;
  contrasena: string;
};

export type LoginResponse = ApiResponse<{
  expiresAt: string;
  user: AuthUser;
}>;

export type SessionResponse = ApiResponse<{
  expiresAt: string;
  user: AuthUser;
}>;
