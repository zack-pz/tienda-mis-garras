import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { accionAuditoriaEnum } from './enums';
import { usuarios } from './auth';

export const logAuditoria = pgTable(
  'log_auditoria',
  {
    idLog: serial('id_log').primaryKey(),
    idUsuario: integer('id_usuario'),
    accion: accionAuditoriaEnum('accion').notNull(),
    tablaAfectada: varchar('tabla_afectada', { length: 100 }),
    registroId: integer('registro_id'),
    datosAnteriores: jsonb('datos_anteriores').$type<Record<string, unknown> | null>(),
    datosNuevos: jsonb('datos_nuevos').$type<Record<string, unknown> | null>(),
    ipLocal: varchar('ip_local', { length: 45 }),
    fecha: timestamp('fecha', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.idUsuario],
      foreignColumns: [usuarios.idUsuario],
      name: 'fk_log_usuario',
    }),
    index('idx_log_usuario').on(table.idUsuario),
    index('idx_log_fecha').on(table.fecha),
    index('idx_log_accion').on(table.accion),
    index('idx_log_tabla').on(table.tablaAfectada),
    index('idx_log_datos_nuevos').using('gin', table.datosNuevos),
    index('idx_log_datos_anteriores').using('gin', table.datosAnteriores),
  ],
);
