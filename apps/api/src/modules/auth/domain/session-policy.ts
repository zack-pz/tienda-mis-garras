export const INACTIVITY_TIMEOUT_MINUTES = 15;

export function createInactivityExpiry(from: Date): Date {
  return new Date(from.getTime() + INACTIVITY_TIMEOUT_MINUTES * 60_000);
}
