import type { Role, UserId } from '@garras/shared-types';

export type AuthenticatedUser = {
  id: UserId;
  nombreUsuario: string;
  role: Role;
};

export type ActiveAuthSession = {
  user: AuthenticatedUser;
  expiresAt: Date;
};
