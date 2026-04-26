import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { buildDatabaseUrl, resolveDatabaseConfig } from './src/common/database/database.config';

loadEnv({ quiet: true });

const databaseConfig = resolveDatabaseConfig(process.env);

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/common/database/drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: buildDatabaseUrl(databaseConfig),
  },
  verbose: true,
  strict: true,
});
