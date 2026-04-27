import {
  boolean,
  customType,
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
import { generoEnum } from './enums';

const pgBytea = customType<{ data: Buffer | Uint8Array | null }>({
  dataType() {
    return 'bytea';
  },
});

export const categorias = pgTable('categorias', {
  idCategoria: serial('id_categoria').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull().unique(),
  descripcion: text('descripcion'),
  activo: boolean('activo').notNull().default(true),
  fechaCreacion: timestamp('fecha_creacion', { mode: 'date' }).notNull().defaultNow(),
});

export const productos = pgTable(
  'productos',
  {
    idProducto: serial('id_producto').primaryKey(),
    codigo: varchar('codigo', { length: 50 }).notNull().unique(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    descripcion: text('descripcion'),
    idCategoria: integer('id_categoria'),
    talla: varchar('talla', { length: 10 }),
    color: varchar('color', { length: 50 }),
    genero: generoEnum('genero'),
    precioCompra: numeric('precio_compra', { precision: 12, scale: 2, mode: 'number' })
      .notNull()
      .default(0),
    precioVenta: numeric('precio_venta', { precision: 12, scale: 2, mode: 'number' })
      .notNull()
      .default(0),
    imagen: pgBytea('imagen'),
    activo: boolean('activo').notNull().default(true),
    fechaCreacion: timestamp('fecha_creacion', { mode: 'date' }).notNull().defaultNow(),
    fechaModificacion: timestamp('fecha_modificacion', { mode: 'date' }),
  },
  (table) => [
    foreignKey({
      columns: [table.idCategoria],
      foreignColumns: [categorias.idCategoria],
      name: 'fk_productos_categoria',
    }),
    index('idx_productos_categoria').on(table.idCategoria),
    index('idx_productos_nombre').on(table.nombre),
  ],
);
