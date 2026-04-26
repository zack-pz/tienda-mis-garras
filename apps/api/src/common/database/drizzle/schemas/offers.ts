import {
  boolean,
  check,
  date,
  foreignKey,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { usuarios } from './auth';
import { categorias, productos } from './catalog';
import { tipoDescuentoEnum } from './enums';

export const ofertas = pgTable(
  'ofertas',
  {
    idOferta: serial('id_oferta').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    descripcion: text('descripcion'),
    tipoDescuento: tipoDescuentoEnum('tipo_descuento').notNull(),
    valorDescuento: numeric('valor_descuento', { precision: 12, scale: 2, mode: 'number' })
      .notNull(),
    fechaInicio: date('fecha_inicio', { mode: 'string' }).notNull(),
    fechaFin: date('fecha_fin', { mode: 'string' }).notNull(),
    activo: boolean('activo').notNull().default(true),
    idUsuarioCreo: integer('id_usuario_creo').notNull(),
    fechaCreacion: timestamp('fecha_creacion', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.idUsuarioCreo],
      foreignColumns: [usuarios.idUsuario],
      name: 'fk_ofertas_usuario',
    }),
    check('ofertas_valor_descuento_positive', sql`${table.valorDescuento} > 0`),
    check('chk_fechas_oferta', sql`${table.fechaFin} >= ${table.fechaInicio}`),
  ],
);

export const ofertasProductos = pgTable(
  'ofertas_productos',
  {
    idOfertaProducto: serial('id_oferta_producto').primaryKey(),
    idOferta: integer('id_oferta').notNull(),
    idProducto: integer('id_producto').notNull(),
  },
  (table) => [
    unique('ofertas_productos_id_oferta_id_producto_unique').on(table.idOferta, table.idProducto),
    foreignKey({
      columns: [table.idOferta],
      foreignColumns: [ofertas.idOferta],
      name: 'fk_op_oferta',
    }),
    foreignKey({
      columns: [table.idProducto],
      foreignColumns: [productos.idProducto],
      name: 'fk_op_producto',
    }),
  ],
);

export const ofertasCategorias = pgTable(
  'ofertas_categorias',
  {
    idOfertaCategoria: serial('id_oferta_categoria').primaryKey(),
    idOferta: integer('id_oferta').notNull(),
    idCategoria: integer('id_categoria').notNull(),
  },
  (table) => [
    unique('ofertas_categorias_id_oferta_id_categoria_unique').on(
      table.idOferta,
      table.idCategoria,
    ),
    foreignKey({
      columns: [table.idOferta],
      foreignColumns: [ofertas.idOferta],
      name: 'fk_oc_oferta',
    }),
    foreignKey({
      columns: [table.idCategoria],
      foreignColumns: [categorias.idCategoria],
      name: 'fk_oc_categoria',
    }),
  ],
);
