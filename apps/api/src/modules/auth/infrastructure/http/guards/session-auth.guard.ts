import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { DrizzleAuthSessionRepository } from '../../persistence/drizzle/repositories/drizzle-auth-session.repository';

type SessionRequest = Request & {
  authSession?: {
    user: { id: string; nombreUsuario: string; role: 'Administrador' | 'Vendedor' | 'Almacenista' };
    expiresAt: Date;
  };
};

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly sessions: DrizzleAuthSessionRepository) {}

  private readSessionId(cookieHeader?: string): string | undefined {
    if (!cookieHeader) return undefined;
    const token = cookieHeader
      .split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith('sid='));
    return token?.slice(4);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const sessionId = this.readSessionId(request.headers.cookie);

    if (!sessionId) {
      throw new UnauthorizedException('SESSION_EXPIRED');
    }

    const session = await this.sessions.resolveSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('SESSION_EXPIRED');
    }

    request.authSession = session;
    return true;
  }
}
