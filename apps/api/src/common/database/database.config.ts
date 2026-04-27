import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import type { PoolConfig } from 'pg';
import type { DatabaseConfig } from './database.types';

loadEnv({
  path: resolve(process.cwd(), '.env'),
  quiet: true,
});

const DEFAULT_DATABASE_HOST = 'localhost';
const DEFAULT_DATABASE_PORT = 5432;
const DEFAULT_DATABASE_NAME = 'mistrapitos';
const DEFAULT_DATABASE_USER = 'mistrapitos';
const DEFAULT_DATABASE_PASSWORD = 'mistrapitos';
const DEFAULT_POOL_MAX = 10;
const DEFAULT_IDLE_TIMEOUT_MS = 30_000;
const DEFAULT_CONNECTION_TIMEOUT_MS = 5_000;

function parseNumber(value: string | undefined, fallback: number, variableName: string): number {
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${variableName}: expected a positive integer.`);
  }

  return parsed;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }

  return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function resolveDatabaseConfig(env: NodeJS.ProcessEnv): DatabaseConfig {
  const url = env.DATABASE_URL?.trim() || undefined;

  return {
    url,
    host: env.DB_HOST?.trim() || DEFAULT_DATABASE_HOST,
    port: parseNumber(env.DB_PORT, DEFAULT_DATABASE_PORT, 'DB_PORT'),
    database: env.DB_NAME?.trim() || DEFAULT_DATABASE_NAME,
    user: env.DB_USER?.trim() || DEFAULT_DATABASE_USER,
    password: env.DB_PASSWORD?.trim() || DEFAULT_DATABASE_PASSWORD,
    ssl: parseBoolean(env.DB_SSL, false),
    maxConnections: parseNumber(env.DB_POOL_MAX, DEFAULT_POOL_MAX, 'DB_POOL_MAX'),
    idleTimeoutMs: parseNumber(
      env.DB_IDLE_TIMEOUT_MS,
      DEFAULT_IDLE_TIMEOUT_MS,
      'DB_IDLE_TIMEOUT_MS',
    ),
    connectionTimeoutMs: parseNumber(
      env.DB_CONNECTION_TIMEOUT_MS,
      DEFAULT_CONNECTION_TIMEOUT_MS,
      'DB_CONNECTION_TIMEOUT_MS',
    ),
  };
}

export function buildDatabaseUrl(config: DatabaseConfig): string {
  if (config.url) {
    return config.url;
  }

  return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

export function buildPoolConfig(config: DatabaseConfig): PoolConfig {
  const baseConfig: PoolConfig = {
    max: config.maxConnections,
    idleTimeoutMillis: config.idleTimeoutMs,
    connectionTimeoutMillis: config.connectionTimeoutMs,
  };

  const sslConfig = config.ssl ? { rejectUnauthorized: false } : undefined;

  if (config.url) {
    return {
      ...baseConfig,
      connectionString: config.url,
      ssl: sslConfig,
    };
  }

  return {
    ...baseConfig,
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ssl: sslConfig,
  };
}
