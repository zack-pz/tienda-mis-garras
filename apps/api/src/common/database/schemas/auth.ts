import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  idRol: serial('id_rol').primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull().unique(),
  descripcion: text('descripcion'),
  activo: boolean('activo').notNull().default(true),
  fechaCreacion: timestamp('fecha_creacion', { mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const usuarios = pgTable(
  'usuarios',
  {
    idUsuario: serial('id_usuario').primaryKey(),
    nombre: varchar('nombre', { length: 100 }).notNull(),
    apellido: varchar('apellido', { length: 100 }).notNull(),
    nombreUsuario: varchar('nombre_usuario', { length: 50 }).notNull().unique(),
    contrasena: text('contrasena').notNull(),
    idRol: integer('id_rol').notNull(),
    activo: boolean('activo').notNull().default(true),
    fechaCreacion: timestamp('fecha_creacion', { mode: 'date' })
      .notNull()
      .defaultNow(),
    ultimoAcceso: timestamp('ultimo_acceso', { mode: 'date' }),
  },
  (table) => [
    foreignKey({
      columns: [table.idRol],
      foreignColumns: [roles.idRol],
      name: 'fk_usuarios_rol',
    }),
  ],
);

export const permisos = pgTable(
  'permisos',
  {
    idPermiso: serial('id_permiso').primaryKey(),
    idRol: integer('id_rol').notNull(),
    modulo: varchar('modulo', { length: 50 }).notNull(),
    puedeLeer: boolean('puede_leer').notNull().default(false),
    puedeCrear: boolean('puede_crear').notNull().default(false),
    puedeEditar: boolean('puede_editar').notNull().default(false),
    puedeEliminar: boolean('puede_eliminar').notNull().default(false),
  },
  (table) => [
    unique('permisos_id_rol_modulo_unique').on(table.idRol, table.modulo),
    foreignKey({
      columns: [table.idRol],
      foreignColumns: [roles.idRol],
      name: 'fk_permisos_rol',
    }),
  ],
);
