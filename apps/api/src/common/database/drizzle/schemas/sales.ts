import {
  check,
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { clientes } from './customers';
import { metodoPagoEnum, estadoVentaEnum } from './enums';
import { ofertas } from './offers';
import { usuarios } from './auth';
import { productos } from './catalog';

export const ventas = pgTable(
  'ventas',
  {
    idVenta: serial('id_venta').primaryKey(),
    folio: varchar('folio', { length: 30 }).notNull().unique(),
    idCliente: integer('id_cliente'),
    idUsuario: integer('id_usuario').notNull(),
    subtotal: numeric('subtotal', { precision: 12, scale: 2, mode: 'number' }).notNull().default(0),
    descuentoTotal: numeric('descuento_total', { precision: 12, scale: 2, mode: 'number' })
      .notNull()
      .default(0),
    impuesto: numeric('impuesto', { precision: 12, scale: 2, mode: 'number' }).notNull().default(0),
    total: numeric('total', { precision: 12, scale: 2, mode: 'number' }).notNull().default(0),
    metodoPago: metodoPagoEnum('metodo_pago').notNull(),
    estado: estadoVentaEnum('estado').notNull().default('COMPLETADA'),
    observaciones: text('observaciones'),
    fechaVenta: timestamp('fecha_venta', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.idCliente],
      foreignColumns: [clientes.idCliente],
      name: 'fk_ventas_cliente',
    }),
    foreignKey({
      columns: [table.idUsuario],
      foreignColumns: [usuarios.idUsuario],
      name: 'fk_ventas_usuario',
    }),
    index('idx_ventas_fecha').on(table.fechaVenta),
    index('idx_ventas_cliente').on(table.idCliente),
  ],
);

export const detalleVentas = pgTable(
  'detalle_ventas',
  {
    idDetalle: serial('id_detalle').primaryKey(),
    idVenta: integer('id_venta').notNull(),
    idProducto: integer('id_producto').notNull(),
    cantidad: integer('cantidad').notNull(),
    precioUnitario: numeric('precio_unitario', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    idOferta: integer('id_oferta'),
    descuento: numeric('descuento', { precision: 12, scale: 2, mode: 'number' }).notNull().default(0),
    subtotal: numeric('subtotal', { precision: 12, scale: 2, mode: 'number' }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idVenta],
      foreignColumns: [ventas.idVenta],
      name: 'fk_dv_venta',
    }),
    foreignKey({
      columns: [table.idProducto],
      foreignColumns: [productos.idProducto],
      name: 'fk_dv_producto',
    }),
    foreignKey({
      columns: [table.idOferta],
      foreignColumns: [ofertas.idOferta],
      name: 'fk_dv_oferta',
    }),
    check('detalle_ventas_cantidad_positive', sql`${table.cantidad} > 0`),
    index('idx_detalle_venta').on(table.idVenta),
    index('idx_detalle_producto').on(table.idProducto),
  ],
);

export const pagos = pgTable(
  'pagos',
  {
    idPago: serial('id_pago').primaryKey(),
    idVenta: integer('id_venta').notNull(),
    monto: numeric('monto', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    metodoPago: metodoPagoEnum('metodo_pago').notNull(),
    referencia: varchar('referencia', { length: 100 }),
    fechaPago: timestamp('fecha_pago', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.idVenta],
      foreignColumns: [ventas.idVenta],
      name: 'fk_pagos_venta',
    }),
    check('pagos_monto_positive', sql`${table.monto} > 0`),
  ],
);
