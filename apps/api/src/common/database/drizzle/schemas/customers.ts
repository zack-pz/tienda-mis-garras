import { boolean, index, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const clientes = pgTable(
  'clientes',
  {
    idCliente: serial('id_cliente').primaryKey(),
    nombre: varchar('nombre', { length: 100 }).notNull(),
    apellido: varchar('apellido', { length: 100 }).notNull(),
    telefono: varchar('telefono', { length: 20 }),
    email: varchar('email', { length: 150 }),
    direccion: text('direccion'),
    notas: text('notas'),
    activo: boolean('activo').notNull().default(true),
    fechaRegistro: timestamp('fecha_registro', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('idx_clientes_nombre').on(table.nombre, table.apellido)],
);
