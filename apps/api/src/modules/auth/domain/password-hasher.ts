import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PREFIX = 'scrypt';

export function hashPassword(plainText: string): string {
  const salt = randomBytes(16).toString('hex');
  const digest = scryptSync(plainText, salt, 64).toString('hex');
  return `${PREFIX}$${salt}$${digest}`;
}

export function verifyPassword(plainText: string, storedHash: string): boolean {
  const [prefix, salt, digest] = storedHash.split('$');
  if (prefix !== PREFIX || !salt || !digest) {
    return false;
  }

  const candidate = scryptSync(plainText, salt, 64);
  const persisted = Buffer.from(digest, 'hex');

  if (candidate.length !== persisted.length) {
    return false;
  }

  return timingSafeEqual(candidate, persisted);
}
