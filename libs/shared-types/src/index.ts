export type UserId = string & { readonly __brand: 'UserId' };

export type Role = 'Administrador' | 'Vendedor' | 'Almacenista';

export function asUserId(value: string): UserId {
  return value as UserId;
}
