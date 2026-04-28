export type UserId = string & { readonly __brand: 'UserId' };

export type Role = 'admin' | 'staff' | 'viewer';

export function asUserId(value: string): UserId {
  return value as UserId;
}
