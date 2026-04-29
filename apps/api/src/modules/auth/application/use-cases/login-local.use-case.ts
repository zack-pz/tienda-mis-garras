import { UnauthorizedException } from '@nestjs/common';
import type { LoginRequest, LoginResponse } from '@garras/api-contracts';
import { asUserId } from '@garras/shared-types';
import { verifyPassword } from '../../domain/password-hasher';

type AuthUserRecord = {
  id: number;
  nombreUsuario: string;
  role: 'Administrador' | 'Vendedor' | 'Almacenista';
  contrasena: string;
};

type SessionRecord = {
  id: string;
  expiresAt: Date;
};

export type AuthUserRepository = {
  findByUsername: (nombreUsuario: string) => Promise<AuthUserRecord | null>;
};

export type AuthSessionRepository = {
  createSession: (userId: number) => Promise<SessionRecord>;
};

export class LoginLocalUseCase {
  constructor(
    private readonly users: AuthUserRepository,
    private readonly sessions: AuthSessionRepository,
  ) {}

  async execute(
    request: LoginRequest,
  ): Promise<{ response: LoginResponse; sessionId: string }> {
    const user = await this.users.findByUsername(request.nombreUsuario);
    if (!user || !verifyPassword(request.contrasena, user.contrasena)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const session = await this.sessions.createSession(user.id);

    return {
      sessionId: session.id,
      response: {
        ok: true,
        data: {
          expiresAt: session.expiresAt.toISOString(),
          user: {
            id: asUserId(String(user.id)),
            nombreUsuario: user.nombreUsuario,
            role: user.role,
          },
        },
      },
    };
  }
}
