import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CONFIG, DATABASE_POOL_FACTORY } from './database.constants';
import { resolveDatabaseConfig } from './database.config';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONFIG,
      useFactory: () => resolveDatabaseConfig(process.env),
    },
    {
      provide: DATABASE_POOL_FACTORY,
      useValue: (config: ConstructorParameters<typeof Pool>[0]) =>
        new Pool(config),
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
