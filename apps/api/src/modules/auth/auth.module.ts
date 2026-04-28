import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/http/controllers/auth.controller';
import { SessionAuthGuard } from './infrastructure/http/guards/session-auth.guard';
import { DrizzleAuthSessionRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-auth-session.repository';
import { DrizzleAuthUserRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-auth-user.repository';
import { LoginLocalUseCase } from './application/use-cases/login-local.use-case';

@Module({
  controllers: [AuthController],
  providers: [
    SessionAuthGuard,
    DrizzleAuthSessionRepository,
    DrizzleAuthUserRepository,
    {
      provide: LoginLocalUseCase,
      useFactory: (
        users: DrizzleAuthUserRepository,
        sessions: DrizzleAuthSessionRepository,
      ) => new LoginLocalUseCase(users, sessions),
      inject: [DrizzleAuthUserRepository, DrizzleAuthSessionRepository],
    },
  ],
})
export class AuthModule {}
