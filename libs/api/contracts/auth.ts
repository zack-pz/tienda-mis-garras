import type { Role, UserId } from '@garras/shared-types';
import type { ApiResponse } from './responses';

export type AuthUser = {
  id: UserId;
  email: string;
  role: Role;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = ApiResponse<{
  accessToken: string;
  user: AuthUser;
}>;
