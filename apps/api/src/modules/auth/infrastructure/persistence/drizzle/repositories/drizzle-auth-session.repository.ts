import { Injectable } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../../../../../../common/database/database.service';
import { authSessions, roles, usuarios } from '../../../../../../common/database/schemas/auth';
import { createInactivityExpiry } from '../../../../domain/session-policy';

@Injectable()
export class DrizzleAuthSessionRepository {
  constructor(private readonly database: DatabaseService) {}

  async createSession(userId: number): Promise<{ id: string; expiresAt: Date }> {
    const now = new Date();
    const sessionId = randomUUID();
    const expiresAt = createInactivityExpiry(now);

    await this.database.client.insert(authSessions).values({
      id: sessionId,
      userId,
      lastActivityAt: now,
      expiresAt,
      revokedAt: null,
    });

    return { id: sessionId, expiresAt };
  }

  async resolveSession(sessionId: string): Promise<{
    user: { id: string; nombreUsuario: string; role: 'Administrador' | 'Vendedor' | 'Almacenista' };
    expiresAt: Date;
  } | null> {
    const now = new Date();
    const result = await this.database.client
      .select({
        id: usuarios.idUsuario,
        nombreUsuario: usuarios.nombreUsuario,
        role: roles.nombre,
        expiresAt: authSessions.expiresAt,
      })
      .from(authSessions)
      .innerJoin(usuarios, eq(authSessions.userId, usuarios.idUsuario))
      .innerJoin(roles, eq(usuarios.idRol, roles.idRol))
      .where(
        and(
          eq(authSessions.id, sessionId),
          isNull(authSessions.revokedAt),
          gt(authSessions.expiresAt, now),
        ),
      )
      .limit(1);

    const record = result[0];
    if (!record) return null;

    const nextExpiry = createInactivityExpiry(now);
    await this.database.client
      .update(authSessions)
      .set({ lastActivityAt: now, expiresAt: nextExpiry })
      .where(eq(authSessions.id, sessionId));

    return {
      user: {
        id: String(record.id),
        nombreUsuario: record.nombreUsuario,
        role: record.role as 'Administrador' | 'Vendedor' | 'Almacenista',
      },
      expiresAt: nextExpiry,
    };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.database.client
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(eq(authSessions.id, sessionId));
  }
}
