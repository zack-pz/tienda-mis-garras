import {
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { productos } from './catalog';
import { usuarios } from './auth';
import { tipoMovimientoEnum } from './enums';

export const inventario = pgTable(
  'inventario',
  {
    idInventario: serial('id_inventario').primaryKey(),
    idProducto: integer('id_producto').notNull().unique(),
    cantidad: integer('cantidad').notNull().default(0),
    stockMinimo: integer('stock_minimo').notNull().default(5),
    ubicacion: varchar('ubicacion', { length: 100 }),
    fechaActualizacion: timestamp('fecha_actualizacion', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.idProducto],
      foreignColumns: [productos.idProducto],
      name: 'fk_inventario_producto',
    }),
    check('inventario_cantidad_non_negative', sql`${table.cantidad} >= 0`),
  ],
);

export const movimientosInventario = pgTable(
  'movimientos_inventario',
  {
    idMovimiento: serial('id_movimiento').primaryKey(),
    idProducto: integer('id_producto').notNull(),
    tipo: tipoMovimientoEnum('tipo').notNull(),
    cantidad: integer('cantidad').notNull(),
    cantidadAnterior: integer('cantidad_anterior').notNull(),
    cantidadNueva: integer('cantidad_nueva').notNull(),
    motivo: text('motivo'),
    idUsuario: integer('id_usuario').notNull(),
    fecha: timestamp('fecha', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.idProducto],
      foreignColumns: [productos.idProducto],
      name: 'fk_movimientos_producto',
    }),
    foreignKey({
      columns: [table.idUsuario],
      foreignColumns: [usuarios.idUsuario],
      name: 'fk_movimientos_usuario',
    }),
    index('idx_movimientos_producto').on(table.idProducto),
    index('idx_movimientos_fecha').on(table.fecha),
  ],
);
