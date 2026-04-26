import { buildDatabaseUrl, buildPoolConfig, resolveDatabaseConfig } from './database.config';

describe('database.config', () => {
  describe('resolveDatabaseConfig', () => {
    it('should prioritize DATABASE_URL when it is present', () => {
      const config = resolveDatabaseConfig({
        DATABASE_URL: 'postgresql://user:secret@db:5432/tienda',
      });

      expect(config.url).toBe('postgresql://user:secret@db:5432/tienda');
      expect(config.host).toBe('localhost');
      expect(config.port).toBe(5432);
      expect(config.database).toBe('mistrapitos');
    });

    it('should resolve discrete database variables and pool settings', () => {
      const config = resolveDatabaseConfig({
        DB_HOST: 'postgres',
        DB_PORT: '6543',
        DB_NAME: 'inventario',
        DB_USER: 'api_user',
        DB_PASSWORD: 'super-secret',
        DB_SSL: 'true',
        DB_POOL_MAX: '20',
        DB_IDLE_TIMEOUT_MS: '60000',
        DB_CONNECTION_TIMEOUT_MS: '7000',
      });

      expect(config).toEqual({
        url: undefined,
        host: 'postgres',
        port: 6543,
        database: 'inventario',
        user: 'api_user',
        password: 'super-secret',
        ssl: true,
        maxConnections: 20,
        idleTimeoutMs: 60000,
        connectionTimeoutMs: 7000,
      });
    });

    it('should throw when DB_PORT is invalid', () => {
      expect(() => resolveDatabaseConfig({ DB_PORT: 'not-a-port' })).toThrow(
        'Invalid DB_PORT: expected a positive integer.',
      );
    });
  });

  describe('buildDatabaseUrl', () => {
    it('should return DATABASE_URL when provided', () => {
      const url = buildDatabaseUrl({
        url: 'postgresql://user:secret@db:5432/tienda',
        host: 'ignored',
        port: 5432,
        database: 'ignored',
        user: 'ignored',
        password: 'ignored',
        ssl: false,
        maxConnections: 10,
        idleTimeoutMs: 30000,
        connectionTimeoutMs: 5000,
      });

      expect(url).toBe('postgresql://user:secret@db:5432/tienda');
    });

    it('should assemble a URL from discrete settings when DATABASE_URL is absent', () => {
      const url = buildDatabaseUrl({
        url: undefined,
        host: 'postgres',
        port: 5432,
        database: 'mistrapitos',
        user: 'mistrapitos',
        password: 'mistrapitos',
        ssl: false,
        maxConnections: 10,
        idleTimeoutMs: 30000,
        connectionTimeoutMs: 5000,
      });

      expect(url).toBe('postgresql://mistrapitos:mistrapitos@postgres:5432/mistrapitos');
    });
  });

  describe('buildPoolConfig', () => {
    it('should build a pool config using the connection string when available', () => {
      const poolConfig = buildPoolConfig({
        url: 'postgresql://user:secret@db:5432/tienda',
        host: 'ignored',
        port: 5432,
        database: 'ignored',
        user: 'ignored',
        password: 'ignored',
        ssl: true,
        maxConnections: 25,
        idleTimeoutMs: 45000,
        connectionTimeoutMs: 8000,
      });

      expect(poolConfig).toMatchObject({
        connectionString: 'postgresql://user:secret@db:5432/tienda',
        max: 25,
        idleTimeoutMillis: 45000,
        connectionTimeoutMillis: 8000,
        ssl: { rejectUnauthorized: false },
      });
    });
  });
});
