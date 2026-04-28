import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { DATABASE_CONFIG, DATABASE_POOL_FACTORY } from './database.constants';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';
import type { DatabaseConfig, DatabasePoolFactory } from './database.types';

describe('DatabaseService', () => {
  let moduleRef: TestingModule;
  let service: DatabaseService;
  let queryMock: jest.Mock;
  let endMock: jest.Mock;
  let poolFactory: jest.MockedFunction<DatabasePoolFactory>;

  const databaseConfig: DatabaseConfig = {
    url: 'postgresql://mistrapitos:mistrapitos@localhost:5432/mistrapitos',
    host: 'localhost',
    port: 5432,
    database: 'mistrapitos',
    user: 'mistrapitos',
    password: 'mistrapitos',
    ssl: false,
    maxConnections: 10,
    idleTimeoutMs: 30000,
    connectionTimeoutMs: 5000,
  };

  beforeEach(async () => {
    queryMock = jest.fn().mockResolvedValue({ rows: [{ ok: 1 }] });
    endMock = jest.fn().mockResolvedValue(undefined);

    poolFactory = jest.fn((config: ConstructorParameters<typeof Pool>[0]) => {
      const pool = new Pool(config);
      pool.query = queryMock;
      pool.end = endMock;
      return pool;
    }) as jest.MockedFunction<DatabasePoolFactory>;

    moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
    })
      .overrideProvider(DATABASE_CONFIG)
      .useValue(databaseConfig)
      .overrideProvider(DATABASE_POOL_FACTORY)
      .useValue(poolFactory)
      .compile();

    service = moduleRef.get(DatabaseService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should behave as a singleton inside the Nest module', () => {
    expect(moduleRef.get(DatabaseService)).toBe(moduleRef.get(DatabaseService));
    expect(poolFactory).toHaveBeenCalledTimes(1);
  });

  it('should expose a Drizzle client and the underlying pool', () => {
    expect(service.client).toBeDefined();
    expect(service.connectionPool).toBeInstanceOf(Pool);
  });

  it('should execute a simple health check query', async () => {
    await expect(service.checkConnection()).resolves.toEqual({ ok: true });
    expect(queryMock).toHaveBeenCalledWith('select 1 as ok');
  });

  it('should close the pool on module destroy', async () => {
    await service.onModuleDestroy();

    expect(endMock).toHaveBeenCalledTimes(1);
  });
});
