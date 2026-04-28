import type { Role, UserId } from '@garras/shared-types';
import type { ApiResponse } from './responses';

export type UserSummary = {
  id: UserId;
  email: string;
  displayName: string;
  role: Role;
};

export type ListUsersResponse = ApiResponse<{
  users: UserSummary[];
}>;
