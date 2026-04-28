import { sql } from 'drizzle-orm';
import {
  bigint,
  date,
  integer,
  numeric,
  pgView,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const vwStockBajo = pgView('vw_stock_bajo', {
  idProducto: integer('id_producto').notNull(),
  codigo: varchar('codigo', { length: 50 }).notNull(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  talla: varchar('talla', { length: 10 }),
  color: varchar('color', { length: 50 }),
  cantidad: integer('cantidad').notNull(),
  stockMinimo: integer('stock_minimo').notNull(),
  ubicacion: varchar('ubicacion', { length: 100 }),
}).as(sql`
  SELECT
    p.id_producto,
    p.codigo,
    p.nombre,
    p.talla,
    p.color,
    i.cantidad,
    i.stock_minimo,
    i.ubicacion
  FROM productos p
  JOIN inventario i ON p.id_producto = i.id_producto
  WHERE i.cantidad <= i.stock_minimo
    AND p.activo = TRUE
`);

export const vwVentasDiarias = pgView('vw_ventas_diarias', {
  fecha: date('fecha', { mode: 'string' }).notNull(),
  totalVentas: bigint('total_ventas', { mode: 'number' }).notNull(),
  ingresoTotal: numeric('ingreso_total', {
    precision: 12,
    scale: 2,
    mode: 'number',
  }),
  descuentosTotal: numeric('descuentos_total', {
    precision: 12,
    scale: 2,
    mode: 'number',
  }),
}).as(sql`
  SELECT
    v.fecha_venta::DATE AS fecha,
    COUNT(v.id_venta) AS total_ventas,
    SUM(v.total) AS ingreso_total,
    SUM(v.descuento_total) AS descuentos_total
  FROM ventas v
  WHERE v.estado = 'COMPLETADA'
  GROUP BY v.fecha_venta::DATE
`);

export const vwVentasPorVendedor = pgView('vw_ventas_por_vendedor', {
  idUsuario: integer('id_usuario').notNull(),
  vendedor: varchar('vendedor', { length: 201 }).notNull(),
  numVentas: bigint('num_ventas', { mode: 'number' }).notNull(),
  totalVendido: numeric('total_vendido', {
    precision: 12,
    scale: 2,
    mode: 'number',
  }),
}).as(sql`
  SELECT
    u.id_usuario,
    u.nombre || ' ' || u.apellido AS vendedor,
    COUNT(v.id_venta) AS num_ventas,
    SUM(v.total) AS total_vendido
  FROM ventas v
  JOIN usuarios u ON v.id_usuario = u.id_usuario
  WHERE v.estado = 'COMPLETADA'
  GROUP BY u.id_usuario, u.nombre, u.apellido
`);

export const vwProductosMasVendidos = pgView('vw_productos_mas_vendidos', {
  idProducto: integer('id_producto').notNull(),
  codigo: varchar('codigo', { length: 50 }).notNull(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  talla: varchar('talla', { length: 10 }),
  color: varchar('color', { length: 50 }),
  unidadesVendidas: bigint('unidades_vendidas', { mode: 'number' }).notNull(),
  ingresoGenerado: numeric('ingreso_generado', {
    precision: 12,
    scale: 2,
    mode: 'number',
  }),
}).as(sql`
  SELECT
    p.id_producto,
    p.codigo,
    p.nombre,
    p.talla,
    p.color,
    SUM(dv.cantidad) AS unidades_vendidas,
    SUM(dv.subtotal) AS ingreso_generado
  FROM detalle_ventas dv
  JOIN productos p ON dv.id_producto = p.id_producto
  JOIN ventas v ON dv.id_venta = v.id_venta
  WHERE v.estado = 'COMPLETADA'
  GROUP BY p.id_producto, p.codigo, p.nombre, p.talla, p.color
  ORDER BY unidades_vendidas DESC
`);

export const vwHistorialCliente = pgView('vw_historial_cliente', {
  idCliente: integer('id_cliente').notNull(),
  cliente: varchar('cliente', { length: 201 }).notNull(),
  folio: varchar('folio', { length: 30 }).notNull(),
  total: numeric('total', {
    precision: 12,
    scale: 2,
    mode: 'number',
  }).notNull(),
  metodoPago: varchar('metodo_pago', { length: 20 }).notNull(),
  fechaVenta: timestamp('fecha_venta', { mode: 'date' }).notNull(),
}).as(sql`
  SELECT
    c.id_cliente,
    c.nombre || ' ' || c.apellido AS cliente,
    v.folio,
    v.total,
    v.metodo_pago,
    v.fecha_venta
  FROM ventas v
  JOIN clientes c ON v.id_cliente = c.id_cliente
  WHERE v.estado = 'COMPLETADA'
  ORDER BY v.fecha_venta DESC
`);
