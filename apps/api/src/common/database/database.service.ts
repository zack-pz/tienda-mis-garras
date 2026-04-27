import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import * as schema from './schemas/schema';
import { DATABASE_CONFIG, DATABASE_POOL_FACTORY } from './database.constants';
import { buildPoolConfig } from './database.config';
import type {
  DatabaseClient,
  DatabaseConfig,
  DatabaseHealthStatus,
  DatabasePoolFactory,
} from './database.types';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly db: DatabaseClient;

  constructor(
    @Inject(DATABASE_CONFIG)
    readonly config: DatabaseConfig,
    @Inject(DATABASE_POOL_FACTORY)
    createPool: DatabasePoolFactory,
  ) {
    this.pool = createPool(buildPoolConfig(config));
    this.db = drizzle(this.pool, { schema });
  }

  get client(): DatabaseClient {
    return this.db;
  }

  get connectionPool(): Pool {
    return this.pool;
  }

  async checkConnection(): Promise<DatabaseHealthStatus> {
    const result = await this.pool.query<{ ok: number }>('select 1 as ok');

    return {
      ok: result.rows[0]?.ok === 1,
    };
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
