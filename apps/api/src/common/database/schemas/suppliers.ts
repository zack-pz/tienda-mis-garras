import {
  boolean,
  foreignKey,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { productos } from './catalog';
import { usuarios } from './auth';
import { estadoOrdenEnum } from './enums';

export const proveedores = pgTable('proveedores', {
  idProveedor: serial('id_proveedor').primaryKey(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  contacto: varchar('contacto', { length: 100 }),
  telefono: varchar('telefono', { length: 20 }),
  email: varchar('email', { length: 150 }),
  direccion: text('direccion'),
  rfc: varchar('rfc', { length: 20 }),
  notas: text('notas'),
  activo: boolean('activo').notNull().default(true),
  fechaRegistro: timestamp('fecha_registro', { mode: 'date' }).notNull().defaultNow(),
});

export const proveedoresProductos = pgTable(
  'proveedores_productos',
  {
    idProveedorProducto: serial('id_proveedor_producto').primaryKey(),
    idProveedor: integer('id_proveedor').notNull(),
    idProducto: integer('id_producto').notNull(),
    precioProveedor: numeric('precio_proveedor', { precision: 12, scale: 2, mode: 'number' }),
    tiempoEntregaDias: integer('tiempo_entrega_dias'),
  },
  (table) => [
    unique('proveedores_productos_id_proveedor_id_producto_unique').on(
      table.idProveedor,
      table.idProducto,
    ),
    foreignKey({
      columns: [table.idProveedor],
      foreignColumns: [proveedores.idProveedor],
      name: 'fk_pp_proveedor',
    }),
    foreignKey({
      columns: [table.idProducto],
      foreignColumns: [productos.idProducto],
      name: 'fk_pp_producto',
    }),
  ],
);

export const ordenesCompra = pgTable(
  'ordenes_compra',
  {
    idOrden: serial('id_orden').primaryKey(),
    idProveedor: integer('id_proveedor').notNull(),
    idUsuario: integer('id_usuario').notNull(),
    estado: estadoOrdenEnum('estado').notNull().default('PENDIENTE'),
    total: numeric('total', { precision: 12, scale: 2, mode: 'number' }).notNull().default(0),
    observaciones: text('observaciones'),
    fechaOrden: timestamp('fecha_orden', { mode: 'date' }).notNull().defaultNow(),
    fechaRecepcion: timestamp('fecha_recepcion', { mode: 'date' }),
  },
  (table) => [
    foreignKey({
      columns: [table.idProveedor],
      foreignColumns: [proveedores.idProveedor],
      name: 'fk_oc_proveedor',
    }),
    foreignKey({
      columns: [table.idUsuario],
      foreignColumns: [usuarios.idUsuario],
      name: 'fk_oc_usuario',
    }),
  ],
);

export const detalleOrdenesCompra = pgTable(
  'detalle_ordenes_compra',
  {
    idDetalle: serial('id_detalle').primaryKey(),
    idOrden: integer('id_orden').notNull(),
    idProducto: integer('id_producto').notNull(),
    cantidad: integer('cantidad').notNull(),
    precioUnitario: numeric('precio_unitario', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    subtotal: numeric('subtotal', { precision: 12, scale: 2, mode: 'number' }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idOrden],
      foreignColumns: [ordenesCompra.idOrden],
      name: 'fk_doc_orden',
    }),
    foreignKey({
      columns: [table.idProducto],
      foreignColumns: [productos.idProducto],
      name: 'fk_doc_product',
    }),
    check('detalle_ordenes_compra_cantidad_positive', sql`${table.cantidad} > 0`),
  ],
);
