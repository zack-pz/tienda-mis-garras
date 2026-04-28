import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../../../../../common/database/database.service';
import { roles, usuarios } from '../../../../../../common/database/schemas/auth';

@Injectable()
export class DrizzleAuthUserRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByUsername(nombreUsuario: string): Promise<{
    id: number;
    nombreUsuario: string;
    role: 'Administrador' | 'Vendedor' | 'Almacenista';
    contrasena: string;
  } | null> {
    const result = await this.database.client
      .select({
        id: usuarios.idUsuario,
        nombreUsuario: usuarios.nombreUsuario,
        role: roles.nombre,
        contrasena: usuarios.contrasena,
      })
      .from(usuarios)
      .innerJoin(roles, eq(usuarios.idRol, roles.idRol))
      .where(eq(usuarios.nombreUsuario, nombreUsuario))
      .limit(1);

    const user = result[0];
    return user
      ? {
          ...user,
          role: user.role as 'Administrador' | 'Vendedor' | 'Almacenista',
        }
      : null;
  }
}
