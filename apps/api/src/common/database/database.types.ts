import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool, PoolConfig } from 'pg';
import type * as schema from './schemas/schema';

export interface DatabaseConfig {
  url?: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
  idleTimeoutMs: number;
  connectionTimeoutMs: number;
}

export interface DatabaseHealthStatus {
  ok: boolean;
}

export type DatabaseSchema = typeof schema;
export type DatabaseClient = NodePgDatabase<DatabaseSchema>;
export type DatabasePool = Pool;
export type DatabasePoolFactory = (config: PoolConfig) => Pool;
